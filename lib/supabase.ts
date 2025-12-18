/**
 * Supabase Client Configuration
 *
 * QUAN TRỌNG - ANON KEY vs SERVICE_ROLE KEY:
 * ==========================================
 *
 * 🔐 ANON KEY (Public Key):
 * - Dùng cho client-side (React Native, Web, Mobile)
 * - An toàn để public trong code
 * - Có quyền hạn chế, chỉ truy cập data được phép qua RLS
 * - Được validate bởi Row Level Security policies
 *
 * 🚨 SERVICE_ROLE KEY (Secret Key):
 * - TUYỆT ĐỐI KHÔNG dùng trong client
 * - Chỉ dùng trong server/backend
 * - Bypass tất cả RLS policies
 * - Nếu lộ = attacker có full access database
 *
 * JWT Token Flow:
 * ===============
 * 1. User login → Supabase trả về access_token (JWT)
 * 2. JWT chứa: user_id, role, email, exp (expiry)
 * 3. Mỗi request tự động gửi JWT trong header
 * 4. Server verify JWT và check RLS policies
 * 5. Token auto-refresh trước khi expire
 *
 * Session Lifecycle:
 * ==================
 * - Session lưu trong AsyncStorage (persistent)
 * - Auto-restore khi app restart
 * - Auto-refresh khi token gần hết hạn
 * - Logout = xóa session khỏi storage
 */

import { Database } from "@/types/database.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

// Lấy từ environment variables (được inject bởi Expo)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "❌ Missing Supabase credentials. Check .env file:\n" +
      "   EXPO_PUBLIC_SUPABASE_URL\n" +
      "   EXPO_PUBLIC_SUPABASE_KEY"
  );
}

/**
 * Supabase Client
 *
 * Config options:
 * - auth.storage: Dùng AsyncStorage để persist session
 * - auth.autoRefreshToken: Tự động refresh token trước khi expire
 * - auth.persistSession: Lưu session khi app đóng
 * - auth.detectSessionInUrl: false (không cần cho mobile)
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Chỉ cần cho web OAuth
  },
});

/**
 * Debug helper - Log auth events (chỉ dev)
 */
if (__DEV__) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("🔐 Auth Event:", event);
    console.log(
      "👤 Session:",
      session ? `User ${session.user.id}` : "No session"
    );
  });
}
