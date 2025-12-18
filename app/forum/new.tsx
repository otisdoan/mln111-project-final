import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewForumPostScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Lý thuyết");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = ["Lý thuyết", "Thảo luận", "Ôn tập"];

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề câu hỏi");
      return;
    }
    if (!content.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung câu hỏi");
      return;
    }

    if (!user) {
      Alert.alert("Lỗi", "Bạn cần đăng nhập để đăng câu hỏi");
      router.push("/auth");
      return;
    }

    try {
      setSubmitting(true);

      // Parse tags
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Get user avatar from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      const avatarUrl = profile?.avatar_url || "👤";

      // Insert post
      const { error } = await supabase.from("forum_posts").insert({
        user_id: user.id,
        user_name:
          user.user_metadata?.display_name ||
          user.email?.split("@")[0] ||
          "Người dùng",
        user_avatar: avatarUrl,
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory,
        tags: tagArray,
        likes: 0,
      });

      if (error) throw error;

      Alert.alert("Thành công", "Câu hỏi của bạn đã được đăng!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("Error creating post:", error);
      Alert.alert("Lỗi", error.message || "Không thể đăng câu hỏi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Đặt câu hỏi mới",
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            {/* Header */}
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                ✍️ Đặt câu hỏi mới
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Chia sẻ câu hỏi của bạn với cộng đồng
              </ThemedText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Category Selection */}
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Danh mục</ThemedText>
                <View style={styles.categorySelector}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        selectedCategory === category &&
                          styles.categoryOptionActive,
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <ThemedText
                        style={[
                          styles.categoryOptionText,
                          selectedCategory === category &&
                            styles.categoryOptionTextActive,
                        ]}
                      >
                        {category}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Title Input */}
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Tiêu đề câu hỏi *</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="VD: Sự khác biệt giữa giai cấp và tầng lớp?"
                  placeholderTextColor={Colors.muted}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* Content Input */}
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>
                  Nội dung chi tiết *
                </ThemedText>
                <TextInput
                  style={styles.textArea}
                  placeholder="Mô tả chi tiết câu hỏi của bạn..."
                  placeholderTextColor={Colors.muted}
                  multiline
                  numberOfLines={8}
                  value={content}
                  onChangeText={setContent}
                  textAlignVertical="top"
                />
              </View>

              {/* Tags Input */}
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>
                  Từ khóa (phân cách bằng dấu phẩy)
                </ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="VD: giai-cấp, lý-thuyết, cơ-bản"
                  placeholderTextColor={Colors.muted}
                  value={tags}
                  onChangeText={setTags}
                />
              </View>

              {/* Guidelines */}
              <View style={styles.guidelines}>
                <ThemedText style={styles.guidelinesTitle}>
                  📝 Hướng dẫn đặt câu hỏi:
                </ThemedText>
                <ThemedText style={styles.guidelineItem}>
                  • Tiêu đề ngắn gọn, súc tích
                </ThemedText>
                <ThemedText style={styles.guidelineItem}>
                  • Mô tả rõ ràng vấn đề bạn đang gặp phải
                </ThemedText>
                <ThemedText style={styles.guidelineItem}>
                  • Sử dụng từ khóa phù hợp để dễ tìm kiếm
                </ThemedText>
                <ThemedText style={styles.guidelineItem}>
                  • Tôn trọng và lịch sự với mọi người
                </ThemedText>
              </View>

              {/* Submit Buttons */}
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    submitting && styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color={Colors.accentSoft} />
                  ) : (
                    <ThemedText style={styles.submitButtonText}>
                      Đăng câu hỏi
                    </ThemedText>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => router.back()}
                  disabled={submitting}
                >
                  <ThemedText style={styles.cancelButtonText}>Hủy</ThemedText>
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
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
  },
  form: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  categorySelector: {
    flexDirection: "row",
    gap: 8,
  },
  categoryOption: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  categoryOptionActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  categoryOptionTextActive: {
    color: Colors.accentSoft,
    fontWeight: "600",
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    minHeight: 160,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guidelines: {
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  guidelinesTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  guidelineItem: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: Colors.accentSoft,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
