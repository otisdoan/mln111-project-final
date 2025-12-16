import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import profileData from "@/data/profile.json";
import { Stack, useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { user: profileUser, progress, achievements, recommendations } = profileData;

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/auth");
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Hồ sơ",
          headerLargeTitle: true,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            {/* User Info */}
            <View style={styles.userCard}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user ? user.email?.charAt(0).toUpperCase() : profileUser.name.charAt(0)}
                </ThemedText>
              </View>
              <ThemedText type="title" style={styles.userName}>
                {user ? user.email : profileUser.name}
              </ThemedText>
              {user && (
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <ThemedText style={styles.logoutButtonText}>
                    Đăng xuất
                  </ThemedText>
                </TouchableOpacity>
              )}
              {!user && (
                <TouchableOpacity
                  style={styles.loginPromptButton}
                  onPress={() => router.push("/auth")}
                >
                  <ThemedText style={styles.loginPromptText}>
                    Đăng nhập để lưu tiến độ
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>

            {/* Overall Progress */}
            <View style={styles.progressCard}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Tiến độ học tập
              </ThemedText>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.round(progress.overall * 100)}%` },
                  ]}
                />
              </View>
              <ThemedText style={styles.progressText}>
                {Math.round(progress.overall * 100)}% hoàn thành
              </ThemedText>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statValue}>
                    {progress.lessonsCompleted}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Bài học</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statValue}>
                    {progress.quizzesTaken}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Quiz</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statValue}>
                    {Math.round(progress.avgScore * 100)}%
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Điểm TB</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statValue}>
                    {progress.studyTimeMinutes}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Phút học</ThemedText>
                </View>
              </View>
            </View>

            {/* Achievements */}
            <View style={styles.achievementsCard}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Thành tựu
              </ThemedText>
              {achievements.map((achievement: any) => (
                <View key={achievement.id} style={styles.achievementItem}>
                  <ThemedText style={styles.achievementIcon}>🏆</ThemedText>
                  <View style={styles.achievementInfo}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.achievementTitle}
                    >
                      {achievement.title}
                    </ThemedText>
                    <ThemedText style={styles.achievementDescription}>
                      {achievement.description}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View style={styles.recommendationsCard}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Gợi ý cho bạn
              </ThemedText>
              {recommendations.map((rec: any, index: number) => (
                <View key={index} style={styles.recommendationItem}>
                  <ThemedText style={styles.recType}>
                    {rec.type === "lesson" && "📚"}
                    {rec.type === "quiz" && "✏️"}
                    {rec.type === "flashcard" && "🎴"}
                  </ThemedText>
                  <View style={styles.recInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.recTarget}>
                      {rec.target}
                    </ThemedText>
                    <ThemedText style={styles.recReason}>
                      {rec.reason}
                    </ThemedText>
                  </View>
                </View>
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
  },
  userCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    marginBottom: 20,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: Colors.surface,
    fontSize: 32,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 24,
    color: Colors.primary,
  },
  progressCard: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    marginBottom: 20,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
    color: Colors.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.accentSoft,
  },
  progressText: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.highlightBg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.accentSoft,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 4,
  },
  achievementsCard: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: Colors.highlightBg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.accentSoft,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.text,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.muted,
  },
  recommendationsCard: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recType: {
    fontSize: 24,
    marginRight: 12,
  },
  recInfo: {
    flex: 1,
  },
  recTarget: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.text,
  },
  recReason: {
    fontSize: 14,
    color: Colors.muted,
  },
  logoutButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#ff4444",
    borderRadius: 999,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  loginPromptButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: Colors.accent,
    borderRadius: 999,
  },
  loginPromptText: {
    color: Colors.accentSoft,
    fontSize: 14,
    fontWeight: "600",
  },
});
