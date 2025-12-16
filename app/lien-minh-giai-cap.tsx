import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const evidences = [
  {
    id: 1,
    title: "Phát triển công nghiệp",
    icon: "🏭",
    description: "VinFast, Viettel, Thaco, FPT...",
    details: [
      "Công nhân tay nghề cao",
      "Kỹ sư, nhà khoa học (trí thức)",
      "Nông dân chuyển đổi lao động",
    ],
    conclusion:
      "Minh chứng liên minh công – nông – trí trong sản xuất hiện đại",
  },
  {
    id: 2,
    title: "Xây dựng nông thôn mới",
    icon: "🌾",
    description: "Chương trình NTM toàn quốc",
    details: [
      "Nhà nước (đại diện giai cấp công nhân)",
      "Nông dân tham gia xây dựng",
      "Đội ngũ trí thức nông nghiệp",
    ],
    conclusion:
      "Hàng ngàn xã đạt chuẩn NTM → nâng cao đời sống, giảm nghèo bền vững",
  },
  {
    id: 3,
    title: "Ứng phó Covid-19",
    icon: "💉",
    description: "Chiến thắng đại dịch",
    details: [
      "Công nhân sản xuất hàng hóa thiết yếu",
      "Nông dân đảm bảo nguồn cung nông sản",
      "Trí thức nghiên cứu vaccine, điều trị",
    ],
    conclusion: "Sức mạnh tổng hợp của các giai tầng xã hội",
  },
  {
    id: 4,
    title: "Chuyển đổi số quốc gia",
    icon: "💻",
    description: "Nền kinh tế số Việt Nam",
    details: [
      "Công nhân vận hành hạ tầng số",
      "Trí thức công nghệ thiết kế nền tảng",
      "Nông dân tiếp cận thương mại điện tử",
    ],
    conclusion: "Ba lực lượng liên kết tạo nên nền kinh tế số",
  },
];

export default function LienMinhGiaiCapScreen() {
  const [activeEvidence, setActiveEvidence] = useState<number | null>(null);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Liên minh giai cấp",
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          {/* Hero Section */}
          <View style={styles.hero}>
            <ThemedView style={styles.heroOverlay}>
              <ThemedText type="title" style={styles.heroTitle}>
                Liên minh giai cấp trong thời bình{"\n"}
                <ThemedText style={styles.highlightText}>
                  còn ý nghĩa hay không?
                </ThemedText>
              </ThemedText>
              <ThemedText style={styles.heroSubtitle}>
                Khám phá vai trò then chốt của liên minh công – nông – trí thức
                trong xây dựng và bảo vệ Tổ quốc
              </ThemedText>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statIcon}>👷</ThemedText>
                  <ThemedText style={styles.statLabel}>Công nhân</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statIcon}>🌾</ThemedText>
                  <ThemedText style={styles.statLabel}>Nông dân</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statIcon}>📚</ThemedText>
                  <ThemedText style={styles.statLabel}>Trí thức</ThemedText>
                </View>
              </View>
            </ThemedView>
          </View>

          <ThemedView style={styles.section}>
            {/* Introduction */}
            <View style={styles.introCard}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Câu hỏi đặt ra
              </ThemedText>
              <ThemedText style={styles.introText}>
                Trong thời bình, không còn chiến tranh, liệu liên minh giai cấp
                (công nhân – nông dân – trí thức) có còn cần thiết không? Câu
                trả lời là: Hoàn toàn có!
              </ThemedText>
            </View>

            {/* Evidences */}
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Minh chứng thực tiễn
            </ThemedText>

            {evidences.map((evidence) => (
              <View key={evidence.id} style={styles.evidenceCard}>
                <TouchableOpacity
                  style={styles.evidenceHeader}
                  onPress={() =>
                    setActiveEvidence(
                      activeEvidence === evidence.id ? null : evidence.id
                    )
                  }
                >
                  <ThemedText style={styles.evidenceIcon}>
                    {evidence.icon}
                  </ThemedText>
                  <View style={styles.evidenceHeaderText}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.evidenceTitle}
                    >
                      {evidence.title}
                    </ThemedText>
                    <ThemedText style={styles.evidenceDescription}>
                      {evidence.description}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.expandIcon}>
                    {activeEvidence === evidence.id ? "▼" : "▶"}
                  </ThemedText>
                </TouchableOpacity>

                {activeEvidence === evidence.id && (
                  <View style={styles.evidenceDetails}>
                    <ThemedText style={styles.detailsLabel}>
                      Vai trò các bên:
                    </ThemedText>
                    {evidence.details.map((detail, index) => (
                      <View key={index} style={styles.detailItem}>
                        <ThemedText style={styles.bullet}>•</ThemedText>
                        <ThemedText style={styles.detailText}>
                          {detail}
                        </ThemedText>
                      </View>
                    ))}
                    <View style={styles.conclusionBox}>
                      <ThemedText style={styles.conclusionText}>
                        ✅ {evidence.conclusion}
                      </ThemedText>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* Conclusion */}
            <View style={styles.conclusionCard}>
              <ThemedText type="subtitle" style={styles.conclusionTitle}>
                Kết luận
              </ThemedText>
              <ThemedText style={styles.conclusionBody}>
                Liên minh giai cấp không chỉ là khẩu hiệu thời chiến, mà còn là
                động lực thiết thực trong xây dựng đất nước thời bình. Sự liên
                kết giữa công nhân, nông dân và trí thức tạo nên sức mạnh tổng
                hợp, giúp Việt Nam phát triển bền vững và ổn định.
              </ThemedText>
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
  hero: {
    height: 350,
    justifyContent: "center",
    backgroundColor: Colors.highlightBg,
  },
  heroOverlay: {
    padding: 24,
    backgroundColor: "transparent",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: Colors.primary,
  },
  highlightText: {
    color: Colors.accent,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: Colors.text,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  section: {
    padding: 20,
  },
  introCard: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    backgroundColor: Colors.surface,
    marginBottom: 24,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.primary,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  evidenceCard: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    backgroundColor: Colors.surface,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  evidenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  evidenceIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  evidenceHeaderText: {
    flex: 1,
  },
  evidenceTitle: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.primary,
  },
  evidenceDescription: {
    fontSize: 13,
    color: Colors.muted,
  },
  expandIcon: {
    fontSize: 16,
    color: Colors.muted,
  },
  evidenceDetails: {
    padding: 16,
    paddingTop: 0,
  },
  detailsLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.text,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bullet: {
    marginRight: 8,
    color: Colors.text,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  conclusionBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: Colors.highlightBg,
    borderWidth: 2,
    borderColor: Colors.highlightBorder,
  },
  conclusionText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  conclusionCard: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    backgroundColor: Colors.surface,
    marginTop: 12,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  conclusionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.primary,
  },
  conclusionBody: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
});
