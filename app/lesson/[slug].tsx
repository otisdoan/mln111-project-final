import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import lessons from "@/data/lessons.json";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper to get image source from lessons folder
const getImageSource = (imagePath: string) => {
  if (!imagePath) return null;

  // Remove leading slash
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;

  // Map of image paths to require statements
  const imageMap: Record<string, any> = {
    "hinh-minh-hoa-chu-dat-nong-dan-thoi-phong-kien.jpg": require("@/assets/images/lessons/hinh-minh-hoa-chu-dat-nong-dan-thoi-phong-kien.jpg"),
    "hinh-mo-ta-cau-truc-chu-quan-ly-cong-nhan.webp": require("@/assets/images/lessons/hinh-mo-ta-cau-truc-chu-quan-ly-cong-nhan.webp"),
    "gia-tri-thang-du.webp": require("@/assets/images/lessons/gia-tri-thang-du.webp"),
    "giai-cap-cong-nhan-dau-tranh.jpg": require("@/assets/images/lessons/giai-cap-cong-nhan-dau-tranh.jpg"),
    "cong-cu-da-cong-cu-kim-loai-nang-suat-tang-cua-du-xuat-hien.jpg": require("@/assets/images/lessons/cong-cu-da-cong-cu-kim-loai-nang-suat-tang-cua-du-xuat-hien.jpg"),
    "hinh-ruong-dat-tu-huu-thoi-phong-kien.jpg": require("@/assets/images/lessons/hinh-ruong-dat-tu-huu-thoi-phong-kien.jpg"),
    "no-le.jpg": require("@/assets/images/lessons/no-le.jpg"),
    "The-Storming-of-the-Bastille.webp": require("@/assets/images/lessons/The-Storming-of-the-Bastille.webp"),
    "2.jpg": require("@/assets/images/lessons/2.jpg"),
    "Gustave_Courbet_-_The_Stonebreakers_-_WGA05457.jpg": require("@/assets/images/lessons/Gustave_Courbet_-_The_Stonebreakers_-_WGA05457.jpg"),
    "quoc-hoi.jpg": require("@/assets/images/lessons/quoc-hoi.jpg"),
    "fake-new.jpg": require("@/assets/images/lessons/fake-new.jpg"),
    "chien-tranh-thong-tin.jpg": require("@/assets/images/lessons/chien-tranh-thong-tin.jpg"),
    "lao-dong.jpg": require("@/assets/images/lessons/lao-dong.jpg"),
    "hacker.webp": require("@/assets/images/lessons/hacker.webp"),
  };

  return imageMap[cleanPath] || null;
};

export default function LessonDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const lesson = lessons.find((l) => l.slug === slug);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Find current lesson index
  const currentIndex = lessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  if (!lesson) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Không tìm thấy bài học</ThemedText>
      </ThemedView>
    );
  }

  // Build text content from lesson sections
  const buildLessonText = () => {
    let text = `${lesson.title}. `;
    lesson.sections.forEach((section) => {
      if ("heading" in section && section.heading) {
        text += `${section.heading}. `;
      }
      if ("body" in section && section.body) {
        text += `${section.body}. `;
      }
      if ("bullets" in section && section.bullets) {
        section.bullets.forEach((bullet) => {
          text += `${bullet}. `;
        });
      }
    });
    return text;
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      // Stop speaking
      await Speech.stop();
      setIsSpeaking(false);
    } else {
      // Start speaking
      const text = buildLessonText();
      setIsSpeaking(true);
      Speech.speak(text, {
        language: "vi-VN",
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: lesson.title,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            <View style={styles.titleContainer}>
              <ThemedText type="title" style={styles.lessonTitle}>
                {lesson.title}
              </ThemedText>

              <TouchableOpacity
                style={[
                  styles.speakButton,
                  isSpeaking && styles.speakButtonActive,
                ]}
                onPress={handleSpeak}
              >
                <ThemedText style={styles.speakButtonText}>
                  {isSpeaking ? "⏸️ Dừng đọc" : "🔊 Đọc bài"}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {lesson.sections.map((section, index) => (
              <View
                key={index}
                style={[
                  styles.sectionCard,
                  "variant" in section &&
                    section.variant === "alert-red" &&
                    styles.alertCard,
                  "highlight" in section &&
                    section.highlight &&
                    styles.highlightCard,
                ]}
              >
                {"heading" in section && section.heading && (
                  <ThemedText type="subtitle" style={styles.sectionHeading}>
                    {section.heading}
                  </ThemedText>
                )}

                {"body" in section && section.body && (
                  <ThemedText style={styles.sectionBody}>
                    {section.body}
                  </ThemedText>
                )}

                {"bullets" in section && section.bullets && (
                  <View style={styles.bulletList}>
                    {section.bullets.map((bullet, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <ThemedText style={styles.bullet}>•</ThemedText>
                        <ThemedText style={styles.bulletText}>
                          {bullet}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                )}

                {"hasImage" in section &&
                  section.hasImage &&
                  "image" in section &&
                  section.image &&
                  (() => {
                    const imageSource = getImageSource(section.image);
                    return imageSource ? (
                      <View style={styles.imageContainer}>
                        <Image
                          source={imageSource}
                          style={styles.lessonImage}
                          resizeMode="cover"
                        />
                        <ThemedText style={styles.imageCaption}>
                          {"imageCaption" in section && section.imageCaption
                            ? section.imageCaption
                            : "H\u00ecnh minh h\u1ecda"}
                        </ThemedText>
                      </View>
                    ) : null;
                  })()}
              </View>
            ))}

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              {prevLesson && (
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton]}
                  onPress={() => router.push(`/lesson/${prevLesson.slug}`)}
                >
                  <ThemedText style={styles.navButtonText}>
                    ← Bài trước
                  </ThemedText>
                  <ThemedText style={styles.navLessonTitle} numberOfLines={1}>
                    {prevLesson.title}
                  </ThemedText>
                </TouchableOpacity>
              )}

              {nextLesson && (
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={() => router.push(`/lesson/${nextLesson.slug}`)}
                >
                  <ThemedText style={styles.navButtonText}>
                    Bài tiếp →
                  </ThemedText>
                  <ThemedText style={styles.navLessonTitle} numberOfLines={1}>
                    {nextLesson.title}
                  </ThemedText>
                </TouchableOpacity>
              )}
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
  titleContainer: {
    marginBottom: 24,
  },
  lessonTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.primary,
  },
  speakButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  speakButtonActive: {
    backgroundColor: Colors.accentSoft,
  },
  speakButtonText: {
    color: Colors.surface,
    fontSize: 15,
    fontWeight: "600",
  },
  sectionCard: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  highlightCard: {
    backgroundColor: Colors.highlightBg,
    borderLeftWidth: 6,
    borderLeftColor: Colors.accentSoft,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  alertCard: {
    backgroundColor: "#fff4f4",
    borderLeftWidth: 6,
    borderLeftColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: Colors.primary,
  },
  sectionBody: {
    fontSize: 16,
    lineHeight: 26,
    color: Colors.text,
  },
  bulletList: {
    marginTop: 8,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.accent,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  imageContainer: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lessonImage: {
    width: "100%",
    height: 400,
    backgroundColor: Colors.surfaceAlt,
  },
  imageCaption: {
    fontSize: 14,
    fontStyle: "italic",
    color: Colors.muted,
    padding: 12,
    textAlign: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  prevButton: {
    alignItems: "flex-start",
  },
  nextButton: {
    alignItems: "flex-end",
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.accent,
    marginBottom: 4,
  },
  navLessonTitle: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: "500",
  },
});
