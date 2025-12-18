import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import lessons from "@/data/lessons.json";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const roadmap = [
  "Khái niệm Giai cấp",
  "Nguồn gốc giai cấp",
  "Đấu tranh giai cấp",
  "Đấu tranh vô sản & thời kỳ quá độ",
];

const bannerImages = [
  require("@/assets/images/banner1.jpg"),
  require("@/assets/images/banner2.jpg"),
  require("@/assets/images/banner3.jpg"),
  require("@/assets/images/banner4.jpg"),
];

export default function HomeScreen() {
  const featuredLessons = lessons.slice(0, 4);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnims = useRef(
    bannerImages.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Set first image visible
    fadeAnims[0].setValue(1);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % bannerImages.length;

        // Fade out current
        Animated.timing(fadeAnims[prevIndex], {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }).start();

        // Fade in next
        Animated.timing(fadeAnims[nextIndex], {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start();

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <ScrollView style={styles.container}>
        {/* Hero Banner Carousel */}
        <View style={styles.heroBannerContainer}>
          <View style={styles.carouselContainer}>
            {bannerImages.map((image, index) => (
              <Animated.View
                key={index}
                style={[styles.carouselSlide, { opacity: fadeAnims[index] }]}
              >
                <ImageBackground
                  source={image}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              </Animated.View>
            ))}
          </View>
          <View style={styles.heroOverlay}>
            <ThemedView style={styles.heroInner}>
              <ThemedText type="title" style={styles.heroTitle}>
                GIAI CẤP VÀ ĐẤU TRANH GIAI CẤP
              </ThemedText>
              <ThemedText style={styles.heroSubtitle}>
                Giai cấp và đấu tranh giai cấp là quá trình xã hội bị phân hoá
                thành các nhóm có lợi ích đối lập, từ đó nảy sinh xung đột nhằm
                giành quyền lợi và ảnh hưởng trong xã hội.
              </ThemedText>
              <Link href="/lesson" asChild>
                <TouchableOpacity style={styles.heroButton}>
                  <ThemedText style={styles.heroButtonText}>
                    Bắt đầu học →
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            </ThemedView>
          </View>
        </View>

        {/* Lộ trình học tập */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Lộ trình học tập
              </ThemedText>
              <ThemedText style={styles.sectionSubtitle}>
                4 chặng chính giúp nắm chắc Giai cấp & Đấu tranh giai cấp.
              </ThemedText>
            </View>
          </View>

          <View style={styles.grid}>
            {featuredLessons.map((lesson, idx) => (
              <Link key={lesson.id} href={`/lesson/${lesson.slug}`} asChild>
                <TouchableOpacity style={styles.card}>
                  <View style={styles.pill}>
                    <ThemedText style={styles.pillText}>
                      Bước {idx + 1}
                    </ThemedText>
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                    {roadmap[idx] ?? lesson.title}
                  </ThemedText>
                  <ThemedText style={styles.muted}>
                    Trạng thái: {lesson.status}
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </ThemedView>

        {/* Sơ đồ & Test */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Sơ đồ & Hình dung nhanh
              </ThemedText>
              <ThemedText style={styles.sectionSubtitle}>
                Mindmap và quiz giúp ghi nhớ hệ thống.
              </ThemedText>
            </View>
          </View>

          <View style={styles.grid}>
            <Link href="/game" asChild>
              <TouchableOpacity style={[styles.card, styles.gameCard]}>
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                  🎮 Trận Chiến Tri Thức
                </ThemedText>
                <ThemedText style={styles.muted}>
                  Game quiz hấp dẫn - Học mà vui!
                </ThemedText>
                <View
                  style={[
                    styles.pill,
                    { marginTop: 12, backgroundColor: Colors.accent },
                  ]}
                >
                  <ThemedText
                    style={[styles.pillText, { color: Colors.accentSoft }]}
                  >
                    MỚI!
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </Link>

            <Link href="/mindmap" asChild>
              <TouchableOpacity style={styles.card}>
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                  Sơ đồ tư duy
                </ThemedText>
                <ThemedText style={styles.muted}>
                  Xem mindmap tương tác.
                </ThemedText>
                <View style={[styles.pill, { marginTop: 12 }]}>
                  <ThemedText style={styles.pillText}>Mindmap</ThemedText>
                </View>
              </TouchableOpacity>
            </Link>

            <Link href="/quiz" asChild>
              <TouchableOpacity style={styles.card}>
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                  Test nhanh
                </ThemedText>
                <ThemedText style={styles.muted}>
                  Làm mini quiz để kiểm tra mức nắm.
                </ThemedText>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: "50%" }]} />
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroBannerContainer: {
    minHeight: 400,
    position: "relative",
    overflow: "hidden",
  },
  carouselContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  carouselSlide: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  heroInner: {
    backgroundColor: "transparent",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
    color: Colors.heroText,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    padding: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 24,
    color: Colors.heroSubtext,
  },
  heroButton: {
    backgroundColor: Colors.heroButton,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 6,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroButtonText: {
    color: Colors.heroText,
    fontSize: 16,
    fontWeight: "700",
  },
  section: {
    padding: 20,
    backgroundColor: Colors.surfaceAlt,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: Colors.muted,
  },
  grid: {
    gap: 20,
  },
  card: {
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
  gameCard: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
    borderWidth: 3,
    shadowColor: Colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 8,
  },
  gameIcon: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 12,
  },
  pill: {
    backgroundColor: Colors.badgeWarning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.badgeWarningText,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: Colors.text,
  },
  muted: {
    fontSize: 14,
    color: Colors.muted,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.accent,
  },
});
