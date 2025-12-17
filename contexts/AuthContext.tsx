/**
 * Auth Context - Quản lý Authentication State
 * 
 * Flow:
 * =====
 * 1. App start → AuthProvider mount
 * 2. Check session trong AsyncStorage
 * 3. Nếu có session → getUser() để verify
 * 4. Set user state
 * 5. Listen onAuthStateChange cho mọi thay đổi
 * 
 * Auth States:
 * ============
 * - loading: true → Đang check session
 * - user: null, loading: false → Chưa login
 * - user: {...}, loading: false → Đã login
 * 
 * Events:
 * =======
 * - SIGNED_IN: User vừa đăng nhập
 * - SIGNED_OUT: User vừa đăng xuất
 * - TOKEN_REFRESHED: Access token đã refresh
 * - USER_UPDATED: User info thay đổi
 */

import { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Hoàn thành WebBrowser session khi component unmount
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔄 AuthProvider: Initializing...');

        // 1. Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('📦 Initial session check:', session ? `User ${session.user.email}` : 'No session');
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // 2. Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('🔐 Auth Event:', _event);
            console.log('👤 Session:', session ? `User ${session.user.email}` : 'No session');
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false); // Quan trọng: phải set loading = false
        });

        return () => subscription.unsubscribe();
    }, []);

    /**
     * Sign Up - Đăng ký tài khoản mới
     * 
     * Flow:
     * 1. Supabase tạo user trong auth.users
     * 2. TỰ ĐỘNG ĐĂNG NHẬP LUÔN - Không cần xác nhận email
     * 3. Trigger onAuthStateChange(SIGNED_IN)
     * 
     * Email Confirmation: ĐÃ TẮT
     * - Để tắt xác nhận email trên Supabase Dashboard:
     *   Dashboard → Authentication → Settings → Email Auth
     *   → Bỏ check "Enable email confirmations"
     */
    const signUp = async (email: string, password: string) => {
        try {
            // Validation
            if (!email.trim() || !password) {
                return { error: new Error('Email và password không được để trống') };
            }

            if (!email.includes('@')) {
                return { error: new Error('Email không hợp lệ') };
            }

            if (password.length < 6) {
                return { error: new Error('Password phải có ít nhất 6 ký tự') };
            }

            console.log('📝 Đang đăng ký tài khoản:', email);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // Tự động confirm email (không cần xác nhận qua email)
                    emailRedirectTo: undefined,
                    data: {
                        // Thêm metadata nếu cần
                        display_name: email.split('@')[0],
                    },
                },
            });

            if (error) throw error;

            console.log('✅ Đăng ký thành công:', data.user?.email);

            // Sau khi đăng ký thành công, user đã tự động đăng nhập
            // AuthContext sẽ tự động update state qua onAuthStateChange

            return { error: null };
        } catch (error: any) {
            console.error('❌ Sign up error:', error.message);

            // Map lỗi sang tiếng Việt
            let errorMessage = error.message;
            if (error.message.includes('User already registered')) {
                errorMessage = 'Email này đã được đăng ký. Vui lòng đăng nhập.';
            } else if (error.message.includes('Password should be')) {
                errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự';
            }

            return { error: new Error(errorMessage) };
        }
    };

    /**
     * Sign In - Đăng nhập
     * 
     * Flow:
     * 1. Supabase verify email + password
     * 2. Trả về access_token (JWT) + refresh_token
     * 3. Lưu vào AsyncStorage
     * 4. Set session state
     * 5. Trigger onAuthStateChange(SIGNED_IN)
     * 
     * JWT Structure:
     * {
     *   sub: "user-uuid",
     *   email: "user@example.com",
     *   role: "authenticated",
     *   aud: "authenticated",
     *   iat: 1234567890,
     *   exp: 1234571490 // 1 hour
     * }
     */
    const signIn = async (email: string, password: string) => {
        try {
            // Validation
            if (!email.trim() || !password) {
                return { error: new Error('Email và password không được để trống') };
            }

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            return { error: null };
        } catch (error: any) {
            console.error('❌ Sign in error:', error.message);

            // Map Supabase errors sang tiếng Việt
            let errorMessage = error.message;
            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'Email hoặc password không đúng';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'Vui lòng xác nhận email trước khi đăng nhập';
            }

            return { error: new Error(errorMessage) };
        }
    };

    /**
     * Sign In with Google OAuth
     * 
     * Flow:
     * 1. Mở browser để user đăng nhập Google
     * 2. User chấp nhận permissions
     * 3. Google redirect về app với auth code
     * 4. Parse access_token + refresh_token từ URL
     * 5. Set session cho Supabase client
     * 6. onAuthStateChange(SIGNED_IN) trigger
     * 
     * Setup Required:
     * - Supabase Dashboard → Authentication → Providers → Google
     * - Bật Google provider
     * - Nhập Client ID và Client Secret từ Google Cloud Console
     * - Config Redirect URLs: https://[PROJECT_REF].supabase.co/auth/v1/callback
     * - Google Cloud Console → Add redirect URI: https://[PROJECT_REF].supabase.co/auth/v1/callback
     */
    const signInWithGoogle = async () => {
        try {
            console.log('🔍 Starting Google OAuth flow...');

            // Sử dụng expo redirect URL pattern cho mobile
            // Supabase sẽ tự động redirect về exp://[localhost or IP]:[port]
            const redirectUrl = 'exp://127.0.0.1:8081'; // Default Expo Go URL

            console.log('🔗 Redirect URL:', redirectUrl);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    skipBrowserRedirect: false,
                },
            });

            if (error) {
                console.error('❌ Supabase OAuth error:', error);
                throw error;
            }

            if (!data?.url) {
                throw new Error('Không nhận được OAuth URL từ Supabase');
            }

            console.log('🌐 Opening OAuth URL:', data.url);

            // Mở browser với OAuth URL
            // WebBrowser sẽ tự động handle redirect về app
            const result = await WebBrowser.openAuthSessionAsync(
                data.url,
                redirectUrl
            );

            console.log('🔙 WebBrowser result:', result);

            if (result.type === 'success' && result.url) {
                console.log('✅ OAuth callback received:', result.url);

                // Parse tokens từ URL
                // URL có thể là: exp://...#access_token=...&refresh_token=...
                // hoặc: exp://...?access_token=...&refresh_token=...
                let params: URLSearchParams;

                if (result.url.includes('#')) {
                    // Hash fragment
                    const fragment = result.url.split('#')[1];
                    params = new URLSearchParams(fragment);
                } else if (result.url.includes('?')) {
                    // Query string
                    const query = result.url.split('?')[1];
                    params = new URLSearchParams(query);
                } else {
                    throw new Error('URL callback không có params');
                }

                const access_token = params.get('access_token');
                const refresh_token = params.get('refresh_token');

                console.log('🔑 Access token found:', access_token ? 'YES' : 'NO');
                console.log('🔑 Refresh token found:', refresh_token ? 'YES' : 'NO');

                if (access_token && refresh_token) {
                    console.log('🔄 Setting session...');

                    // Set session cho Supabase client
                    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                        access_token,
                        refresh_token,
                    });

                    if (sessionError) {
                        console.error('❌ Set session error:', sessionError);
                        throw sessionError;
                    }

                    console.log('✅ Session set successfully:', sessionData.session?.user?.email);

                    // Manual update state để đảm bảo không bị stuck
                    if (sessionData.session) {
                        console.log('🔄 Manually updating auth state...');
                        setSession(sessionData.session);
                        setUser(sessionData.session.user);
                        setLoading(false);
                    }

                    // onAuthStateChange cũng sẽ tự động trigger
                } else {
                    throw new Error('Không tìm thấy access_token hoặc refresh_token trong callback URL');
                }
            } else if (result.type === 'cancel') {
                throw new Error('Đăng nhập bị hủy');
            } else if (result.type === 'dismiss') {
                throw new Error('Đã đóng cửa sổ đăng nhập');
            } else {
                throw new Error(`OAuth flow không thành công: ${result.type}`);
            }

            return { error: null };
        } catch (error: any) {
            console.error('❌ Google sign in error:', error);

            // Map errors sang tiếng Việt
            let errorMessage = error.message;

            if (error.message?.includes('Provider not enabled')) {
                errorMessage = '❌ Google OAuth chưa được BẬT trên Supabase.\n\n' +
                    '📝 Cách sửa:\n' +
                    '1. Vào Supabase Dashboard\n' +
                    '2. Authentication → Providers\n' +
                    '3. Bật Google Provider\n' +
                    '4. Nhập Client ID và Client Secret từ Google Cloud Console\n' +
                    '5. Thêm Redirect URI: https://wwfaplkeqedqnhidxdxn.supabase.co/auth/v1/callback';
            } else if (error.message?.includes('redirect_uri')) {
                errorMessage = '❌ Redirect URI chưa được cấu hình đúng.\n\n' +
                    '📝 Kiểm tra:\n' +
                    '1. Google Cloud Console → APIs & Services → Credentials\n' +
                    '2. Chọn OAuth 2.0 Client ID\n' +
                    '3. Thêm: https://wwfaplkeqedqnhidxdxn.supabase.co/auth/v1/callback\n' +
                    '4. Save và thử lại';
            } else if (error.message?.includes('hủy') || error.message?.includes('cancel')) {
                errorMessage = 'Bạn đã hủy đăng nhập';
            } else if (error.message?.includes('đóng')) {
                errorMessage = 'Đã đóng cửa sổ đăng nhập';
            } else {
                errorMessage = `Lỗi đăng nhập Google: ${error.message}`;
            }

            return { error: new Error(errorMessage) };
        }
    };

    /**
     * Sign Out - Đăng xuất
     * 
     * Flow:
     * 1. Supabase invalidate access_token
     * 2. Xóa session khỏi AsyncStorage
     * 3. Clear user state
     * 4. Trigger onAuthStateChange(SIGNED_OUT)
     */
    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error: any) {
            console.error('❌ Sign out error:', error.message);
        }
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 * 
 * Usage:
 * ```tsx
 * const { user, signIn, signOut } = useAuth();
 * 
 * if (user) {
 *   console.log('Logged in as:', user.email);
 * }
 * ```
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth phải được dùng trong AuthProvider');
    }
    return context;
}
