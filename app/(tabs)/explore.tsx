import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Href, Link } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const menuItems: {
  title: string;
  href: Href;
  icon: string;
  description: string;
}[] = [
    {
      title: "🎮 Trận Chiến Tri Thức",
      href: "/game" as Href,
      icon: "",
      description: "Game quiz hấp dẫn - Học mà vui!",
    },
    {
      title: "Bài học",
      href: "/lesson" as Href,
      icon: "📚",
      description: "Học lý thuyết giai cấp",
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
      title: "Liên minh giai cấp",
      href: "/lien-minh-giai-cap" as Href,
      icon: "🤝",
      description: "Câu hỏi thực tiễn",
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
                  <ThemedText style={styles.menuIcon}>{item.icon}</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.menuTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.menuDescription}>
                    {item.description}
                  </ThemedText>
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
    padding: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 40,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
    marginBottom: 24,
  },
  menuGrid: {
    gap: 20,
  },
  menuCard: {
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
  menuIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 18,
    marginBottom: 6,
    color: Colors.text,
  },
  menuDescription: {
    fontSize: 14,
    color: Colors.muted,
  },
});
