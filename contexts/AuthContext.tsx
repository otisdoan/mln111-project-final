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

        // 1. Check for OAuth callback tokens in URL (Web only)
        const isWeb = typeof window !== 'undefined' && window.document;
        if (isWeb && window.location.hash) {
            console.log('🔍 Checking URL hash for OAuth tokens...');
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const access_token = hashParams.get('access_token');
            const refresh_token = hashParams.get('refresh_token');

            if (access_token && refresh_token) {
                console.log('✅ Found OAuth tokens in URL hash');
                console.log('💾 Setting session from URL tokens...');

                supabase.auth.setSession({
                    access_token,
                    refresh_token,
                }).then(({ data, error }) => {
                    if (error) {
                        console.error('❌ Error setting session from URL:', error);
                    } else {
                        console.log('✅ Session set from URL tokens!');
                        console.log('👤 User:', data.session?.user?.email);
                        // Clean URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                });
            }
        }

        // 2. Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('📦 Initial session check:', session ? `User ${session.user.email}` : 'No session');
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // 3. Listen for auth changes
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
     * Đơn giản hóa flow:
     * 1. Detect platform (web/mobile)
     * 2. Call Supabase signInWithOAuth với queryParams chứa redirect URL
     * 3. Supabase tự động handle redirect với tokens trong URL hash
     */
    const signInWithGoogle = async () => {
        try {
            console.log('\n🚀 === GOOGLE OAUTH START ===');

            // Detect platform
            const isWeb = typeof window !== 'undefined' && window.document;
            console.log('🖥️  Platform:', isWeb ? 'Web' : 'Mobile');

            if (isWeb) {
                // WEB FLOW
                const currentUrl = window.location.origin + window.location.pathname;
                console.log('📍 Current URL:', currentUrl);

                // Gọi Supabase OAuth
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: currentUrl,
                        skipBrowserRedirect: false,
                        queryParams: {
                            access_type: 'offline',
                            prompt: 'consent',
                        },
                    },
                });

                if (error) {
                    console.error('❌ OAuth error:', error);
                    throw error;
                }

                if (data?.url) {
                    console.log('🌐 Redirecting to Google...');
                    // Redirect đến Google OAuth
                    window.location.href = data.url;
                }

                return { error: null };
            } else {
                // MOBILE FLOW
                const mobileRedirectUrl = 'mln111projectfinal://google-callback';
                console.log('📱 Mobile redirect:', mobileRedirectUrl);

                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: mobileRedirectUrl,
                        skipBrowserRedirect: false,
                    },
                });

                if (error) {
                    console.error('❌ OAuth error:', error);
                    throw error;
                }

                if (!data?.url) {
                    throw new Error('Không nhận được OAuth URL');
                }

                // Mở browser modal
                const result = await WebBrowser.openAuthSessionAsync(
                    data.url,
                    mobileRedirectUrl
                );

                if (result.type === 'success' && result.url) {
                    // Parse tokens từ URL
                    const url = result.url;
                    let access_token: string | null = null;
                    let refresh_token: string | null = null;

                    if (url.includes('#')) {
                        const fragment = url.split('#')[1];
                        const params = new URLSearchParams(fragment);
                        access_token = params.get('access_token');
                        refresh_token = params.get('refresh_token');
                    }

                    if (access_token && refresh_token) {
                        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                            access_token,
                            refresh_token,
                        });

                        if (sessionError) throw sessionError;

                        if (sessionData.session) {
                            setSession(sessionData.session);
                            setUser(sessionData.session.user);
                            setLoading(false);
                            return { error: null };
                        }
                    }
                }

                console.log('🔙 Browser closed, result type:', result.type);

                // 3. Handle mobile callback
                if (result.type === 'success' && result.url) {
                    console.log('✅ Got callback URL');
                    console.log('📋 Callback URL:', result.url);

                    // Parse tokens từ URL fragments (#access_token=...)
                    const url = result.url;
                    let access_token: string | null = null;
                    let refresh_token: string | null = null;

                    // Try hash fragment first (standard OAuth)
                    if (url.includes('#')) {
                        const fragment = url.split('#')[1];
                        const params = new URLSearchParams(fragment);
                        access_token = params.get('access_token');
                        refresh_token = params.get('refresh_token');
                        console.log('🔍 Parsed from hash fragment');
                    }
                    // Fallback to query string
                    else if (url.includes('?')) {
                        const query = url.split('?')[1].split('#')[0];
                        const params = new URLSearchParams(query);
                        access_token = params.get('access_token');
                        refresh_token = params.get('refresh_token');
                        console.log('🔍 Parsed from query string');
                    }

                    console.log('🔑 Access token:', access_token ? 'FOUND ✓' : 'NOT FOUND ✗');
                    console.log('🔑 Refresh token:', refresh_token ? 'FOUND ✓' : 'NOT FOUND ✗');

                    if (!access_token || !refresh_token) {
                        console.error('❌ Missing tokens in callback URL');
                        throw new Error('Không tìm thấy tokens trong callback URL');
                    }

                    // 4. Set session với tokens
                    console.log('💾 Setting session...');
                    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                        access_token,
                        refresh_token,
                    });

                    if (sessionError) {
                        console.error('❌ Set session error:', sessionError);
                        throw sessionError;
                    }

                    if (sessionData.session) {
                        console.log('✅ Session set successfully!');
                        console.log('👤 User:', sessionData.session.user.email);
                        setSession(sessionData.session);
                        setUser(sessionData.session.user);
                        setLoading(false);
                        return { error: null };
                    }

                    throw new Error('Không tìm thấy tokens trong callback URL');
                } else if (result.type === 'cancel') {
                    throw new Error('Bạn đã hủy đăng nhập');
                } else if (result.type === 'dismiss') {
                    throw new Error('Đã đóng cửa sổ đăng nhập');
                }

                throw new Error('OAuth flow thất bại');
            }
        } catch (error: any) {
            console.error('❌ Google OAuth Error:', error);

            let errorMessage = error.message;
            if (error.message?.includes('Provider not enabled')) {
                errorMessage = '❌ Google OAuth chưa được BẬT trên Supabase!\n\n' +
                    'Vào: https://supabase.com/dashboard\n' +
                    'Authentication → Providers → Google → Enable';
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
