import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import videos from "@/data/videos.json";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function VideoDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const video = videos.find((v) => v.slug === slug);

  if (!video) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Không tìm thấy video</ThemedText>
      </ThemedView>
    );
  }

  const youtubeEmbedUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&modestbranding=1&playsinline=1&rel=0`;

  const youtubeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; }
          body { background: #000; }
          .video-container { position: relative; width: 100%; height: 100vh; }
          iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <div class="video-container">
          <iframe 
            src="${youtubeEmbedUrl}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      </body>
    </html>
  `;

  return (
    <>
      <Stack.Screen
        options={{
          title: video.title,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            {/* YouTube Video Player */}
            <View style={styles.videoContainer}>
              <WebView
                style={styles.videoPlayer}
                source={{ html: youtubeHtml }}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scrollEnabled={false}
                bounces={false}
              />
            </View>

            {/* Video Info */}
            <ThemedText type="title" style={styles.videoTitle}>
              {video.title}
            </ThemedText>

            <View style={styles.videoStats}>
              <ThemedText style={styles.statText}>
                👁 {video.views.toLocaleString()} lượt xem
              </ThemedText>
              <ThemedText style={styles.statText}>
                ⏱ {video.duration}
              </ThemedText>
              <ThemedText style={styles.statText}>
                📅 {video.uploadDate}
              </ThemedText>
            </View>

            {/* Description */}
            <View style={styles.descriptionCard}>
              <ThemedText type="subtitle" style={styles.sectionHeading}>
                Mô tả
              </ThemedText>
              <ThemedText style={styles.description}>
                {video.description}
              </ThemedText>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {video.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <ThemedText style={styles.tagText}>{tag}</ThemedText>
                </View>
              ))}
            </View>

            {/* Related Lessons */}
            {video.relatedLessons && video.relatedLessons.length > 0 && (
              <View style={styles.relatedSection}>
                <ThemedText type="subtitle" style={styles.sectionHeading}>
                  Bài học liên quan
                </ThemedText>
                {video.relatedLessons.map((lessonSlug, index) => (
                  <View key={index} style={styles.relatedItem}>
                    <ThemedText style={styles.relatedText}>
                      📚 {lessonSlug}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}
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
  videoContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#000000",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.primary,
  },
  videoStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 20,
  },
  statText: {
    fontSize: 14,
    color: Colors.muted,
  },
  descriptionCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    backgroundColor: Colors.surface,
    marginBottom: 16,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: Colors.primary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  relatedSection: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    backgroundColor: Colors.surface,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  relatedItem: {
    paddingVertical: 8,
  },
  relatedText: {
    fontSize: 14,
    color: Colors.text,
  },
});
