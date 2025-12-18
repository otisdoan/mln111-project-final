-- ============================================================
-- FIX: "Email logins are disabled" Error
-- ============================================================

-- BƯỚC 1: BẬT EMAIL AUTHENTICATION
-- Vào Supabase Dashboard:
-- 1. Authentication → Providers → Email
-- 2. Toggle "Enable Email provider" = ON
-- 3. Save

-- BƯỚC 2: TẮT EMAIL CONFIRMATION (không cần xác nhận email)
-- Trong cùng trang Email provider:
-- 1. Tìm "Confirm email" 
-- 2. Toggle = OFF
-- 3. Save

-- BƯỚC 3 (TÙY CHỌN): Cấu hình thêm
-- Nếu muốn auto-confirm tất cả email:
-- Authentication → Settings → 
-- Scroll xuống "Security and Protection"
-- Set "Email OTP expiry" = 3600 (1 hour)

-- ============================================================
-- KẾT QUẢ SAU KHI CẤU HÌNH:
-- ============================================================
-- ✅ User đăng ký với email/password → Thành công ngay
-- ✅ Không cần click link xác nhận trong email
-- ✅ Login được ngay sau đăng ký
-- ✅ App hoạt động bình thường

-- ============================================================
-- QUAN TRỌNG: 
-- Phải bật Email provider trước, không thì sẽ lỗi:
-- "Email logins are disabled"
-- ============================================================
