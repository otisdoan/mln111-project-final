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
 * Generate AI response using Gemini
 */
export async function generateResponse(
  context: string,
  question: string,
  lessons?: { slug: string; title: string }[]
): Promise<string> {
  try {
    // Check if API key exists
    if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
      console.error("❌ Missing EXPO_PUBLIC_GEMINI_API_KEY");
      return "Xin lỗi, hệ thống AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.";
    }

    // Get the generative model
    // Using gemini-2.0-flash (better quota than 2.5-flash: 20 req/day)
    // Gemini 2.0 Flash has higher free tier limits
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build prompt with lesson metadata for link generation
    const prompt = buildPrompt(context, question, lessons);

    // Generate response
    console.log("🤖 Calling Gemini API...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini response received");
    return text;
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);

    // Handle specific errors
    if (error.message?.includes("API key")) {
      return "Xin lỗi, API key không hợp lệ. Vui lòng kiểm tra cấu hình.";
    }

    if (error.message?.includes("quota")) {
      return "Xin lỗi, đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau.";
    }

    if (error.message?.includes("network")) {
      return "Xin lỗi, không thể kết nối đến server AI. Vui lòng kiểm tra kết nối internet.";
    }

    return "Xin lỗi, đã có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại.";
  }
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

  if (trimmed.length < 3) {
    return { valid: false, error: "Câu hỏi quá ngắn (tối thiểu 3 ký tự)" };
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
