# Important libraries
import boto3, json, os, pandas as pd
from datetime import datetime

# Establish S3 and DB connection
s3 = boto3.client('S3')
dynamodb = boto3.resource('dynamodb')

#dynamo and s3 constants
TABLE = os.environ.get('TABLE_NAME', 'CascadeReadings')
BUCKET = os.environ.get('BUCKET_NAME', 'cascade-reports')

#Create Lambda Handler Function to Ingest and Process Data
def lambda_handler(event,context):
    
    #Get the data and store it into DynamoDB
    try : 
        body = json.loads(event.get("body", "{}"))

        #Validate Required Fields
        required = ["device_id", "timestamp", "moisture", "pest_score", "health_score"]
        missing = [f for f in required if f not in body]
        if missing:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": f"Missing fields: {', '.join(missing)}"})
            }
        
        # Validate timestamp format
        try:
            datetime.fromisoformat(body["timestamp"].replace("Z", ""))
        except ValueError:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Invalid timestamp format. Must be ISO8601 (e.g., 2025-11-09T01:35:24Z)."})
            }
        
        # Write to DynamoDB
        table = dynamodb.Table(TABLE)
        table.put_item(Item=body)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Data stored successfully.", "item": body})
        }

    except Exception as e:
        print("Error:", e)
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
