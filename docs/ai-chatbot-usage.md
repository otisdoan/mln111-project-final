# 🤖 Hướng dẫn Sử dụng AI Chatbot

## ✅ Đã hoàn thành

Chatbot AI đã được tích hợp hoàn chỉnh vào app MLN111!

### 📦 Files đã tạo:

#### UI Components:

- `components/chat/ChatBubble.tsx` - Bubble tin nhắn (đỏ cho user, cream cho AI)
- `components/chat/ChatInput.tsx` - Input + Send button
- `components/chat/QuickReplies.tsx` - Gợi ý câu hỏi
- `components/chat/TypingIndicator.tsx` - Animation AI đang trả lời
- `components/chat/ChatHeader.tsx` - Header với icon robot

#### AI Logic:

- `lib/ai/gemini.ts` - Google Gemini API client
- `lib/ai/rag.ts` - RAG logic (search trong lessons.json)
- `lib/ai/prompts.ts` - System prompts và templates

#### State Management:

- `contexts/ChatContext.tsx` - Chat state với AsyncStorage
- `types/chat.ts` - TypeScript interfaces

#### Data:

- `data/quick-replies.json` - 18 câu hỏi gợi ý (3 categories)

#### Main Screen:

- `app/chat.tsx` - Trang chat chính

---

## 🔑 Setup API Key

### Bước 1: Lấy Gemini API Key (MIỄN PHÍ)

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập bằng Google account
3. Click **"Create API Key"**
4. Copy API key (bắt đầu bằng `AIza...`)

### Bước 2: Tạo file .env

Tạo file `.env` trong root folder:

```bash
# Copy từ .env.example
cp .env.example .env
```

Hoặc tạo mới file `.env` với nội dung:

```env
EXPO_PUBLIC_GEMINI_API_KEY=AIza_your_actual_key_here
```

⚠️ **QUAN TRỌNG**: Thay `AIza_your_actual_key_here` bằng API key thật!

### Bước 3: Restart Metro

```bash
# Stop server (Ctrl+C)
# Start lại
npm start
```

---

## 🎯 Cách sử dụng

### 1. Vào trang Chat

Từ home screen → tap vào **"Trợ lý AI thông minh"** (card màu đỏ với icon 🤖)

### 2. Đặt câu hỏi

**Ví dụ câu hỏi trong phạm vi:**

- "Giai cấp là gì?"
- "Giải thích nguồn gốc giai cấp"
- "Đấu tranh giai cấp trong thời đại số?"
- "So sánh giai cấp công nhân và tư sản"
- "Vai trò của công nghệ trong đấu tranh giai cấp"

**Câu hỏi ngoài phạm vi sẽ bị từ chối:**

- "Thời tiết hôm nay thế nào?"
- "Làm sao để học Python?"
- "Viết code cho tôi"

### 3. Quick Replies

Tap vào các gợi ý để hỏi nhanh:

- 💡 Concept: Khái niệm cơ bản
- 📚 History: Lịch sử, nguồn gốc
- ⚡ Application: Ứng dụng hiện đại

### 4. Xóa lịch sử

Tap **"🗑️ Xóa chat"** ở góc phải trên cùng.

---

## 🎨 Giao diện

### Màu sắc:

- **User bubble**: Đỏ (#c41e3a) với text vàng
- **AI bubble**: Cream (#fff8f0) với text đen, border vàng
- **Header**: Đỏ với text vàng
- **Input**: Trắng với border vàng
- **Quick replies**: Cream với border vàng

### Features:

- ✅ Auto-scroll khi có tin nhắn mới
- ✅ Typing indicator khi AI đang suy nghĩ
- ✅ Lưu lịch sử chat (max 50 messages)
- ✅ Giới hạn 500 ký tự/câu hỏi
- ✅ Validation input
- ✅ Error handling

---

## 🔍 Cách hoạt động (RAG)

### Flow:

```
User hỏi: "Giai cấp công nhân là gì?"
    ↓
1. Validate input (độ dài, format)
    ↓
2. Check scope (có từ khóa liên quan?)
    ↓
3. Search lessons.json (RAG)
   → Tìm 3 bài học liên quan nhất
   → Extract relevant sections
    ↓
4. Build prompt với context
    ↓
5. Call Gemini API
    ↓
6. Return AI response với references
```

### RAG (Retrieval-Augmented Generation):

- **Keyword search** trong titles và sections
- **Scoring** dựa trên:
  - Title match: +10 điểm
  - Keyword in title: +5 điểm
  - Section match: +8 điểm
  - Keyword in section: +2 điểm
- **Top 3** bài học được gửi cho AI
- **Context window**: ~2000 tokens

---

## 📊 Limits & Quotas

### Gemini Free Tier:

- ✅ **60 requests/minute** - Đủ cho 1 user
- ✅ **1,500 requests/day** - Đủ cho ~50 users
- ✅ **Unlimited** cho personal/educational use
- ⚠️ Nếu vượt quá → HTTP 429 error

### Rate Limiting trong code:

- Debounce: 500ms (planned)
- Max message length: 500 chars
- Max history: 50 messages

---

## 🐛 Troubleshooting

### "Xin lỗi, hệ thống AI chưa được cấu hình"

→ Thiếu `EXPO_PUBLIC_GEMINI_API_KEY` trong `.env`
→ Giải pháp: Thêm API key và restart Metro

### "API key không hợp lệ"

→ API key sai hoặc hết hạn
→ Giải pháp: Tạo API key mới tại https://makersuite.google.com/app/apikey

### "Đã vượt quá giới hạn"

→ Vượt 60 req/min hoặc 1500 req/day
→ Giải pháp: Chờ 1-2 phút rồi thử lại

### "Không thể kết nối đến server AI"

→ Không có internet hoặc Gemini API down
→ Giải pháp: Kiểm tra kết nối internet

### Typing indicator không dừng

→ API call bị stuck
→ Giải pháp: Refresh app

---

## 🚀 Testing

### Test cases:

1. **In-scope question:**

   - Input: "Giai cấp là gì?"
   - Expected: AI trả lời dựa trên lessons.json

2. **Out-of-scope question:**

   - Input: "Thời tiết hôm nay?"
   - Expected: Fallback response từ chối lịch sự

3. **Empty input:**

   - Input: "" (empty)
   - Expected: Error message

4. **Too short:**

   - Input: "Gi"
   - Expected: "Câu hỏi quá ngắn"

5. **Too long:**

   - Input: 501+ characters
   - Expected: "Câu hỏi quá dài"

6. **Quick reply:**

   - Tap: "Giai cấp là gì?"
   - Expected: Auto-send và nhận response

7. **Clear chat:**
   - Tap: "🗑️ Xóa chat"
   - Expected: Confirm dialog → Clear history

---

## 💰 Cost Analysis

### Current (Gemini Free):

- **Cost**: $0 / month
- **Limit**: 60 req/min, 1500 req/day
- **Suitable for**: 1-50 users/day

### If upgrade to OpenAI GPT-3.5:

- **Cost**: ~$0.004 / conversation
- **~$4 / 1000 conversations**
- **No rate limit** (depends on usage tier)

---

## 📝 Future Enhancements

### Phase 2 (nếu cần):

- [ ] Voice input (Speech-to-text)
- [ ] Streaming responses (show word-by-word)
- [ ] Better semantic search (embeddings)
- [ ] Multi-turn conversation context
- [ ] Export chat history to PDF
- [ ] Share Q&A
- [ ] Like/dislike feedback
- [ ] Analytics dashboard

---

## 📚 Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **Get API Key**: https://makersuite.google.com/app/apikey
- **RAG Tutorial**: https://ai.google.dev/docs/rag_guide
- **React Native AI**: https://github.com/dabit3/react-native-ai

---

## ✨ Features Summary

✅ **UI**: Đẹp, màu đỏ-vàng chủ đạo, thân thiện
✅ **AI**: Google Gemini Pro (free tier)
✅ **RAG**: Search trong lessons.json
✅ **Smart**: Từ chối câu hỏi ngoài phạm vi
✅ **Quick Replies**: 18 gợi ý câu hỏi
✅ **Persistent**: Lưu chat history với AsyncStorage
✅ **Error Handling**: Validation + friendly error messages
✅ **Animations**: Typing indicator, smooth scroll
✅ **TypeScript**: 100% type-safe

---

## 🎉 Hoàn thành!

Chat AI đã sẵn sàng sử dụng. Chỉ cần:

1. Add API key vào `.env`
2. Restart Metro
3. Tap vào "Trợ lý AI" trên home screen
4. Bắt đầu hỏi!

Enjoy! 🚀
