# Kế hoạch Triển khai AI Chatbot - MLN111

## 📋 Tổng quan

Xây dựng chatbot AI hỗ trợ học tập về **Giai cấp và Đấu tranh giai cấp**, trả lời câu hỏi dựa trên dữ liệu bài học có sẵn.

---

## 🎯 Mục tiêu

### Chức năng chính:

- ✅ **Trả lời câu hỏi** liên quan đến nội dung bài học (lessons.json)
- ✅ **Gợi ý học tập** dựa trên context và tiến độ
- ✅ **Từ chối lịch sự** câu hỏi ngoài phạm vi
- ✅ **Hướng dẫn** người dùng đặt câu hỏi đúng cách

### Phạm vi kiến thức:

- ✅ Khái niệm giai cấp
- ✅ Nguồn gốc giai cấp
- ✅ Đấu tranh giai cấp
- ✅ Các học thuyết Marx-Lenin
- ✅ Lịch sử đấu tranh giai cấp
- ✅ Ứng dụng hiện đại

### Giới hạn:

- ❌ Không trả lời câu hỏi ngoài chủ đề
- ❌ Không thảo luận chính trị nhạy cảm
- ❌ Không cung cấp thông tin cá nhân/riêng tư

---

## 🎨 Thiết kế Giao diện

### Màu sắc (Theme):

```typescript
{
  primary: '#c41e3a',      // Đỏ chính (accent)
  secondary: '#d4af37',    // Vàng (primary gold)
  background: '#fff8f0',   // Cream (surfaceAlt)
  surface: '#ffffff',      // Trắng
  userBubble: '#c41e3a',   // Đỏ cho tin nhắn user
  aiBubble: '#fff8f0',     // Cream cho tin nhắn AI
  textUser: '#ffd700',     // Vàng cho text user
  textAI: '#1a1a1a',       // Đen cho text AI
  border: '#d4af37',       // Vàng border
  inputBg: '#ffffff',      // Trắng input
}
```

### Layout:

```
┌─────────────────────────────┐
│  🤖 Trợ lý học tập MLN111   │ ← Header (đỏ #c41e3a)
├─────────────────────────────┤
│                             │
│  ┌─────────────────┐       │
│  │ Tin nhắn AI     │       │ ← Bubble trái (cream)
│  │ (Cream bg)      │       │   Text đen
│  └─────────────────┘       │
│                             │
│        ┌─────────────────┐ │
│        │ Tin nhắn User   │ │ ← Bubble phải (đỏ)
│        │ (Red bg)        │ │   Text vàng
│        └─────────────────┘ │
│                             │
│  ┌─────────────────┐       │
│  │ Gợi ý:          │       │ ← Quick replies
│  │ 🔹 Giai cấp là gì?     │   (Vàng border)
│  │ 🔹 Nguồn gốc?   │       │
│  └─────────────────┘       │
│                             │
├─────────────────────────────┤
│ [💬 Nhập câu hỏi...]  [📤] │ ← Input (trắng bg, vàng border)
└─────────────────────────────┘
```

### Components:

1. **Header**:

   - Icon robot 🤖
   - Title "Trợ lý học tập MLN111"
   - Background màu đỏ (#c41e3a)
   - Text màu vàng (#ffd700)

2. **Message Bubble**:

   - User: Đỏ bg, vàng text, bên phải
   - AI: Cream bg, đen text, bên trái
   - Border radius: 18px
   - Shadow nhẹ

3. **Input Bar**:

   - Trắng bg
   - Border vàng (#d4af37)
   - Placeholder: "Hỏi về giai cấp, đấu tranh..."
   - Send button: Đỏ (#c41e3a)

4. **Quick Replies**:

   - Pills màu cream
   - Border vàng
   - Text đỏ
   - 3-4 gợi ý mỗi lần

5. **Typing Indicator**:
   - 3 dots nhấp nháy
   - Màu đỏ

---

## 🤖 Tích hợp AI

### Lựa chọn AI Provider:

#### Option 1: **OpenAI GPT-3.5/4** (Recommended)

- ✅ Chất lượng tốt nhất
- ✅ Hỗ trợ tiếng Việt tốt
- ✅ Function calling cho RAG
- ✅ Streaming response
- ❌ Chi phí: ~$0.002/1K tokens (GPT-3.5)

#### Option 2: **Google Gemini** (Free tier)

- ✅ Miễn phí 60 requests/phút
- ✅ Hỗ trợ tiếng Việt
- ✅ Context window lớn
- ⚠️ Chất lượng vừa phải

#### Option 3: **Claude (Anthropic)**

- ✅ Chất lượng cao
- ✅ Context window rất lớn (200K tokens)
- ❌ Chi phí cao hơn

### Kiến trúc RAG (Retrieval-Augmented Generation):

```
User Question
     ↓
  Search lessons.json (semantic search)
     ↓
  Get relevant lessons/sections (top 3-5)
     ↓
  Build prompt with context
     ↓
  Call AI API (GPT/Gemini)
     ↓
  Format response
     ↓
  Display to user
```

### System Prompt:

```
Bạn là trợ lý học tập thông minh của nền tảng MLN111, chuyên về
Giai cấp và Đấu tranh giai cấp.

NHIỆM VỤ:
- Trả lời câu hỏi dựa trên nội dung bài học được cung cấp
- Giải thích khái niệm một cách dễ hiểu
- Khuyến khích người dùng học sâu hơn
- Gợi ý bài học liên quan

NGUYÊN TẮC:
✅ Chỉ trả lời trong phạm vi: giai cấp, đấu tranh giai cấp,
   Marx-Lenin, lịch sử xã hội
✅ Sử dụng ngôn ngữ thân thiện, dễ hiểu
✅ Trích dẫn từ bài học khi có thể
✅ Gợi ý bài học để tìm hiểu thêm

❌ KHÔNG trả lời câu hỏi ngoài phạm vi
❌ KHÔNG thảo luận chính trị đương đại nhạy cảm
❌ KHÔNG cung cấp thông tin cá nhân

Nếu câu hỏi ngoài phạm vi, lịch sự từ chối và hướng dẫn
người dùng hỏi đúng chủ đề.

CONTEXT (từ lessons.json):
{retrieved_context}

USER QUESTION:
{user_question}
```

---

## 📦 Cấu trúc Code

### Files cần tạo:

```
app/
  chat.tsx                          # Main chat screen

components/
  chat/
    ChatBubble.tsx                  # Message bubble component
    ChatInput.tsx                   # Input + send button
    QuickReplies.tsx                # Suggestion chips
    TypingIndicator.tsx             # Loading animation
    ChatHeader.tsx                  # Header with AI name

contexts/
  ChatContext.tsx                   # State management cho chat

lib/
  ai/
    openai.ts                       # OpenAI client
    gemini.ts                       # Gemini client (alternative)
    rag.ts                          # RAG logic (search lessons)
    prompts.ts                      # System prompts

types/
  chat.ts                           # TypeScript interfaces

data/
  quick-replies.json                # Pre-defined suggestions
```

### TypeScript Interfaces:

```typescript
// types/chat.ts

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  lessonReferences?: string[]; // Slug của bài học liên quan
}

export interface QuickReply {
  id: string;
  text: string;
  category: "concept" | "history" | "application";
}

export interface ChatContextType {
  messages: Message[];
  loading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  quickReplies: QuickReply[];
}

export interface LessonContext {
  slug: string;
  title: string;
  relevantSections: string[];
  similarity: number;
}
```

---

## 🔧 Implementation Steps

### Phase 1: UI Components (1-2h)

1. ✅ Tạo `app/chat.tsx` với basic layout
2. ✅ Tạo `ChatBubble.tsx` với 2 variants (user/AI)
3. ✅ Tạo `ChatInput.tsx` với TextInput + Send button
4. ✅ Tạo `QuickReplies.tsx` với horizontal scroll
5. ✅ Tạo `TypingIndicator.tsx` với animation
6. ✅ Style theo theme đỏ-vàng

### Phase 2: State Management (30min)

1. ✅ Tạo `ChatContext.tsx`
2. ✅ Implement message state
3. ✅ Handle send/receive logic

### Phase 3: RAG Logic (1h)

1. ✅ Tạo `lib/ai/rag.ts`
2. ✅ Implement semantic search trong lessons.json
   - Simple keyword matching
   - TF-IDF scoring (optional)
3. ✅ Extract relevant sections (top 3-5)
4. ✅ Build context string

### Phase 4: AI Integration (1h)

**Option A: OpenAI**

```bash
npm install openai
```

**Option B: Google Gemini**

```bash
npm install @google/generative-ai
```

1. ✅ Setup API client
2. ✅ Implement prompt building
3. ✅ Handle streaming response
4. ✅ Error handling

### Phase 5: Quick Replies (30min)

1. ✅ Tạo `data/quick-replies.json`
2. ✅ Load và hiển thị suggestions
3. ✅ Handle tap → send message

### Phase 6: Polish (30min)

1. ✅ Add animations (fade in messages)
2. ✅ Auto-scroll to bottom
3. ✅ Loading states
4. ✅ Empty state
5. ✅ Error handling UI

---

## 📝 API Configuration

### Environment Variables:

Thêm vào `.env`:

```env
# OpenAI (nếu dùng)
EXPO_PUBLIC_OPENAI_API_KEY=sk-...

# Gemini (nếu dùng)
EXPO_PUBLIC_GEMINI_API_KEY=AIza...

# Model selection
EXPO_PUBLIC_AI_PROVIDER=openai  # or 'gemini'
EXPO_PUBLIC_AI_MODEL=gpt-3.5-turbo  # or 'gemini-pro'
```

### Package.json:

```json
{
  "dependencies": {
    "openai": "^4.20.0", // Nếu dùng OpenAI
    "@google/generative-ai": "^0.1.3" // Nếu dùng Gemini
  }
}
```

---

## 🎯 Quick Replies Examples

```json
{
  "suggestions": [
    {
      "category": "concept",
      "items": [
        "Giai cấp là gì?",
        "Phân biệt giai cấp và tầng lớp?",
        "Các giai cấp chính trong xã hội?",
        "Giai cấp công nhân là ai?"
      ]
    },
    {
      "category": "history",
      "items": [
        "Nguồn gốc giai cấp từ đâu?",
        "Lịch sử đấu tranh giai cấp?",
        "Cách mạng Pháp 1789?",
        "Cách mạng công nghiệp ảnh hưởng gì?"
      ]
    },
    {
      "category": "application",
      "items": [
        "Đấu tranh giai cấp hiện nay?",
        "Giai cấp trong thời đại số?",
        "Vai trò của công nghệ?",
        "Liên minh giai cấp là gì?"
      ]
    }
  ]
}
```

---

## 🔒 Security & Privacy

1. **API Key Protection**:

   - Không commit `.env` vào Git
   - Sử dụng environment variables
   - Rotate keys định kỳ

2. **User Data**:

   - Không lưu câu hỏi cá nhân
   - Chat history chỉ lưu local (AsyncStorage)
   - Clear history option

3. **Rate Limiting**:

   - Giới hạn 10 messages/phút
   - Debounce input (500ms)
   - Show loading state

4. **Content Filtering**:
   - Kiểm tra input độ dài (< 500 chars)
   - Filter từ ngữ không phù hợp
   - Validate trước khi gọi AI

---

## 📊 Success Metrics

- ✅ Response time < 3s
- ✅ Accuracy > 85% (câu trả lời đúng context)
- ✅ User satisfaction (like/dislike buttons)
- ✅ Conversation length > 3 messages
- ✅ Quick reply usage > 40%

---

## 💰 Cost Estimation

### OpenAI GPT-3.5 Turbo:

- Input: $0.0015 / 1K tokens
- Output: $0.002 / 1K tokens
- Average conversation: ~2000 tokens
- Cost per conversation: ~$0.004 (80 VND)
- 1000 conversations: ~$4 (100,000 VND)

### Google Gemini:

- Free tier: 60 requests/minute
- Unlimited cho học tập/nghiên cứu
- Cost: $0 (nếu trong free tier)

### Recommendation:

🎯 **Bắt đầu với Gemini (free)**, nâng cấp lên OpenAI khi cần chất lượng cao hơn.

---

## 🚀 Deployment Plan

### Testing:

1. Unit tests cho RAG logic
2. Integration tests cho AI API
3. UI tests cho chat components
4. Load testing (100 concurrent users)

### Rollout:

1. **Beta** (10 users): Thu thập feedback
2. **Pilot** (100 users): Monitor performance
3. **Full Launch**: Tất cả người dùng

### Monitoring:

- Log AI requests (response time, tokens)
- Track error rate
- Monitor costs
- User feedback (thumbs up/down)

---

## 📚 Documentation for Users

### Help Modal trong Chat:

```
🤖 Hướng dẫn sử dụng Trợ lý AI

✅ TÔI CÓ THỂ:
• Giải thích khái niệm giai cấp, đấu tranh giai cấp
• Trả lời câu hỏi về lịch sử xã hội
• Gợi ý bài học phù hợp với bạn
• Làm rõ các học thuyết Marx-Lenin

❌ TÔI KHÔNG THỂ:
• Trả lời câu hỏi ngoài phạm vi học tập
• Thảo luận chính trị đương đại
• Làm bài tập thay bạn

💡 GỢI Ý:
• Hỏi cụ thể: "Giai cấp công nhân là gì?"
• Yêu cầu giải thích: "Giải thích nguồn gốc giai cấp"
• Tìm liên hệ: "Đấu tranh giai cấp và công nghệ?"
```

---

## ⚡ Performance Optimization

1. **Caching**:

   - Cache AI responses (same question = same answer)
   - TTL: 24 hours
   - Max cache size: 50 entries

2. **Lazy Loading**:

   - Load messages on scroll
   - Virtualized list cho chat history dài

3. **Debouncing**:

   - Input debounce: 500ms
   - Prevent spam requests

4. **Offline Support**:
   - Show cached messages offline
   - Queue messages when offline
   - Sync khi online lại

---

## 🎨 Animation Details

```typescript
// Message fade in
Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start();

// Typing indicator
Animated.loop(
  Animated.sequence([
    Animated.timing(dot1, { toValue: 1, duration: 400 }),
    Animated.timing(dot2, { toValue: 1, duration: 400 }),
    Animated.timing(dot3, { toValue: 1, duration: 400 }),
  ])
).start();

// Send button scale
Animated.spring(scale, {
  toValue: 1.1,
  friction: 3,
  useNativeDriver: true,
}).start();
```

---

## 🔍 Future Enhancements (Phase 2)

1. **Voice Input**: Speech-to-text
2. **Multi-language**: English support
3. **Image Generation**: Minh họa khái niệm bằng AI
4. **Personalization**: Học từ lịch sử chat
5. **Quiz Generation**: Tạo quiz từ conversation
6. **Export Chat**: Save conversation as PDF
7. **Share**: Chia sẻ Q&A hay ho

---

## 📋 Checklist trước khi Deploy

- [ ] API keys được bảo mật
- [ ] Rate limiting implemented
- [ ] Error handling hoàn chỉnh
- [ ] Loading states cho mọi action
- [ ] Empty state design
- [ ] Help/tutorial cho user
- [ ] Analytics tracking
- [ ] Cost monitoring setup
- [ ] Backup/restore chat history
- [ ] Privacy policy updated
- [ ] User testing completed
- [ ] Performance benchmarks met

---

## 🎯 Recommendation

### Bắt đầu với:

1. ✅ **UI Components** (1-2h) - Dễ, quan trọng
2. ✅ **Basic RAG** (1h) - Simple keyword search
3. ✅ **Gemini Integration** (1h) - Free, đủ tốt
4. ✅ **Quick Replies** (30min) - Tăng UX

### Tổng thời gian: ~4-5 giờ

### Nâng cấp sau:

- Advanced RAG (semantic search)
- OpenAI GPT-4 (better quality)
- Voice input
- Analytics dashboard

---

## ❓ Questions to Consider

1. **Budget**: Có sẵn sàng trả cho OpenAI không? (~$5-10/month)
2. **Free tier**: Gemini free có đủ không? (60 req/min)
3. **Data**: Có muốn lưu chat history không?
4. **Privacy**: Có gửi data lên cloud không?
5. **Moderation**: Có cần filter nội dung nhạy cảm không?

---

## 📞 Next Steps

**SAU KHI DUYỆT TÀI LIỆU NÀY:**

👉 Cho tôi biết:

1. Chọn AI provider nào? (Gemini free / OpenAI paid)
2. Có muốn lưu chat history không?
3. Có API key sẵn chưa?
4. Có muốn bắt đầu với UI trước không?

Tôi sẽ bắt đầu implement theo đúng lựa chọn của bạn! 🚀
