/**
 * Chat Context - State management for AI Chat
 */

import quickRepliesData from "@/data/quick-replies.json";
import { generateResponse, validateQuestion } from "@/lib/ai/gemini";
import { GREETING_MESSAGE } from "@/lib/ai/prompts";
import {
  buildContextString,
  getLessonMetadata,
  searchRelevantLessons,
} from "@/lib/ai/rag";
import { ChatContextType, Message, QuickReply } from "@/types/chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CHAT_HISTORY_KEY = "@mln111_chat_history";
const MAX_MESSAGES = 50; // Giới hạn số message lưu

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);

  const loadChatHistory = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } else {
        // First time - show greeting
        addGreetingMessage();
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      addGreetingMessage();
    }
  }, []);

  const saveChatHistory = useCallback(async () => {
    try {
      // Keep only last MAX_MESSAGES
      const toSave = messages.slice(-MAX_MESSAGES);
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  }, [messages]);

  // Load chat history from AsyncStorage
  useEffect(() => {
    loadChatHistory();
    loadQuickReplies();
  }, [loadChatHistory]);

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory();
    }
  }, [messages, saveChatHistory]);

  const loadQuickReplies = () => {
    // Load random 4 suggestions from each category
    const allSuggestions: QuickReply[] = [];
    let id = 0;

    for (const category of quickRepliesData.suggestions) {
      // Shuffle and take 2 from each category
      const shuffled = [...category.items].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 2);

      for (const text of selected) {
        allSuggestions.push({
          id: `qr-${id++}`,
          text,
          category: category.category as "concept" | "history" | "application",
        });
      }
    }

    setQuickReplies(allSuggestions.slice(0, 6)); // Max 6 suggestions
  };

  const addGreetingMessage = () => {
    const greetingMsg: Message = {
      id: "greeting-" + Date.now(),
      role: "assistant",
      content: GREETING_MESSAGE,
      timestamp: new Date(),
    };
    setMessages([greetingMsg]);
  };

  const sendMessage = async (content: string) => {
    // Validate
    const validation = validateQuestion(content);
    if (!validation.valid) {
      // Show error message from AI
      const errorMsg: Message = {
        id: "error-" + Date.now(),
        role: "assistant",
        content: `⚠️ ${validation.error}. Vui lòng thử lại.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    // Add user message
    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Start loading
    setLoading(true);

    try {
      // Search relevant lessons (RAG)
      const relevantLessons = searchRelevantLessons(content, 3);
      const context = buildContextString(relevantLessons);
      const lessonMetadata = getLessonMetadata(relevantLessons);

      // Generate AI response with lesson links
      const aiResponse = await generateResponse(
        context,
        content,
        lessonMetadata
      );

      // Add AI message
      const aiMsg: Message = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        lessonReferences: relevantLessons.map((l) => l.slug),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Refresh quick replies after each response
      loadQuickReplies();
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: "error-" + Date.now(),
        role: "assistant",
        content:
          "Xin lỗi, đã có lỗi xảy ra khi xử lý câu hỏi của bạn. Vui lòng thử lại. 🔄",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
      setMessages([]);
      addGreetingMessage();
      loadQuickReplies();
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const value: ChatContextType = {
    messages,
    loading,
    sendMessage,
    clearChat,
    quickReplies,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
