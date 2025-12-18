/**
 * Google Gemini AI Client
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "./prompts";

// Khởi tạo Gemini client
// API key sẽ được lấy từ environment variable
const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || ""
);

/**
 * Generate AI response using Gemini with retry and fallback
 */
export async function generateResponse(
  context: string,
  question: string,
  lessons?: { slug: string; title: string }[]
): Promise<string> {
  // Check if API key exists
  if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    console.error("❌ Missing EXPO_PUBLIC_GEMINI_API_KEY");
    return "Xin lỗi, hệ thống AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.";
  }

  // Build prompt with lesson metadata for link generation
  const prompt = buildPrompt(context, question, lessons);

  // Try multiple models in order (lite models have better availability)
  const modelsToTry = [
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash",
    "gemini-exp-1206",
  ];

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    try {
      // Only log first attempt to reduce console spam
      if (i === 0) {
        console.log(`🤖 Calling AI...`);
      }

      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log(`✅ AI response received`);
      return text;
    } catch (error: any) {
      // Only log error if this is the last model (all failed)
      if (i === modelsToTry.length - 1) {
        console.error(
          `❌ All AI models failed. Full error:`,
          error.message || error
        );
      }

      // If this is the last model, return error message
      if (i === modelsToTry.length - 1) {
        // Handle specific errors
        if (error.message?.includes("API key")) {
          return "Xin lỗi, API key không hợp lệ. Vui lòng kiểm tra cấu hình.";
        }

        if (
          error.message?.includes("quota") ||
          error.message?.includes("429") ||
          error.message?.includes("RESOURCE_EXHAUSTED")
        ) {
          return "⏰ API đã vượt quota hôm nay.\n\n💡 Giải pháp:\n- Đợi đến ngày mai (quota reset 0h UTC)\n- Hoặc tạo API key mới tại: https://aistudio.google.com/apikey\n- Hoặc nâng cấp lên Paid Plan ($0.075/1M tokens)";
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

        return "Xin lỗi, đã có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại. 🔄";
      }

      // Try next model after a short delay
      console.log(`⏳ Trying next model...`);
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

/**
 * Check if question is within scope
 * Returns true if likely in-scope, false otherwise
 */
export function isQuestionInScope(question: string): boolean {
  const keywords = [
    "giai cấp",
    "đấu tranh",
    "công nhân",
    "tư sản",
    "marx",
    "lenin",
    "cách mạng",
    "phong kiến",
    "nô lệ",
    "xã hội",
    "kinh tế",
    "chính trị",
    "lịch sử",
    "nguồn gốc",
    "tầng lớp",
    "giá trị thặng dư",
    "tư liệu sản xuất",
    "quan hệ sản xuất",
    "liên minh",
  ];

  const lowerQuestion = question.toLowerCase();

  // Check if contains any keyword
  return keywords.some((keyword) => lowerQuestion.includes(keyword));
}
