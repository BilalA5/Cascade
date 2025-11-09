import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

const REGION =
  import.meta.env.VITE_AWS_REGION ??
  (typeof process !== 'undefined' ? process.env.VITE_AWS_REGION : undefined) ??
  'us-east-2'

const TABLE_NAME =
  import.meta.env.VITE_DYNAMODB_TABLE_NAME ??
  (typeof process !== 'undefined' ? process.env.VITE_DYNAMODB_TABLE_NAME : undefined) ??
  'CascadeReadings'

const REQUIRED_ENV = [REGION, TABLE_NAME]

if (REQUIRED_ENV.some((value) => !value) && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    'Missing DynamoDB environment variables. Check VITE_AWS_REGION and VITE_DYNAMODB_TABLE_NAME.'
  )
}

const clientConfig = {}

if (REGION) {
  clientConfig.region = REGION
} else if (import.meta.env.DEV) {
  console.warn(
    'DynamoDB region not configured. Falling back to us-east-2. Set VITE_AWS_REGION in your environment.'
  )
  clientConfig.region = 'us-east-2'
}

const ACCESS_KEY =
  import.meta.env.VITE_AWS_ACCESS_KEY_ID ??
  (typeof process !== 'undefined' ? process.env.VITE_AWS_ACCESS_KEY_ID : undefined)
const SECRET_KEY =
  import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ??
  (typeof process !== 'undefined' ? process.env.VITE_AWS_SECRET_ACCESS_KEY : undefined)

if (ACCESS_KEY && SECRET_KEY) {
  clientConfig.credentials = {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  }
}

const client = new DynamoDBClient(clientConfig)
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { convertEmptyValues: true },
})

const normaliseReading = (item = {}) => ({
  deviceId: item.device_id,
  timestamp: item.timestamp,
  moisture: item.moisture != null ? Number(item.moisture) : undefined,
  moisturePct: item.moisture_pct != null ? Number(item.moisture_pct) : undefined,
  humidity: item.humidity != null ? Number(item.humidity) : undefined,
  pestScore: item.pest_score != null ? Number(item.pest_score) : undefined,
  healthScore:
    item.health_score != null ? Number(item.health_score) : undefined,
})

class DynamoDBService {
  constructor() {
    this.tableName = TABLE_NAME
  }

  async getReadings(deviceId = 'ESP32_01', options = {}) {
    const {
      limit = 50,
      startKey = null,
      sortOrder = 'desc',
      startTime = null,
      endTime = null,
    } = options

    try {
      let keyConditionExpression = 'device_id = :deviceId'
      const expressionAttributeValues = {
        ':deviceId': deviceId,
      }

      const expressionAttributeNames = {}

      if (startTime && endTime) {
        keyConditionExpression += ' AND #timestamp BETWEEN :startTime AND :endTime'
        expressionAttributeValues[':startTime'] = startTime
        expressionAttributeValues[':endTime'] = endTime
        expressionAttributeNames['#timestamp'] = 'timestamp'
      }

      const params = {
        TableName: this.tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        Limit: limit,
        ScanIndexForward: sortOrder === 'asc',
      }

      if (Object.keys(expressionAttributeNames).length) {
        params.ExpressionAttributeNames = expressionAttributeNames
      }

      if (startKey) {
        params.ExclusiveStartKey = startKey
      }

      const command = new QueryCommand(params)
      const result = await docClient.send(command)

      return {
        items: (result.Items || []).map(normaliseReading),
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count ?? 0,
        scannedCount: result.ScannedCount ?? 0,
      }
    } catch (error) {
      console.error('Error fetching readings:', error)
      throw new Error(`Failed to fetch readings: ${error.message}`)
    }
  }

  async getLatestReading(deviceId = 'ESP32_01') {
    const result = await this.getReadings(deviceId, { limit: 1 })
    return result.items?.[0] ?? null
  }

  async getReadingsInRange(deviceId, startTime, endTime, limit = 100) {
    return this.getReadings(deviceId, {
      startTime,
      endTime,
      limit,
      sortOrder: 'desc',
    })
  }

  async getAllReadings(deviceId = 'ESP32_01', maxItems = 1000) {
    const allItems = []
    let lastEvaluatedKey = null
    let totalFetched = 0

    do {
      const result = await this.getReadings(deviceId, {
        limit: Math.min(100, maxItems - totalFetched),
        startKey: lastEvaluatedKey,
      })

      allItems.push(...result.items)
      lastEvaluatedKey = result.lastEvaluatedKey
      totalFetched += result.items.length
    } while (lastEvaluatedKey && totalFetched < maxItems)

    return allItems
  }
}

export const dynamoDBService = new DynamoDBService()

