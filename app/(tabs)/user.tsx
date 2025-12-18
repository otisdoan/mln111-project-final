/**
 * User Profile Tab - Tab người dùng
 *
 * Hiển thị 2 trạng thái:
 * 1. Chưa đăng nhập: Hiển thị button đăng ký, đăng nhập
 * 2. Đã đăng nhập: Hiển thị ảnh, thông tin, nút đăng xuất
 */

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserScreen() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await signOut();
          Alert.alert("Thành công", "Đã đăng xuất khỏi tài khoản");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["top"]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <ThemedText style={styles.loadingText}>Đang tải...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  // Chưa đăng nhập
  if (!user) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["top"]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.guestContainer}>
            <View style={styles.guestIconContainer}>
              <ThemedText style={styles.guestIcon}>👤</ThemedText>
            </View>

            <ThemedText type="title" style={styles.guestTitle}>
              Chào mừng bạn!
            </ThemedText>

            <ThemedText style={styles.guestSubtitle}>
              Đăng nhập để trải nghiệm đầy đủ tính năng của MLN111
            </ThemedText>

            <View style={styles.guestButtons}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/auth")}
              >
                <ThemedText style={styles.loginButtonText}>
                  Đăng nhập
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => router.push("/auth")}
              >
                <ThemedText style={styles.signupButtonText}>Đăng ký</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Features List */}
            <View style={styles.featuresList}>
              <FeatureItem
                icon="📚"
                title="Truy cập bài học"
                description="Học mọi lúc, mọi nơi"
              />
              <FeatureItem
                icon="✅"
                title="Làm quiz & test"
                description="Kiểm tra kiến thức"
              />
              <FeatureItem
                icon="📊"
                title="Theo dõi tiến độ"
                description="Xem lịch sử học tập"
              />
              <FeatureItem
                icon="🎯"
                title="Lưu tiến trình"
                description="Học tiếp từ nơi dừng lại"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Đã đăng nhập
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContainer}>
          {/* Avatar & Info */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user.user_metadata?.avatar_url ? (
                <Image
                  source={{ uri: user.user_metadata.avatar_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <ThemedText style={styles.avatarText}>
                    {user.email?.charAt(0).toUpperCase()}
                  </ThemedText>
                </View>
              )}
            </View>

            <ThemedText type="title" style={styles.profileName}>
              {user.user_metadata?.display_name || user.email?.split("@")[0]}
            </ThemedText>

            <ThemedText style={styles.profileEmail}>{user.email}</ThemedText>
          </View>

          {/* Profile Stats */}
          <View style={styles.statsContainer}>
            <StatCard icon="📚" label="Bài học" value="12" />
            <StatCard icon="✅" label="Quiz" value="8" />
            <StatCard icon="⭐" label="Điểm" value="450" />
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <MenuItem
              icon="📊"
              title="Tiến độ học tập"
              onPress={() => router.push("/summary")}
            />
            <MenuItem
              icon="👤"
              title="Thông tin cá nhân"
              onPress={() => router.push("/profile")}
            />
            <MenuItem
              icon="ℹ️"
              title="Về chúng tôi"
              onPress={() => router.push("/about")}
            />
            <MenuItem
              icon="📧"
              title="Liên hệ"
              onPress={() => router.push("/contact")}
            />
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <ThemedText style={styles.signOutButtonText}>Đăng xuất</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Feature Item Component (for guest view)
function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <ThemedText style={styles.featureIcon}>{icon}</ThemedText>
      <View style={styles.featureContent}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureDescription}>{description}</ThemedText>
      </View>
    </View>
  );
}

// Stat Card Component (for logged in view)
function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statCard}>
      <ThemedText style={styles.statIcon}>{icon}</ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

// Menu Item Component (for logged in view)
function MenuItem({
  icon,
  title,
  onPress,
}: {
  icon: string;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <ThemedText style={styles.menuIcon}>{icon}</ThemedText>
        <ThemedText style={styles.menuTitle}>{title}</ThemedText>
      </View>
      <ThemedText style={styles.menuArrow}>›</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.muted,
  },

  // Guest View Styles
  guestContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  guestIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  guestIcon: {
    fontSize: 48,
  },
  guestTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  guestSubtitle: {
    fontSize: 16,
    color: Colors.muted,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 300,
  },
  guestButtons: {
    width: "100%",
    maxWidth: 300,
    gap: 12,
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  loginButtonText: {
    color: Colors.accentSoft,
    fontSize: 16,
    fontWeight: "600",
  },
  signupButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.accentSoft,
  },
  signupButtonText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: "600",
  },
  featuresList: {
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.accentSoft,
    gap: 12,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.muted,
  },

  // Logged In View Styles
  profileContainer: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.accentSoft,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.accentSoft,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.accentSoft,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.muted,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    alignItems: "center",
    gap: 4,
  },
  statIcon: {
    fontSize: 28,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.muted,
  },
  menuContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    overflow: "hidden",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuTitle: {
    fontSize: 16,
    color: Colors.text,
  },
  menuArrow: {
    fontSize: 24,
    color: Colors.muted,
  },
  signOutButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  signOutButtonText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: "600",
  },
});
