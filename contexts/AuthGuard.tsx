/**
 * Auth Guard - Bảo vệ routes yêu cầu authentication
 * 
 * Component này wrap toàn bộ app và:
 * 1. Hiển thị loading khi đang check session
 * 2. Redirect đến /auth nếu chưa login
 * 3. Cho phép truy cập nếu đã login
 */

import { Colors } from '@/constants/theme';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from './AuthContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        console.log('🛡️ AuthGuard: loading =', loading, ', user =', user ? user.email : 'null', ', segments =', segments);

        if (loading) return; // Đợi check session xong

        const inAuthGroup = segments[0] === 'auth';

        console.log('🛡️ AuthGuard: inAuthGroup =', inAuthGroup);

        if (!user && !inAuthGroup) {
            // User chưa login và không ở trang auth → redirect
            console.log('🛡️ AuthGuard: Redirecting to /auth');
            router.replace('/auth');
        } else if (user && inAuthGroup) {
            // User đã login nhưng đang ở trang auth → redirect về home
            console.log('🛡️ AuthGuard: User logged in at auth screen, redirecting to /(tabs)');
            setTimeout(() => {
                router.replace('/(tabs)');
            }, 100); // Small delay để đảm bảo state đã update
        } else if (user && !inAuthGroup) {
            console.log('🛡️ AuthGuard: User logged in, staying at current screen');
        }
    }, [user, loading, segments]);

    // Hiển thị loading screen khi đang check session
    if (loading) {
        console.log('🛡️ AuthGuard: Showing loading screen');
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        );
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.surfaceAlt,
    },
});
