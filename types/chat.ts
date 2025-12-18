/**
 * TypeScript interfaces for AI Chat feature
 */

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  lessonReferences?: string[]; // Slug của bài học liên quan
}

export interface QuickReply {
  id: string;
  text: string;
  category: "concept" | "history" | "application";
}

export interface ChatContextType {
  messages: Message[];
  loading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  quickReplies: QuickReply[];
}

export interface LessonContext {
  slug: string;
  title: string;
  relevantSections: string[];
  similarity: number;
}
