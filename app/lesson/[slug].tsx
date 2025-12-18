import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import lessons from "@/data/lessons.json";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, View } from "react-native";
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
    "H\u00ecnh minh h\u1ecda ch\u1ee7 \u0111\u1ea5t \u2013 n\u00f4ng d\u00e2n th\u1eddi phong ki\u1ebfn.jpg": require("@/assets/images/lessons/H\u00ecnh minh h\u1ecda ch\u1ee7 \u0111\u1ea5t \u2013 n\u00f4ng d\u00e2n th\u1eddi phong ki\u1ebfn.jpg"),
    "H\u00ecnh m\u00f4 t\u1ea3 c\u1ea5u tr\u00fac ch\u1ee7 \u2013 qu\u1ea3n l\u00fd \u2013 c\u00f4ng nh\u00e2n.webp": require("@/assets/images/lessons/H\u00ecnh m\u00f4 t\u1ea3 c\u1ea5u tr\u00fac ch\u1ee7 \u2013 qu\u1ea3n l\u00fd \u2013 c\u00f4ng nh\u00e2n.webp"),
    "gia-tri-thang-du.webp": require("@/assets/images/lessons/gia-tri-thang-du.webp"),
    "giai c\u1ea5p c\u00f4ng nh\u00e2n \u0111\u1ea5u tranh.jpg": require("@/assets/images/lessons/giai c\u1ea5p c\u00f4ng nh\u00e2n \u0111\u1ea5u tranh.jpg"),
    "C\u00f4ng c\u1ee5 \u0111\u00e1 \u2192 c\u00f4ng c\u1ee5 kim lo\u1ea1i \u2192 n\u0103ng su\u1ea5t t\u0103ng \u2192 c\u1ee7a d\u01b0 xu\u1ea5t hi\u1ec7n.jpg": require("@/assets/images/lessons/C\u00f4ng c\u1ee5 \u0111\u00e1 \u2192 c\u00f4ng c\u1ee5 kim lo\u1ea1i \u2192 n\u0103ng su\u1ea5t t\u0103ng \u2192 c\u1ee7a d\u01b0 xu\u1ea5t hi\u1ec7n.jpg"),
    "H\u00ecnh ru\u1ed9ng \u0111\u1ea5t t\u01b0 h\u1eefu th\u1eddi phong ki\u1ebfn.jpg": require("@/assets/images/lessons/H\u00ecnh ru\u1ed9ng \u0111\u1ea5t t\u01b0 h\u1eefu th\u1eddi phong ki\u1ebfn.jpg"),
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
  const lesson = lessons.find((l) => l.slug === slug);

  if (!lesson) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Không tìm thấy bài học</ThemedText>
      </ThemedView>
    );
  }

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
            <ThemedText type="title" style={styles.lessonTitle}>
              {lesson.title}
            </ThemedText>

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
                          resizeMode="contain"
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
  lessonTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: Colors.primary,
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
    height: 250,
    backgroundColor: Colors.surfaceAlt,
  },
  imageCaption: {
    fontSize: 14,
    fontStyle: "italic",
    color: Colors.muted,
    padding: 12,
    textAlign: "center",
  },
});
