const readEnv = (key) => {
  const raw =
    import.meta.env[key] ??
    (typeof process !== 'undefined' ? process.env[key] : undefined)
  return typeof raw === 'string' ? raw.trim() : raw
}

const API_KEY = readEnv('VITE_OPENWEATHER_API_KEY')
const DEFAULT_LATITUDE =
  Number(readEnv('VITE_SITE_LATITUDE')) || 51.0447
const DEFAULT_LONGITUDE =
  Number(readEnv('VITE_SITE_LONGITUDE')) || -114.0719
const API_BASE = 'https://api.openweathermap.org/data/2.5'

const ensureApiKey = () => {
  if (!API_KEY) {
    throw new Error('Missing OpenWeather API key. Set VITE_OPENWEATHER_API_KEY in your environment.')
  }
  return API_KEY
}

const buildUrl = (path, params = {}) => {
  const query = new URLSearchParams({
    appid: ensureApiKey(),
    units: 'metric',
    lat: String(DEFAULT_LATITUDE),
    lon: String(DEFAULT_LONGITUDE),
    ...Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
    ),
  })

  return `${API_BASE}${path}?${query.toString()}`
}

export const fetchCurrentWeather = async (options = {}) => {
  const url = buildUrl('/weather', options)
  const response = await fetch(url)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenWeather current weather failed (${response.status}): ${errorText}`)
  }

  const data = await response.json()

  return {
    temperature: data?.main?.temp ?? null,
    feelsLike: data?.main?.feels_like ?? null,
    humidity: data?.main?.humidity ?? null,
    pressure: data?.main?.pressure ?? null,
    windSpeed: data?.wind?.speed ?? null,
    windDeg: data?.wind?.deg ?? null,
    description: data?.weather?.[0]?.description ?? null,
    icon: data?.weather?.[0]?.icon ?? null,
    sunrise: data?.sys?.sunrise ?? null,
    sunset: data?.sys?.sunset ?? null,
    locationName: data?.name ?? null,
    raw: data,
  }
}

export const fetchForecast = async (options = {}) => {
  const url = buildUrl('/forecast', options)
  const response = await fetch(url)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenWeather forecast failed (${response.status}): ${errorText}`)
  }

  const data = await response.json()

  const hourly = Array.isArray(data?.list)
    ? data.list.slice(0, 8).map((entry) => ({
        timestamp: entry?.dt ?? null,
        temperature: entry?.main?.temp ?? null,
        precipitationProbability: entry?.pop ?? null,
        weather: entry?.weather?.[0]?.main ?? null,
      }))
    : []

  return {
    locationName: data?.city?.name ?? null,
    sunrise: data?.city?.sunrise ?? null,
    sunset: data?.city?.sunset ?? null,
    hourly,
    raw: data,
  }
}

