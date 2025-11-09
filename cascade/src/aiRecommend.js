import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function getRecommendation(moisture, pest_score) {
  const prompt = `
You are an agricultural plant health assistant. 
You will receive two inputs and produce recommendations:

Moisture Level: ${moisture}%
Pest Probability Score: ${pest_score}

Provide:
1) One short sentence describing the plant condition.
2) One sentence describing pest risk.
3) 2–4 clear actions the user should take.

Be simple, direct, and helpful.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
