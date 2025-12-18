import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ForumPost = {
  id: string;
  user_name: string;
  user_avatar: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  likes: number;
  tags: string[];
  comment_count?: number;
  liked_by_user?: boolean;
};

export default function ForumTabScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const categories = ["Tất cả", "Lý thuyết", "Thảo luận", "Ôn tập"];

  const handleSearch = () => {
    setSearchTerm(searchQuery);
  };

  const handleLike = async (
    postId: string,
    currentLikedStatus: boolean,
    currentLikes: number
  ) => {
    if (!user) {
      return;
    }

    try {
      if (currentLikedStatus) {
        // Unlike
        await supabase
          .from("forum_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        await supabase
          .from("forum_posts")
          .update({ likes: currentLikes - 1 })
          .eq("id", postId);

        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, likes: post.likes - 1, liked_by_user: false }
              : post
          )
        );
      } else {
        // Like
        await supabase.from("forum_likes").insert({
          post_id: postId,
          user_id: user.id,
        });

        await supabase
          .from("forum_posts")
          .update({ likes: currentLikes + 1 })
          .eq("id", postId);

        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, likes: post.likes + 1, liked_by_user: true }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Fetch posts when screen is focused (reload after posting)
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("forum_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch comment counts and like status for each post
      const postsWithCounts = await Promise.all(
        (data || []).map(async (post) => {
          const { count } = await supabase
            .from("forum_comments")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);

          let liked_by_user = false;
          if (user) {
            const { data: likeData } = await supabase
              .from("forum_likes")
              .select("id")
              .eq("post_id", post.id)
              .eq("user_id", user.id)
              .single();
            liked_by_user = !!likeData;
          }

          return {
            ...post,
            comment_count: count || 0,
            liked_by_user,
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now.getTime() - postTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} ngày trước`;
    if (diffHours > 0) return `${diffHours} giờ trước`;
    return "Vừa xong";
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <ThemedText style={styles.loadingText}>Đang tải...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <View style={styles.loginRequiredContainer}>
          <ThemedText style={styles.loginRequiredEmoji}>🔒</ThemedText>
          <ThemedText style={styles.loginRequiredTitle}>
            Yêu cầu đăng nhập
          </ThemedText>
          <ThemedText style={styles.loginRequiredText}>
            Bạn cần đăng nhập để sử dụng diễn đàn
          </ThemedText>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/auth")}
          >
            <ThemedText style={styles.loginButtonText}>
              Đăng nhập ngay
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
      edges={["bottom"]}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.accent]}
            tintColor={Colors.accent}
          />
        }
      >
        <ThemedView style={styles.section}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <ThemedText type="title" style={styles.title}>
                  💬 Diễn đàn
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  Đặt câu hỏi và thảo luận cùng cộng đồng
                </ThemedText>
              </View>
            </View>

            {/* New Post Button */}
            <TouchableOpacity
              style={styles.newPostButton}
              onPress={() => router.push("/forum/new")}
            >
              <ThemedText style={styles.newPostIcon}>✍️</ThemedText>
              <ThemedText style={styles.newPostText}>
                Đặt câu hỏi mới
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm câu hỏi..."
              placeholderTextColor={Colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <ThemedText style={styles.searchButtonText}>Tìm</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <ThemedText
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Posts List */}
          <View style={styles.postsContainer}>
            {filteredPosts.length === 0 ? (
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyEmoji}>🤔</ThemedText>
                <ThemedText style={styles.emptyText}>
                  Không tìm thấy câu hỏi nào
                </ThemedText>
              </View>
            ) : (
              filteredPosts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postCard}
                  onPress={() => router.push(`/forum/${post.id}`)}
                >
                  {/* Post Header */}
                  <View style={styles.postHeader}>
                    <View style={styles.postAuthor}>
                      {post.user_avatar.startsWith("http") ? (
                        <Image
                          source={{ uri: post.user_avatar }}
                          style={styles.authorAvatarImage}
                        />
                      ) : (
                        <ThemedText style={styles.authorAvatar}>
                          {post.user_avatar}
                        </ThemedText>
                      )}
                      <View>
                        <ThemedText style={styles.authorName}>
                          {post.user_name}
                        </ThemedText>
                        <ThemedText style={styles.postTime}>
                          {formatTimeAgo(post.created_at)}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.categoryBadge}>
                      <ThemedText style={styles.categoryBadgeText}>
                        {post.category}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Post Content */}
                  <ThemedText style={styles.postTitle}>{post.title}</ThemedText>
                  <ThemedText style={styles.postContent} numberOfLines={2}>
                    {post.content}
                  </ThemedText>

                  {/* Post Tags */}
                  <View style={styles.tagsContainer}>
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                      </View>
                    ))}
                  </View>

                  {/* Post Footer */}
                  <View style={styles.postFooter}>
                    <View style={styles.postStats}>
                      <TouchableOpacity
                        style={styles.statItem}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleLike(
                            post.id,
                            post.liked_by_user || false,
                            post.likes
                          );
                        }}
                      >
                        <ThemedText style={styles.statIcon}>
                          {post.liked_by_user ? "❤️" : "🤍"}
                        </ThemedText>
                        <ThemedText style={styles.statText}>
                          {post.likes}
                        </ThemedText>
                      </TouchableOpacity>
                      <View style={styles.statItem}>
                        <ThemedText style={styles.statIcon}>💬</ThemedText>
                        <ThemedText style={styles.statText}>
                          {post.comment_count || 0}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText style={styles.viewDetailsText}>
                      Xem chi tiết →
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))
            )}
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
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
  },
  newPostButton: {
    backgroundColor: Colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    gap: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  newPostIcon: {
    fontSize: 20,
  },
  newPostText: {
    color: Colors.accentSoft,
    fontSize: 16,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  searchButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  searchButtonText: {
    color: Colors.accentSoft,
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: Colors.accentSoft,
    fontWeight: "600",
  },
  postsContainer: {
    gap: 16,
  },
  postCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  authorAvatar: {
    fontSize: 32,
  },
  authorAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  postTime: {
    fontSize: 12,
    color: Colors.muted,
  },
  categoryBadge: {
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.accent,
  },
  postTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
    lineHeight: 24,
  },
  postContent: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: Colors.muted,
    fontWeight: "500",
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceAlt,
  },
  postStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    fontSize: 14,
    color: Colors.muted,
    fontWeight: "500",
  },
  viewDetailsText: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.muted,
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
  loginRequiredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loginRequiredEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  loginRequiredTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  loginRequiredText: {
    fontSize: 16,
    color: Colors.muted,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: Colors.accentSoft,
    fontSize: 16,
    fontWeight: "600",
  },
});
