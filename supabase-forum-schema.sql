-- Create forum_posts table
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT DEFAULT '👤',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Lý thuyết', 'Thảo luận', 'Ôn tập')),
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_comments table
CREATE TABLE IF NOT EXISTS public.forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT DEFAULT '👤',
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_likes table (to track who liked what)
CREATE TABLE IF NOT EXISTS public.forum_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- Enable Row Level Security
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Policies for forum_posts
CREATE POLICY "Anyone can view posts" ON public.forum_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.forum_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own posts" ON public.forum_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.forum_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for forum_comments
CREATE POLICY "Anyone can view comments" ON public.forum_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.forum_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own comments" ON public.forum_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.forum_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for forum_likes
CREATE POLICY "Anyone can view likes" ON public.forum_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like" ON public.forum_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike" ON public.forum_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for comment_likes
CREATE POLICY "Anyone can view comment likes" ON public.comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like comments" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_forum_posts_created_at ON public.forum_posts(created_at DESC);
CREATE INDEX idx_forum_posts_category ON public.forum_posts(category);
CREATE INDEX idx_forum_comments_post_id ON public.forum_comments(post_id);
CREATE INDEX idx_forum_likes_post_id ON public.forum_likes(post_id);
CREATE INDEX idx_forum_likes_user_id ON public.forum_likes(user_id);

-- Insert sample data
INSERT INTO public.forum_posts (user_id, user_name, user_avatar, title, content, category, tags, likes, created_at) 
VALUES 
  (NULL, 'Nguyễn Văn A', '👨‍🎓', 
   'Sự khác biệt giữa giai cấp và tầng lớp xã hội?',
   'Mình đang học bài về giai cấp nhưng chưa hiểu rõ sự khác biệt giữa giai cấp và tầng lớp xã hội. Các bạn có thể giải thích giúp mình không?',
   'Lý thuyết',
   ARRAY['giai-cấp', 'lý-thuyết', 'cơ-bản'],
   12,
   NOW() - INTERVAL '8 hours'),
   
  (NULL, 'Phạm Thị D', '👩‍🏫',
   'Vai trò của giai cấp công nhân trong thời đại 4.0',
   'Với sự phát triển của công nghệ số và tự động hóa, vai trò của giai cấp công nhân truyền thống có thay đổi không? Mọi người nghĩ sao về vấn đề này?',
   'Thảo luận',
   ARRAY['công-nhân', 'công-nghệ-4.0', 'thảo-luận'],
   25,
   NOW() - INTERVAL '1 day'),
   
  (NULL, 'Đỗ Thị F', '👩‍💻',
   'Ôn thi: Câu hỏi về đấu tranh giai cấp ở Việt Nam',
   'Mọi người cho mình hỏi về đặc điểm đấu tranh giai cấp ở Việt Nam trong thời kỳ quá độ lên CNXH với. Có tài liệu nào hay không ạ?',
   'Ôn tập',
   ARRAY['việt-nam', 'ôn-tập', 'thi'],
   18,
   NOW() - INTERVAL '2 days'),
   
  (NULL, 'Ngô Văn I', '👨‍🏫',
   'Giải thích khái niệm giá trị thặng dư cho người mới học',
   'Mình mới bắt đầu học môn này, khái niệm giá trị thặng dư hơi khó hiểu. Có ai có cách giải thích đơn giản hơn không ạ?',
   'Lý thuyết',
   ARRAY['giá-trị-thặng-dư', 'cơ-bản', 'lý-thuyết'],
   30,
   NOW() - INTERVAL '3 days'),
   
  (NULL, 'Hồ Thị M', '👩‍🔬',
   'Liên hệ thực tế: Bóc lột lao động trong nền kinh tế gig',
   'Làm thế nào để nhận diện và phân tích hiện tượng bóc lột lao động trong các nền tảng công nghệ như Grab, Gojek, shipper...?',
   'Thảo luận',
   ARRAY['thực-tế', 'kinh-tế-gig', 'bóc-lột'],
   42,
   NOW() - INTERVAL '4 days');
