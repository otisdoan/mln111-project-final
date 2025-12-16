import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import mindmapData from "@/data/mindmap.json";
import { Link, Stack } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MindmapScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Sơ đồ tư duy",
          headerLargeTitle: true,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            <ThemedText type="title" style={styles.title}>
              Sơ đồ tư duy
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Sơ đồ tổng quan về Giai cấp và Đấu tranh giai cấp
            </ThemedText>

            {/* Root Node */}
            <View style={styles.rootNode}>
              <ThemedText type="defaultSemiBold" style={styles.rootNodeText}>
                🎯 Giai cấp & Đấu tranh giai cấp
              </ThemedText>
            </View>

            {/* Topic Nodes */}
            <View style={styles.topicList}>
              {mindmapData.nodes
                .filter((node: any) => node.type === "topic")
                .map((node: any) => {
                  const tooltip = (mindmapData.tooltips as any)[node.id];
                  const link = (mindmapData.links as any)[node.id];

                  return (
                    <View key={node.id} style={styles.topicCard}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.topicTitle}
                      >
                        📌 {node.label}
                      </ThemedText>
                      {tooltip && (
                        <ThemedText style={styles.topicDescription}>
                          {tooltip}
                        </ThemedText>
                      )}
                      {link && (
                        <Link href={link} asChild>
                          <TouchableOpacity style={styles.linkButton}>
                            <ThemedText style={styles.linkButtonText}>
                              Xem bài học →
                            </ThemedText>
                          </TouchableOpacity>
                        </Link>
                      )}
                    </View>
                  );
                })}
            </View>

            {/* Connections Info */}
            <View style={styles.infoCard}>
              <ThemedText style={styles.infoText}>
                💡 Các chủ đề được sắp xếp theo logic từ cơ bản đến nâng cao.
                Bạn có thể nhấn vào từng card để xem chi tiết bài học.
              </ThemedText>
            </View>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
  },
  section: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 24,
  },
  rootNode: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: Colors.highlightBg,
    borderWidth: 3,
    borderColor: Colors.accentSoft,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  rootNodeText: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: "bold",
  },
  topicList: {
    gap: 16,
  },
  topicCard: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  topicTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: Colors.text,
  },
  topicDescription: {
    fontSize: 14,
    color: Colors.muted,
    lineHeight: 20,
    marginBottom: 12,
  },
  linkButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: "flex-start",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  linkButtonText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: "600",
  },
  infoCard: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.highlightBg,
    marginTop: 24,
    borderWidth: 1,
    borderColor: Colors.accentSoft,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
});
