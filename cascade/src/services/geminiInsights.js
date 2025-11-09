import { getGeminiModel } from './geminiClient'

const MAX_INSIGHTS = 3

const buildPrompt = ({
  moisturePercent,
  pestPercent,
  ph,
  recentMoisture = [],
  recentPest = [],
}) => {
  const moistureTrend = recentMoisture.slice(0, 6).map((value, index) => `Reading ${index + 1}: ${value ?? 'unknown'}%`).join('\n')
  const pestTrend = recentPest.slice(0, 6).map((value, index) => `Reading ${index + 1}: ${value ?? 'unknown'}%`).join('\n')

  return `
You are an agronomy assistant providing actionable insights for a farmer.

Current field readings:
- Soil moisture: ${moisturePercent ?? 'unknown'}%
- Pest detection score: ${pestPercent ?? 'unknown'}%
- Soil pH: ${ph ?? 'unknown'}

Recent moisture history:
${moistureTrend || 'No recent moisture history.'}

Recent pest history:
${pestTrend || 'No recent pest history.'}

Based on these numbers, generate up to ${MAX_INSIGHTS} concise recommendations.

Return your answer strictly as JSON in this shape:
[
  {
    "title": "short headline (max 6 words)",
    "body": "2 sentence explanation with specific actions referenced to the numbers."
  }
]

Do not include any leading text, Markdown, or explanations—only the JSON array.
`
}

const stripCodeFences = (text) => {
  const trimmed = text.trim()
  if (trimmed.startsWith('```')) {
    const withoutFence = trimmed.replace(/^```(?:json)?/i, '')
    const closingIndex = withoutFence.lastIndexOf('```')
    return closingIndex >= 0
      ? withoutFence.slice(0, closingIndex).trim()
      : withoutFence.trim()
  }
  return trimmed
}

const extractJsonSegment = (text) => {
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) {
    return text
  }
  return text.slice(start, end + 1)
}

const parseJsonArray = (text) => {
  try {
    const cleaned = extractJsonSegment(stripCodeFences(text))
    const parsed = JSON.parse(cleaned)
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => item && item.title && item.body)
        .slice(0, MAX_INSIGHTS)
    }
  } catch {
    // ignore parsing failure
  }
  return null
}

const parseFallback = (text) => {
  return stripCodeFences(text)
    .split('\n')
    .map((line) => line.trim().replace(/^[*-]\s*/, ''))
    .filter(Boolean)
    .slice(0, MAX_INSIGHTS)
    .map((entry, index) => ({
      title: `Insight ${index + 1}`,
      body: entry,
    }))
}

export const fetchGeminiInsights = async (metrics) => {
  const model = getGeminiModel()
  const prompt = buildPrompt(metrics)

  const response = await model.generateContent(prompt)
  const text = response.response.text()

  const parsed = parseJsonArray(text)
  if (parsed) {
    return parsed.map((item) => ({
      title: item.title.trim(),
      body: item.body.trim(),
    }))
  }

  const fallback = parseFallback(text)
  if (fallback.length) {
    return fallback
  }

  throw new Error('Gemini response could not be parsed')
}

