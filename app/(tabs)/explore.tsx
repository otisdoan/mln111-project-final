import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Href, Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const menuItems: {
  title: string;
  href: Href;
  icon: string;
  description: string;
}[] = [
  {
    title: "Bài học",
    href: "/lesson" as Href,
    icon: "📚",
    description: "Học lý thuyết giai cấp",
  },
  {
    title: "Diễn đàn",
    href: "/forum" as Href,
    icon: "💬",
    description: "Hỏi đáp cùng cộng đồng",
  },
  {
    title: "Trận Chiến Tri Thức",
    href: "/game" as Href,
    icon: "🎮",
    description: "Game quiz hấp dẫn - Học mà vui!",
  },
  {
    title: "Video",
    href: "/video" as Href,
    icon: "🎥",
    description: "Xem video bài giảng",
  },
  {
    title: "Flashcard",
    href: "/flashcard" as Href,
    icon: "🎴",
    description: "Ôn nhanh với flashcard",
  },
  {
    title: "Quiz",
    href: "/quiz" as Href,
    icon: "✏️",
    description: "Làm bài kiểm tra",
  },
  {
    title: "Sơ đồ tư duy",
    href: "/mindmap" as Href,
    icon: "🗺️",
    description: "Xem mindmap tổng quan",
  },
  {
    title: "Tổng kết",
    href: "/summary" as Href,
    icon: "📝",
    description: "Tóm tắt kiến thức",
  },
  {
    title: "Hồ sơ",
    href: "/profile" as Href,
    icon: "👤",
    description: "Xem tiến độ học tập",
  },
  {
    title: "Giới thiệu",
    href: "/about" as Href,
    icon: "ℹ️",
    description: "Về ứng dụng",
  },
  {
    title: "Liên hệ",
    href: "/contact" as Href,
    icon: "📧",
    description: "Góp ý và hỗ trợ",
  },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
      edges={["top"]}
    >
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.section}>
          <ThemedText type="title" style={styles.title}>
            Khám phá
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Chọn chức năng để bắt đầu học tập
          </ThemedText>

          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <Link key={item.title} href={item.href} asChild>
                <TouchableOpacity style={styles.menuCard}>
                  <View style={styles.iconContainer}>
                    <ThemedText style={styles.menuIcon}>{item.icon}</ThemedText>
                  </View>
                  <View style={styles.textContainer}>
                    <ThemedText type="defaultSemiBold" style={styles.menuTitle}>
                      {item.title}
                    </ThemedText>
                    <ThemedText style={styles.menuDescription}>
                      {item.description}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
  },
  section: {
    padding: 16,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: -20,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
    marginBottom: 20,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  menuCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 130,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.highlightBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    marginBottom: 4,
    color: Colors.text,
    lineHeight: 20,
  },
  menuDescription: {
    fontSize: 12,
    color: Colors.muted,
    lineHeight: 16,
  },
});
