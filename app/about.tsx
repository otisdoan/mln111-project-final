import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Giới thiệu",
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
              Giới thiệu
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Mục tiêu ứng dụng, nguồn tài liệu và phương pháp học.
            </ThemedText>

            <View style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Mục tiêu
              </ThemedText>
              <ThemedText style={styles.cardText}>
                Xây dựng nền tảng học Triết học Mác – Lênin (Giai cấp & Đấu
                tranh giai cấp) hiện đại, dễ học, dễ nhớ, phù hợp cho cả mobile
                và desktop.
              </ThemedText>
            </View>

            <View style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Nguồn tài liệu
              </ThemedText>
              <ThemedText style={styles.cardText}>
                Dựa trên giáo trình Triết học Mác – Lênin, định nghĩa của
                V.I.Lênin, tổng hợp các nội dung: định nghĩa, đặc trưng, nguồn
                gốc, kết cấu, đấu tranh giai cấp, quá độ và bối cảnh Việt Nam.
              </ThemedText>
            </View>

            <View style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Phương pháp học
              </ThemedText>
              <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <ThemedText style={styles.bullet}>•</ThemedText>
                  <ThemedText style={styles.bulletText}>
                    Đọc bài → xem sơ đồ → làm quiz → ôn flashcard → tổng kết.
                  </ThemedText>
                </View>
                <View style={styles.bulletItem}>
                  <ThemedText style={styles.bullet}>•</ThemedText>
                  <ThemedText style={styles.bulletText}>
                    Highlight nội dung quan trọng, block nhớ nhanh, card đỏ nhấn
                    mạnh.
                  </ThemedText>
                </View>
                <View style={styles.bulletItem}>
                  <ThemedText style={styles.bullet}>•</ThemedText>
                  <ThemedText style={styles.bulletText}>
                    Gamification: quiz, match, fill blank, flashcard lật.
                  </ThemedText>
                </View>
              </View>
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
  card: {
    padding: 20,
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
  cardTitle: {
    fontSize: 20,
    marginBottom: 12,
    color: Colors.primary,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  bulletList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
    color: Colors.text,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
});
