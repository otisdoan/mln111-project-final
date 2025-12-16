import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import lessons from "@/data/lessons.json";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
                  section.image && (
                    <View style={styles.imageContainer}>
                      <ThemedText style={styles.imageCaption}>
                        📷{" "}
                        {"imageCaption" in section && section.imageCaption
                          ? section.imageCaption
                          : "Hình minh họa"}
                      </ThemedText>
                    </View>
                  )}
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
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 8,
  },
  imageCaption: {
    fontSize: 14,
    fontStyle: "italic",
    color: Colors.muted,
  },
});
