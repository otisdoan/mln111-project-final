/**
 * OpenRouter AI Client (supports 50+ models)
 */

import OpenAI from "openai";
import { buildPrompt } from "./prompts";

// Initialize OpenRouter client
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": "https://mln111.app",
    "X-Title": "MLN111 Learning App",
  },
});

/**
 * Generate AI response using OpenRouter with multiple model fallback
 */
export async function generateResponse(
  context: string,
  question: string,
  lessons?: { slug: string; title: string }[]
): Promise<string> {
  // Check if API key exists
  if (!process.env.EXPO_PUBLIC_OPENROUTER_API_KEY) {
    console.error("❌ Missing EXPO_PUBLIC_OPENROUTER_API_KEY");
    return "Xin lỗi, hệ thống AI chưa được cấu hình. Vui lòng thêm API key vào .env file.";
  }

  // Build system prompt with context and lessons
  const systemPrompt = buildPrompt(context, "", lessons);

  // Try multiple FREE models in order
  const modelsToTry = [
    "google/gemini-2.0-flash-exp:free", // Gemini 2.0 (free, fast)
    "meta-llama/llama-3.2-3b-instruct:free", // Llama 3.2 (free)
    "mistralai/mistral-7b-instruct:free", // Mistral 7B (free)
  ];

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    try {
      // Only log first attempt
      if (i === 0) {
        console.log(`🤖 Calling AI via OpenRouter...`);
      }

      const completion = await openrouter.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 800,
      });

      const text = completion.choices[0]?.message?.content || "";

      if (text) {
        console.log(`✅ AI response received from ${modelName.split("/")[0]}`);

        // Append lesson links section if available
        let finalResponse = text;
        if (lessons && lessons.length > 0) {
          finalResponse += "\n\n📚 **Bài học liên quan:**\n";
          lessons.forEach((lesson) => {
            finalResponse += `• [${lesson.title}](lesson://${lesson.slug})\n`;
          });
        }

        return finalResponse;
      }
    } catch (error: any) {
      // Only log if last model failed
      if (i === modelsToTry.length - 1) {
        console.error(`❌ All OpenRouter models failed:`, error.message);
      }

      // If this is the last model, return error message
      if (i === modelsToTry.length - 1) {
        // Handle specific errors
        if (
          error.message?.includes("API key") ||
          error.message?.includes("401")
        ) {
          return "Xin lỗi, API key không hợp lệ.\n\n💡 Lấy key miễn phí tại: https://openrouter.ai/keys";
        }

        if (
          error.message?.includes("quota") ||
          error.message?.includes("429") ||
          error.message?.includes("rate limit")
        ) {
          return "⏰ Đã vượt quota hôm nay.\n\n💡 Giải pháp:\n- Đợi vài phút rồi thử lại\n- Hoặc tạo API key mới tại: https://openrouter.ai/keys\n- Free tier: 10-20 requests/day/model";
        }

        if (
          error.message?.includes("overloaded") ||
          error.message?.includes("503")
        ) {
          return "Xin lỗi, server AI đang quá tải. Vui lòng thử lại sau vài giây. ⏳";
        }

        if (error.message?.includes("network")) {
          return "Xin lỗi, không thể kết nối đến server AI. Vui lòng kiểm tra kết nối internet. 📡";
        }

        return "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại. 🔄\n\nNếu lỗi tiếp tục, vui lòng kiểm tra API key tại: https://openrouter.ai/keys";
      }

      // Try next model after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return "Xin lỗi, không thể kết nối đến AI. Vui lòng thử lại sau. 🔄";
}

/**
 * Validate question before sending to AI
 */
export function validateQuestion(question: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = question.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Câu hỏi không được để trống" };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: "Câu hỏi quá ngắn (tối thiểu 2 ký tự)" };
  }

  if (trimmed.length > 500) {
    return { valid: false, error: "Câu hỏi quá dài (tối đa 500 ký tự)" };
  }

  return { valid: true };
}
