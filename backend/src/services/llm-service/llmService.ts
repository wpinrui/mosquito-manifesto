import OpenAI from "openai";
import "dotenv/config";

export const LlmClient = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});
