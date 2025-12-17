/**
 * OAuth Callback Handler - Web Only
 * 
 * Khi Google redirect về sau khi đăng nhập thành công,
 * Supabase sẽ tự động parse tokens từ URL và set session.
 * Component này chỉ cần chờ và redirect về home.
 */

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function AuthCallbackScreen() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        console.log('🔄 Auth Callback: Checking session...');
        console.log('   User:', user?.email || 'null');
        console.log('   Loading:', loading);

        // Đợi Supabase auth state update
        if (!loading) {
            if (user) {
                console.log('✅ Auth Callback: User authenticated, redirecting to home');
                // Đăng nhập thành công → về home
                setTimeout(() => {
                    router.replace('/');
                }, 500);
            } else {
                console.log('❌ Auth Callback: No user found, redirecting to auth');
                // Không có user → về trang đăng nhập
                setTimeout(() => {
                    router.replace('/auth');
                }, 500);
            }
        }
    }, [user, loading]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <ThemedText style={styles.text}>
                {loading ? 'Đang xác thực...' : user ? 'Đăng nhập thành công!' : 'Xác thực thất bại'}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.surfaceAlt,
        padding: 24,
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
    },
});
