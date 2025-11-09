import { GoogleGenerativeAI } from '@google/generative-ai'

let client
let model

const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ??
  (typeof process !== 'undefined' ? process.env.VITE_GEMINI_API_KEY : undefined)

export const getGeminiClient = () => {
  if (!API_KEY) {
    throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in your environment.')
  }
  if (!client) {
    client = new GoogleGenerativeAI(API_KEY)
  }
  return client
}

export const getGeminiModel = () => {
  if (!model) {
    model = getGeminiClient().getGenerativeModel({ model: 'gemini-1.5-flash' })
  }
  return model
}

