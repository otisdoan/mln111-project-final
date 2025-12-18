import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Comment = {
  id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
  likes: number;
  liked_by_user?: boolean;
};

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
};

export default function ForumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedByUser, setLikedByUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
      if (user) {
        checkIfLiked();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      Alert.alert("Lỗi", "Không thể tải bài viết");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Check like status for each comment
      if (user) {
        const commentsWithLikes = await Promise.all(
          (data || []).map(async (comment) => {
            const { data: likeData } = await supabase
              .from("comment_likes")
              .select("id")
              .eq("comment_id", comment.id)
              .eq("user_id", user.id)
              .single();

            return {
              ...comment,
              liked_by_user: !!likeData,
            };
          })
        );
        setComments(commentsWithLikes);
      } else {
        setComments(data || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const checkIfLiked = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("forum_likes")
        .select("id")
        .eq("post_id", id)
        .eq("user_id", user.id)
        .single();

      setLikedByUser(!!data);
    } catch (error) {
      // No like found
    }
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

  if (!post) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ThemedView style={styles.container}>
          <ThemedText>Không tìm thấy bài viết</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

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

  const handleLike = async () => {
    if (!user) {
      Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để thích bài viết");
      return;
    }

    try {
      if (likedByUser) {
        // Unlike
        await supabase
          .from("forum_likes")
          .delete()
          .eq("post_id", id)
          .eq("user_id", user.id);

        // Decrement likes count
        const { data: updatedPost } = await supabase
          .from("forum_posts")
          .update({ likes: post.likes - 1 })
          .eq("id", id)
          .select()
          .single();

        if (updatedPost) setPost(updatedPost);
        setLikedByUser(false);
      } else {
        // Like
        await supabase.from("forum_likes").insert({
          post_id: id,
          user_id: user.id,
        });

        // Increment likes count
        const { data: updatedPost } = await supabase
          .from("forum_posts")
          .update({ likes: post.likes + 1 })
          .eq("id", id)
          .select()
          .single();

        if (updatedPost) setPost(updatedPost);
        setLikedByUser(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Lỗi", "Không thể thực hiện thao tác");
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để bình luận");
      return;
    }

    if (!newComment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bình luận");
      return;
    }

    setSubmitting(true);
    try {
      // Get user avatar from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      const avatarUrl = profile?.avatar_url || "👤";

      const { data, error } = await supabase
        .from("forum_comments")
        .insert({
          post_id: id,
          user_id: user.id,
          user_name: user.email?.split("@")[0] || "User",
          user_avatar: avatarUrl,
          content: newComment.trim(),
          likes: 0,
        })
        .select()
        .single();

      if (error) throw error;

      setComments((prev) => [...prev, data]);
      setNewComment("");
      Alert.alert("Thành công", "Đã thêm bình luận");
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Lỗi", "Không thể thêm bình luận");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentLike = async (
    commentId: string,
    currentLikedStatus: boolean,
    currentLikes: number
  ) => {
    if (!user) {
      Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để thích bình luận");
      return;
    }

    try {
      if (currentLikedStatus) {
        // Unlike
        await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", user.id);

        await supabase
          .from("forum_comments")
          .update({ likes: currentLikes - 1 })
          .eq("id", commentId);

        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, likes: comment.likes - 1, liked_by_user: false }
              : comment
          )
        );
      } else {
        // Like
        await supabase.from("comment_likes").insert({
          comment_id: commentId,
          user_id: user.id,
        });

        await supabase
          .from("forum_comments")
          .update({ likes: currentLikes + 1 })
          .eq("id", commentId);

        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, likes: comment.likes + 1, liked_by_user: true }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error toggling comment like:", error);
      Alert.alert("Lỗi", "Không thể thực hiện thao tác");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Chi tiết câu hỏi",
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            {/* Post Card */}
            <View style={styles.postCard}>
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

              {/* Post Title */}
              <ThemedText style={styles.postTitle}>{post.title}</ThemedText>

              {/* Post Content */}
              <ThemedText style={styles.postContent}>{post.content}</ThemedText>

              {/* Post Tags */}
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                  </View>
                ))}
              </View>

              {/* Like Button */}
              <TouchableOpacity
                style={[
                  styles.likeButton,
                  likedByUser && styles.likeButtonActive,
                ]}
                onPress={handleLike}
              >
                <ThemedText style={styles.likeIcon}>
                  {likedByUser ? "❤️" : "🤍"}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.likeText,
                    likedByUser && styles.likeTextActive,
                  ]}
                >
                  {post.likes} lượt thích
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <View style={styles.commentsSectionHeader}>
                <ThemedText style={styles.commentsTitle}>
                  💬 Câu trả lời ({comments.length})
                </ThemedText>
              </View>

              {/* Comments List */}
              {comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    {comment.user_avatar.startsWith("http") ? (
                      <Image
                        source={{ uri: comment.user_avatar }}
                        style={styles.commentAvatarImage}
                      />
                    ) : (
                      <ThemedText style={styles.commentAvatar}>
                        {comment.user_avatar}
                      </ThemedText>
                    )}
                    <View style={styles.commentHeaderRight}>
                      <ThemedText style={styles.commentAuthor}>
                        {comment.user_name}
                      </ThemedText>
                      <ThemedText style={styles.commentTime}>
                        {formatTimeAgo(comment.created_at)}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.commentContent}>
                    {comment.content}
                  </ThemedText>
                  <View style={styles.commentFooter}>
                    <TouchableOpacity
                      style={[
                        styles.commentLikeButton,
                        comment.liked_by_user && styles.commentLikeButtonActive,
                      ]}
                      onPress={() =>
                        handleCommentLike(
                          comment.id,
                          comment.liked_by_user || false,
                          comment.likes
                        )
                      }
                    >
                      <ThemedText style={styles.commentLikeIcon}>
                        {comment.liked_by_user ? "❤️" : "🤍"}
                      </ThemedText>
                      <ThemedText style={styles.commentLikeText}>
                        {comment.likes}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Add Comment */}
            <View style={styles.addCommentSection}>
              <ThemedText style={styles.addCommentTitle}>
                ✍️ Viết câu trả lời
              </ThemedText>
              <TextInput
                style={styles.commentInput}
                placeholder="Nhập câu trả lời của bạn..."
                placeholderTextColor={Colors.muted}
                multiline
                numberOfLines={4}
                value={newComment}
                onChangeText={setNewComment}
                editable={!submitting}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  submitting && styles.submitButtonDisabled,
                ]}
                onPress={handleAddComment}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <ThemedText style={styles.submitButtonText}>
                    Gửi trả lời
                  </ThemedText>
                )}
              </TouchableOpacity>
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
  section: {
    padding: 20,
  },
  postCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  postAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  authorAvatar: {
    fontSize: 40,
  },
  authorAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  postTime: {
    fontSize: 13,
    color: Colors.muted,
  },
  categoryBadge: {
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.accent,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 12,
    lineHeight: 30,
  },
  postContent: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: "500",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  likeButtonActive: {
    backgroundColor: "#FFE5E5",
    borderColor: "#FF6B6B",
  },
  likeIcon: {
    fontSize: 20,
  },
  likeText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  likeTextActive: {
    color: "#FF6B6B",
  },
  commentsSection: {
    marginBottom: 20,
  },
  commentsSectionHeader: {
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  commentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  commentAvatar: {
    fontSize: 32,
  },
  commentAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  commentHeaderRight: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  commentTime: {
    fontSize: 12,
    color: Colors.muted,
  },
  commentContent: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  commentFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentLikeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentLikeButtonActive: {
    backgroundColor: "#FFE5E5",
    borderColor: "#FF6B6B",
  },
  commentLikeIcon: {
    fontSize: 14,
  },
  commentLikeText: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: "500",
  },
  addCommentSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addCommentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  submitButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.accentSoft,
    fontSize: 16,
    fontWeight: "600",
  },
});
