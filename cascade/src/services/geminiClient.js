const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ??
  (typeof process !== 'undefined' ? process.env.VITE_GEMINI_API_KEY : undefined)

const DEFAULT_MODEL =
  import.meta.env.VITE_GEMINI_MODEL ??
  (typeof process !== 'undefined' ? process.env.VITE_GEMINI_MODEL : undefined) ??
  'gemini-1.5-flash'

const BASE_URL = 'https://generativelanguage.googleapis.com/v1/models'

export const getGeminiApiKey = () => {
  if (!API_KEY) {
    throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in your environment.')
  }
  return API_KEY
}

export const getGeminiModel = () => DEFAULT_MODEL

export const callGemini = async (body, modelOverride) => {
  const model = modelOverride ?? DEFAULT_MODEL
  const endpoint = `${BASE_URL}/${model}:generateContent?key=${encodeURIComponent(getGeminiApiKey())}`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Gemini API request failed (${response.status}): ${errorText}`,
    )
  }

  return response.json()
}

