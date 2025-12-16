import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Link, Stack } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SummaryScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Tổng kết",
          headerLargeTitle: true,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            <View style={styles.header}>
              <View>
                <ThemedText type="title" style={styles.title}>
                  Tổng kết
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  Tóm tắt 1 trang, sơ đồ tổng hợp, link luyện 20 câu sát đề.
                </ThemedText>
              </View>
              <Link href="/quiz" asChild>
                <TouchableOpacity style={styles.primaryButton}>
                  <ThemedText style={styles.primaryButtonText}>
                    Luyện 20 câu
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Tóm tắt nhanh
              </ThemedText>
              <ThemedText style={styles.summaryText}>
                Giai cấp: định nghĩa, đặc trưng, thực chất quan hệ bóc lột.
                Nguồn gốc từ phát triển lực lượng sản xuất và tư hữu. Đấu tranh
                giai cấp là tất yếu, động lực trực tiếp của lịch sử. Vô sản đấu
                tranh kinh tế, chính trị, tư tưởng; sau khi giành chính quyền
                phải bảo vệ, cải tạo, xây dựng xã hội mới. Việt Nam quá độ:
                CNH-HĐH, công bằng xã hội, chống diễn biến hòa bình, giữ định
                hướng XHCN.
              </ThemedText>
            </View>

            {/* Action Cards */}
            <View style={styles.grid}>
              <View style={styles.card}>
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                  Sơ đồ tổng hợp
                </ThemedText>
                <ThemedText style={styles.cardText}>
                  Xem sơ đồ tư duy đầy đủ tại trang Sơ đồ. Nhánh: Giai cấp →
                  Nguồn gốc → Kết cấu → Đấu tranh → Vai trò → Vô sản → Quá độ →
                  Việt Nam.
                </ThemedText>
                <Link href="/mindmap" asChild>
                  <TouchableOpacity style={styles.secondaryButton}>
                    <ThemedText style={styles.buttonText}>Xem sơ đồ</ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>

              <View style={styles.card}>
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                  Xuất PDF
                </ThemedText>
                <ThemedText style={styles.cardText}>
                  Tải PDF bài học (tính năng sẽ được bổ sung sau).
                </ThemedText>
                <TouchableOpacity
                  style={[styles.secondaryButton, styles.disabledButton]}
                  disabled
                >
                  <ThemedText style={[styles.buttonText, styles.disabledText]}>
                    Tải PDF (sắp có)
                  </ThemedText>
                </TouchableOpacity>
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
  header: {
    marginBottom: 24,
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
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  primaryButtonText: {
    color: Colors.accentSoft,
    fontSize: 14,
    fontWeight: "600",
  },
  summaryCard: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    backgroundColor: Colors.surface,
    marginBottom: 20,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: Colors.primary,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  grid: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    backgroundColor: Colors.surface,
    marginBottom: 12,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  cardText: {
    fontSize: 14,
    color: Colors.muted,
    lineHeight: 20,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.6,
  },
});
