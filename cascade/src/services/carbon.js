const readEnv = (key) => {
  const raw =
    import.meta.env[key] ??
    (typeof process !== 'undefined' ? process.env[key] : undefined)
  return typeof raw === 'string' ? raw.trim() : raw
}

const API_BASE = 'https://www.carboninterface.com/api/v1'
const API_KEY = readEnv('VITE_CARBON_API_KEY')

const ensureApiKey = () => {
  if (!API_KEY) {
    throw new Error('Missing Carbon Interface API key. Set VITE_CARBON_API_KEY in your environment.')
  }
  return API_KEY
}

const buildHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${ensureApiKey()}`,
})

const defaultElectricityPayload = {
  type: 'electricity',
  electricity_unit: 'kwh',
  electricity_value: 25,
  country: 'us',
  state: 'ca',
}

export const fetchIrrigationCarbonEstimate = async (overridePayload = {}) => {
  const body = {
    ...defaultElectricityPayload,
    ...overridePayload,
  }

  const response = await fetch(`${API_BASE}/estimates`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Carbon Interface request failed (${response.status}): ${errorText}`)
  }

  const result = await response.json()
  const attributes = result?.data?.attributes

  return {
    carbonKg: attributes?.carbon_kg ?? null,
    carbonLb: attributes?.carbon_lb ?? null,
    carbonMt: attributes?.carbon_mt ?? null,
    country: attributes?.country ?? body.country,
    state: attributes?.state ?? body.state,
    electricityValue: attributes?.electricity_value ?? body.electricity_value,
    electricityUnit: attributes?.electricity_unit ?? body.electricity_unit,
    estimationId: result?.data?.id ?? null,
    raw: result,
  }
}

export const fetchLatestProjects = async () => {
  const response = await fetch(`${API_BASE}/projects`, {
    headers: buildHeaders(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Unable to fetch carbon projects (${response.status}): ${errorText}`)
  }

  const result = await response.json()
  return Array.isArray(result?.data) ? result.data : []
}

