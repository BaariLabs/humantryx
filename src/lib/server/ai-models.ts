import { env } from "@/env";
import { ChatGroq } from "@langchain/groq";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const groqModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

export const getGeminiEmbeddings = () =>
  new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: env.GOOGLE_API_KEY,
  });
