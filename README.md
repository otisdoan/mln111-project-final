# Ứng dụng Giai cấp và Đấu tranh giai cấp

Ứng dụng học tập Triết học Mác – Lênin về chủ đề Giai cấp và Đấu tranh giai cấp, xây dựng bằng React Native và Expo.

## 🎯 Tính năng

### Học tập

- **Bài học**: 6 bài học chi tiết với nội dung được highlight và hình minh họa
- **Video**: 5 video bài giảng với link YouTube
- **Flashcard**: 25 thẻ ghi nhớ với hiệu ứng lật
- **Quiz**: 3 chế độ (Trắc nghiệm, Ghép cặp, Điền chỗ trống)

### Công cụ hỗ trợ

- **Sơ đồ tư duy**: Mindmap tổng quan về kiến thức
- **Tổng kết**: Tóm tắt nội dung và link quiz
- **Hồ sơ**: Theo dõi tiến độ học tập và thành tựu

### Nội dung bổ sung

- **Liên minh giai cấp**: Phân tích thực tiễn Việt Nam
- **Giới thiệu**: Mục tiêu và phương pháp học
- **Liên hệ**: Form góp ý

## 🚀 Cài đặt và chạy

### Yêu cầu

- Node.js 18+
- npm hoặc yarn
- Expo Go app (cho mobile) hoặc simulator

### Các bước

1. Cài đặt dependencies:

```bash
npm install
```

2. Khởi động ứng dụng:

```bash
npm start
```

3. Chọn platform:

- **iOS**: Nhấn `i` hoặc scan QR code bằng Camera app
- **Android**: Nhấn `a` hoặc scan QR code bằng Expo Go app
- **Web**: Nhấn `w`

## 📁 Cấu trúc dự án

```
app/
├── (tabs)/          # Tab navigation
│   ├── index.tsx    # Trang chủ
│   └── explore.tsx  # Menu khám phá
├── lesson/          # Bài học
│   ├── index.tsx    # Danh sách bài học
│   └── [slug].tsx   # Chi tiết bài học
├── video/           # Video
├── flashcard.tsx    # Flashcards
├── quiz.tsx         # Quiz
├── mindmap.tsx      # Sơ đồ tư duy
├── profile.tsx      # Hồ sơ
├── summary.tsx      # Tổng kết
├── about.tsx        # Giới thiệu
├── contact.tsx      # Liên hệ
└── lien-minh-giai-cap.tsx  # Liên minh giai cấp

data/                # Dữ liệu JSON
├── lessons.json     # 6 bài học
├── videos.json      # 5 video
├── flashcards.json  # 25 flashcards
├── quiz.json        # Câu hỏi quiz
├── mindmap.json     # Dữ liệu mindmap
└── profile.json     # Tiến độ học tập

components/          # UI components
assets/              # Hình ảnh và fonts
```

## 🎨 UI/UX

- **Thiết kế**: Card-based, clean và modern
- **Màu sắc**: #007AFF (primary), #F5F5F5 (background)
- **Typography**: Clear hierarchy với title, subtitle, body
- **Navigation**: Tab-based với stack navigation cho chi tiết

## 📊 Dữ liệu

Tất cả dữ liệu được lưu trong thư mục `data/` dưới dạng JSON:

- Bài học với sections, highlights, bullets, images
- Video với YouTube IDs và metadata
- Flashcards với câu hỏi/đáp án
- Quiz với nhiều định dạng câu hỏi
- Profile với tiến độ và achievements

## 🔧 Scripts

- `npm start`: Khởi động Expo dev server
- `npm run android`: Chạy trên Android
- `npm run ios`: Chạy trên iOS
- `npm run web`: Chạy trên web
- `npm run lint`: Kiểm tra code

## 📝 License

Educational project - MLN111 Course
