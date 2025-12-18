/**
 * AI Chat Screen - Trợ lý học tập thông minh
 */

import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { QuickReplies } from "@/components/chat/QuickReplies";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useChat } from "@/contexts/ChatContext";
import { Stack } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { messages, loading, sendMessage, clearChat, quickReplies } = useChat();
  const flatListRef = useRef<FlatList>(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleClearChat = () => {
    Alert.alert(
      "Xóa lịch sử chat",
      "Bạn có chắc muốn xóa toàn bộ lịch sử chat?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: clearChat,
        },
      ]
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyIcon}>🤖</ThemedText>
      <ThemedText style={styles.emptyText}>
        Chào mừng đến với Trợ lý AI!
      </ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Hãy bắt đầu bằng một câu hỏi hoặc chọn gợi ý bên dưới
      </ThemedText>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Trợ lý AI",
          headerShown: false,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["top"]}
      >
        <ChatHeader />

        {/* Clear chat button */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearChat}
          >
            <ThemedText style={styles.clearButtonText}>🗑️ Xóa chat</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Messages list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={
            loading ? <TypingIndicator /> : <View style={{ height: 8 }} />
          }
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Quick replies */}
        {quickReplies.length > 0 && !loading && (
          <QuickReplies replies={quickReplies} onSelect={sendMessage} />
        )}

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={loading} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  actionBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearButtonText: {
    fontSize: 12,
    color: Colors.muted,
  },
  messagesList: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },
});
