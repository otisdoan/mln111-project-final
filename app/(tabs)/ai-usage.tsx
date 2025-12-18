import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AIUsageScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "AI Usage",
          headerLargeTitle: true,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            <ThemedText type="title" style={styles.mainTitle}>
              Báo cáo sử dụng AI
            </ThemedText>
            <ThemedText style={styles.mainSubtitle}>
              Minh bạch, có trách nhiệm và liêm chính học thuật
            </ThemedText>

            {/* Cam kết */}
            <View style={styles.commitmentCard}>
              <ThemedText type="subtitle" style={styles.commitmentTitle}>
                📋 Cam kết
              </ThemedText>
              <ThemedText style={styles.commitmentText}>
                AI chỉ đóng vai trò hỗ trợ trong việc tạo sơ đồ, quiz, chatbot
                và video. Mọi nội dung lý thuyết đều được kiểm chứng với giáo
                trình Lý luận Chính trị và các văn bản chính thống của Đảng.
                Nhóm sinh viên chịu trách nhiệm hoàn toàn về nội dung cuối cùng.
              </ThemedText>
            </View>

            {/* 1. Minh bạch */}
            <View style={styles.card}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                1. Minh bạch sử dụng AI
              </ThemedText>

              {/* Công cụ 1: OpenRouter API */}
              <View style={styles.toolCard}>
                <View style={styles.toolHeader}>
                  <View style={styles.iconBadge}>
                    <ThemedText style={styles.iconText}>🤖</ThemedText>
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.toolTitle}>
                    OpenRouter API
                  </ThemedText>
                </View>
                <View style={styles.toolContent}>
                  <ThemedText style={styles.label}>Mục đích:</ThemedText>
                  <ThemedText style={styles.value}>
                    Chatbot AI thông minh trả lời câu hỏi về giai cấp và đấu
                    tranh giai cấp
                  </ThemedText>

                  <ThemedText style={styles.label}>Models sử dụng:</ThemedText>
                  <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                      <ThemedText style={styles.bullet}>•</ThemedText>
                      <ThemedText style={styles.bulletText}>
                        google/gemini-2.0-flash-exp:free (primary)
                      </ThemedText>
                    </View>
                    <View style={styles.bulletItem}>
                      <ThemedText style={styles.bullet}>•</ThemedText>
                      <ThemedText style={styles.bulletText}>
                        meta-llama/llama-3.2-3b-instruct:free (fallback 1)
                      </ThemedText>
                    </View>
                    <View style={styles.bulletItem}>
                      <ThemedText style={styles.bullet}>•</ThemedText>
                      <ThemedText style={styles.bulletText}>
                        mistralai/mistral-7b-instruct:free (fallback 2)
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={styles.label}>
                    Prompt chính đã dùng:
                  </ThemedText>
                  <View style={styles.codeBlock}>
                    <ThemedText style={styles.codeText}>
                      "Bạn là chuyên gia về Giai cấp và Đấu tranh giai cấp trong
                      Chủ nghĩa Mác - Lênin. Nhiệm vụ: Trả lời câu hỏi ngắn gọn,
                      dễ hiểu, có ví dụ thực tế Việt Nam. THÔNG MINH: Hiểu
                      context cuộc trò chuyện, nhớ câu hỏi trước. Nếu user trả
                      lời 'có', 'tôi muốn' → tiếp tục giải thích topic trước đó.
                      TỰ ĐỘNG: Sau mỗi câu trả lời, gợi ý bài học liên quan dưới
                      dạng markdown link."
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.label}>
                    Kết quả AI sinh ra:
                  </ThemedText>
                  <View style={styles.resultBox}>
                    <ThemedText style={styles.value}>
                      • Chatbot trả lời câu hỏi chính xác dựa trên giáo trình
                      {"\n"}• Tự động phân tích context, nhớ câu hỏi trước để
                      trả lời follow-up
                      {"\n"}• Gợi ý 7 bài học liên quan với markdown link có thể
                      click
                      {"\n"}• Fallback qua 3 models khi gặp lỗi quota/timeout
                      {"\n"}• Response time trung bình 2-3 giây
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.label}>
                    Phần nhóm chỉnh sửa/biên soạn:
                  </ThemedText>
                  <View style={styles.editBox}>
                    <ThemedText style={styles.value}>
                      • Viết toàn bộ system prompt từ đầu (250+ words)
                      {"\n"}• Tự code logic auto-append lesson links vào
                      response
                      {"\n"}• Thiết kế multi-model fallback (3 models) tránh
                      quota
                      {"\n"}• Tích hợp ChatContext với AsyncStorage persistence
                      {"\n"}• Tối ưu useCallback để tránh re-render không cần
                      thiết
                      {"\n"}• Debug và fix keyboard behavior
                      (KeyboardAvoidingView)
                    </ThemedText>
                  </View>
                </View>
              </View>

              {/* Công cụ 2: Markmap */}
              <View style={styles.toolCard}>
                <View style={styles.toolHeader}>
                  <View style={styles.iconBadge}>
                    <ThemedText style={styles.iconText}>🗺️</ThemedText>
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.toolTitle}>
                    Markmap (D3.js)
                  </ThemedText>
                </View>
                <View style={styles.toolContent}>
                  <ThemedText style={styles.label}>Mục đích:</ThemedText>
                  <ThemedText style={styles.value}>
                    Tạo sơ đồ tư duy tương tác cho 7 bài học
                  </ThemedText>

                  <ThemedText style={styles.label}>Kết quả:</ThemedText>
                  <ThemedText style={styles.value}>
                    Sơ đồ cây rẽ nhánh, zoom/pan được, click node để navigate
                  </ThemedText>

                  <ThemedText style={styles.label}>Phần chỉnh sửa:</ThemedText>
                  <ThemedText style={styles.value}>
                    Sinh viên tự thiết kế cấu trúc JSON (nodes, edges), tích hợp
                    WebView, xử lý navigation events
                  </ThemedText>
                </View>
              </View>

              {/* Công cụ 3: GitHub Copilot */}
              <View style={styles.toolCard}>
                <View style={styles.toolHeader}>
                  <View style={styles.iconBadge}>
                    <ThemedText style={styles.iconText}>💻</ThemedText>
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.toolTitle}>
                    GitHub Copilot & ChatGPT
                  </ThemedText>
                </View>
                <View style={styles.toolContent}>
                  <ThemedText style={styles.label}>Mục đích:</ThemedText>
                  <ThemedText style={styles.value}>
                    Hỗ trợ code React Native components, TypeScript types, UI
                    styling
                  </ThemedText>

                  <ThemedText style={styles.label}>Kết quả:</ThemedText>
                  <ThemedText style={styles.value}>
                    Quiz component, Flashcard animation, Video player, Floating
                    chat button
                  </ThemedText>

                  <ThemedText style={styles.label}>Phần chỉnh sửa:</ThemedText>
                  <ThemedText style={styles.value}>
                    Sinh viên tự design UI/UX, chọn màu theme (#c41e3a,
                    #d4af37), viết logic state management, tối ưu performance
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* 2. Có trách nhiệm */}
            <View style={styles.card}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                2. Có trách nhiệm
              </ThemedText>
              <ThemedText style={styles.description}>
                Mọi thông tin lý thuyết do AI sinh ra đều được kiểm chứng:
              </ThemedText>

              <View style={styles.sourceCard}>
                <ThemedText style={styles.sourceTitle}>
                  📚 Nguồn chính thống
                </ThemedText>
                <View style={styles.bulletList}>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Giáo trình Lý luận Chính trị (2024)
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Văn kiện Đại hội XIII của Đảng
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Nghị quyết 27-NQ/TW về cải cách tiền lương
                    </ThemedText>
                  </View>
                </View>
              </View>

              <View style={styles.processCard}>
                <ThemedText style={styles.processTitle}>
                  ✅ Quy trình kiểm chứng
                </ThemedText>
                <View style={styles.bulletList}>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.stepNumber}>1.</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      AI tạo nội dung sơ bộ (định nghĩa, ví dụ, quiz)
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.stepNumber}>2.</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Sinh viên đối chiếu với giáo trình LLCT
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.stepNumber}>3.</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Chỉnh sửa nội dung không chính xác hoặc lỗi thời
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.stepNumber}>4.</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Lưu vào lessons.json để chatbot tham khảo
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>

            {/* 3. Sáng tạo */}
            <View style={styles.card}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                3. Sáng tạo
              </ThemedText>
              <ThemedText style={styles.description}>
                AI chỉ hỗ trợ, sinh viên là người thiết kế và quyết định:
              </ThemedText>

              <View style={styles.creativeCard}>
                <ThemedText style={styles.creativeTitle}>
                  🎨 Phần sinh viên tự làm
                </ThemedText>
                <View style={styles.bulletList}>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Thiết kế UX/UI: màu sắc, layout, animation
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Cấu trúc 7 bài học theo giáo trình
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Viết system prompt cho chatbot
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Tạo quiz 30 câu, flashcard 25 thẻ
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Tích hợp Supabase auth, AsyncStorage
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Debug và tối ưu performance
                    </ThemedText>
                  </View>
                </View>
              </View>

              <View style={styles.creativeCard}>
                <ThemedText style={styles.creativeTitle}>
                  🤖 Phần AI hỗ trợ
                </ThemedText>
                <View style={styles.bulletList}>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Generate code boilerplate (components, types)
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Trả lời câu hỏi user trong chatbot
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Render sơ đồ tư duy (Markmap library)
                    </ThemedText>
                  </View>
                  <View style={styles.bulletItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.bulletText}>
                      Gợi ý cải thiện UX (keyboard handling, animations)
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>

            {/* 4. Liêm chính học thuật */}
            <View style={styles.card}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                4. Liêm chính học thuật
              </ThemedText>

              <View style={styles.integrityCard}>
                <View style={styles.integrityItem}>
                  <ThemedText style={styles.integrityIcon}>✍️</ThemedText>
                  <View style={styles.integrityContent}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.integrityTitle}
                    >
                      Cam kết bằng văn bản
                    </ThemedText>
                    <ThemedText style={styles.integrityText}>
                      Báo cáo này là cam kết chính thức không để AI làm thay
                      hoàn toàn. Có thể kiểm chứng qua Git history.
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.integrityItem}>
                  <ThemedText style={styles.integrityIcon}>🔍</ThemedText>
                  <View style={styles.integrityContent}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.integrityTitle}
                    >
                      Phân định rõ ràng
                    </ThemedText>
                    <ThemedText style={styles.integrityText}>
                      Mỗi công cụ AI đều ghi rõ "AI output" vs "Phần chỉnh sửa".
                      Code có comment phân biệt AI-generated và manual code.
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.integrityItem}>
                  <ThemedText style={styles.integrityIcon}>📖</ThemedText>
                  <View style={styles.integrityContent}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.integrityTitle}
                    >
                      Đối chiếu nguồn
                    </ThemedText>
                    <ThemedText style={styles.integrityText}>
                      File lessons.json chứa nội dung đã kiểm chứng với giáo
                      trình. AI chatbot chỉ trả lời dựa trên nguồn này.
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                📅 Cập nhật: Tháng 12/2024
              </ThemedText>
              <ThemedText style={styles.footerText}>
                👥 Nhóm: MLN111 - Giai cấp & Đấu tranh giai cấp
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
  section: {
    padding: 20,
    backgroundColor: "transparent",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  mainSubtitle: {
    fontSize: 15,
    color: Colors.muted,
    marginBottom: 24,
  },
  commitmentCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.highlightBg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
    marginBottom: 24,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  commitmentTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: Colors.primary,
  },
  commitmentText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
    fontStyle: "italic",
  },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 12,
    color: Colors.primary,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
    marginBottom: 16,
  },
  toolCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  toolHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.highlightBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  toolTitle: {
    fontSize: 16,
    color: Colors.text,
  },
  toolContent: {
    paddingLeft: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
  },
  codeText: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.muted,
    fontFamily: "monospace",
  },
  bulletList: {
    marginTop: 4,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    marginRight: 8,
    color: Colors.accent,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
    color: Colors.accent,
    minWidth: 20,
    marginTop: 2,
  },
  sourceCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.highlightBg,
    marginBottom: 12,
  },
  sourceTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  processCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.accentSoft,
  },
  processTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  creativeCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.highlightBg,
    marginBottom: 12,
  },
  creativeTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  integrityCard: {
    gap: 16,
  },
  integrityItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  integrityIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  integrityContent: {
    flex: 1,
  },
  integrityTitle: {
    fontSize: 15,
    marginBottom: 4,
    color: Colors.text,
  },
  integrityText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.muted,
  },
  resultBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.highlightBg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    marginTop: 4,
  },
  editBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentSoft,
    marginTop: 4,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: Colors.muted,
    marginBottom: 4,
  },
});
