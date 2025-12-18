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
import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadAvatar();
    }
  }, [user, loadAvatar]);

  const loadAvatar = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (data && (data as any).avatar_url) {
        setAvatarUrl((data as any).avatar_url);
      }
    } catch (error) {
      console.log("Error loading avatar:", error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Yêu cầu quyền", "Cần quyền truy cập thư viện ảnh");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh");
    }
  };

  const uploadAvatar = async (uri: string) => {
    if (!user) return;

    try {
      setUploading(true);

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      const fileExt = uri.split(".").pop() || "jpg";
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const contentType = `image/${fileExt}`;

      // Convert base64 to blob for upload
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update profile in database
      const { error: updateError } = await supabase.from("profiles").upsert({
        id: user.id,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      Alert.alert("Thành công", "Đã cập nhật ảnh đại diện");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Alert.alert("Lỗi", "Không thể tải ảnh lên");
    } finally {
      setUploading(false);
    }
  };

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
        <StatusBar style="dark" />
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
        <StatusBar style="dark" />
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
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContainer}>
          {/* Avatar & Info */}
          <View style={styles.profileHeader}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={pickImage}
              disabled={uploading}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <ThemedText style={styles.avatarText}>
                    {user.email?.charAt(0).toUpperCase()}
                  </ThemedText>
                </View>
              )}
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="small" color="#FFF" />
                </View>
              )}
              <View style={styles.editIconContainer}>
                <ThemedText style={styles.editIcon}>📷</ThemedText>
              </View>
            </TouchableOpacity>

            <ThemedText type="title" style={styles.profileName}>
              {user.user_metadata?.display_name || user.email?.split("@")[0]}
            </ThemedText>

            <ThemedText style={styles.profileEmail}>{user.email}</ThemedText>
          </View>

          {/* Profile Stats */}
          <View style={styles.statsContainer}>
            <StatCard icon="📚" label="Bài học" value="12" color="#4CAF50" />
            <StatCard icon="✅" label="Quiz" value="8" color="#2196F3" />
            <StatCard icon="⭐" label="Điểm" value="450" color="#FF9800" />
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <MenuItem
              icon="📊"
              title="Tiến độ học tập"
              subtitle="Xem thống kê chi tiết"
              iconBg="#E3F2FD"
              onPress={() => router.push("/summary")}
            />
            <MenuItem
              icon="👤"
              title="Thông tin cá nhân"
              subtitle="Cập nhật hồ sơ"
              iconBg="#FFF3E0"
              onPress={() => router.push("/profile")}
            />
            <MenuItem
              icon="ℹ️"
              title="Về chúng tôi"
              subtitle="Tìm hiểu thêm về MLN111"
              iconBg="#F3E5F5"
              onPress={() => router.push("/about")}
            />
            <MenuItem
              icon="📧"
              title="Liên hệ"
              subtitle="Gửi phản hồi & hỗ trợ"
              iconBg="#E8F5E9"
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
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View
        style={[styles.statIconContainer, { backgroundColor: color + "20" }]}
      >
        <ThemedText style={styles.statIcon}>{icon}</ThemedText>
      </View>
      <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

// Menu Item Component (for logged in view)
function MenuItem({
  icon,
  title,
  subtitle,
  iconBg,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  iconBg?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.menuIconContainer,
            iconBg && { backgroundColor: iconBg },
          ]}
        >
          <ThemedText style={styles.menuIcon}>{icon}</ThemedText>
        </View>
        <View style={styles.menuTextContainer}>
          <ThemedText style={styles.menuTitle}>{title}</ThemedText>
          {subtitle && (
            <ThemedText style={styles.menuSubtitle}>{subtitle}</ThemedText>
          )}
        </View>
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
    position: "relative",
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
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.surfaceAlt,
  },
  editIcon: {
    fontSize: 16,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
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
    gap: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: "500",
  },
  menuContainer: {
    gap: 12,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.accentSoft,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Colors.muted,
  },
  menuArrow: {
    fontSize: 24,
    color: Colors.muted,
    marginLeft: 8,
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
