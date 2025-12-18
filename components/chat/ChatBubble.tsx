/**
 * Chat Message Bubble Component
 */

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { Message } from "@/types/chat";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  // Parse message content to extract lesson links
  const parseContent = (content: string) => {
    // Regex to match [text](lesson://slug)
    const linkRegex = /\[([^\]]+)\]\(lesson:\/\/([^\)]+)\)/g;
    const parts: { type: 'text' | 'link', content: string, slug?: string }[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      // Add text before link
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
      }
      // Add link
      parts.push({ type: 'link', content: match[1], slug: match[2] });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.substring(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: 'text' as const, content }];
  };

  const handleLessonPress = (slug: string) => {
    router.push(`/lesson/${slug}`);
  };

  const parts = parseContent(message.content);

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {parts.map((part, index) => {
            if (part.type === 'link' && part.slug) {
              return (
                <Text
                  key={index}
                  onPress={() => handleLessonPress(part.slug!)}
                  style={[
                    styles.link,
                    isUser ? styles.userLink : styles.assistantLink
                  ]}
                >
                  {part.content}
                </Text>
              );
            }
            return <Text key={index}>{part.content}</Text>;
          })}
        </Text>
        <ThemedText
          style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.assistantTimestamp,
          ]}
        >
          {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  assistantContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: Colors.accent, // Đỏ
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: Colors.surfaceAlt, // Cream
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.accentSoft, // Vàng border
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: Colors.accentSoft, // Vàng
  },
  assistantText: {
    color: Colors.text, // Đen
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  userLink: {
    color: Colors.accentSoft, // Vàng cho user bubble
  },
  assistantLink: {
    color: Colors.accent, // Đỏ cho assistant bubble
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: Colors.accentSoft,
    opacity: 0.7,
    textAlign: "right",
  },
  assistantTimestamp: {
    color: Colors.muted,
    textAlign: "left",
  },
});
