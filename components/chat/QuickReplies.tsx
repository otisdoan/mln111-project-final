/**
 * Quick Reply Suggestions Component
 */

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { QuickReply } from "@/types/chat";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (text: string) => void;
}

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  if (replies.length === 0) return null;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>💡 Gợi ý câu hỏi:</ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {replies.map((reply) => (
          <TouchableOpacity
            key={reply.id}
            style={styles.chip}
            onPress={() => onSelect(reply.text)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.chipText}>{reply.text}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.muted,
    marginBottom: 8,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.accentSoft,
  },
  chipText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "500",
  },
});
