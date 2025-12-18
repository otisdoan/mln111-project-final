/**
 * Chat Header Component
 */

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export function ChatHeader() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.icon}>🤖</ThemedText>
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>Trợ lý học tập MLN111</ThemedText>
        <ThemedText style={styles.subtitle}>
          Hỏi về giai cấp & đấu tranh
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  icon: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.accentSoft,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.accentSoft,
    opacity: 0.8,
    marginTop: 2,
  },
});
