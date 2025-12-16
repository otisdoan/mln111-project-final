import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import lessons from "@/data/lessons.json";
import { Link, Stack } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LessonIndexScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Bài học",
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
                Bài học
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Chọn bài để bắt đầu hoặc tiếp tục lộ trình học.
              </ThemedText>
            </View>

            <View style={styles.lessonList}>
              {lessons.map((lesson) => (
                <Link key={lesson.id} href={`/lesson/${lesson.slug}`} asChild>
                  <TouchableOpacity style={styles.lessonCard}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.lessonTitle}
                    >
                      {lesson.title}
                    </ThemedText>
                    <ThemedText style={styles.lessonStatus}>
                      Trạng thái: {lesson.status}
                    </ThemedText>
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
  lessonList: {
    gap: 20,
  },
  lessonCard: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    marginBottom: 12,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  lessonTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: Colors.text,
  },
  lessonStatus: {
    fontSize: 14,
    color: Colors.muted,
  },
});
