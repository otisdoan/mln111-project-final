import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import videos from "@/data/videos.json";
import { Link, Stack } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VideoIndexScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Video",
          headerLargeTitle: true,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="title" style={styles.title}>
                Video bài giảng
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Xem video để hiểu sâu hơn về các khái niệm giai cấp.
              </ThemedText>
            </View>

            <View style={styles.videoList}>
              {videos.map((video) => (
                <Link key={video.id} href={`/video/${video.slug}`} asChild>
                  <TouchableOpacity style={styles.videoCard}>
                    <View style={styles.thumbnailPlaceholder}>
                      <ThemedText style={styles.durationBadge}>
                        {video.duration}
                      </ThemedText>
                    </View>
                    <View style={styles.videoInfo}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.videoTitle}
                      >
                        {video.title}
                      </ThemedText>
                      <ThemedText
                        style={styles.videoDescription}
                        numberOfLines={2}
                      >
                        {video.description}
                      </ThemedText>
                      <View style={styles.videoMeta}>
                        <ThemedText style={styles.metaText}>
                          👁 {video.views.toLocaleString()} lượt xem
                        </ThemedText>
                        <ThemedText style={styles.metaText}>
                          📅 {video.uploadDate}
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
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
    backgroundColor: "transparent",
  },
  sectionHeader: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
  },
  videoList: {
    gap: 20,
  },
  videoCard: {
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  thumbnailPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.border,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 12,
  },
  durationBadge: {
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: Colors.text,
  },
  videoDescription: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 12,
  },
  videoMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 12,
    color: Colors.muted,
  },
});
