/**
 * Auth Guard - Bảo vệ routes yêu cầu authentication
 * 
 * Component này wrap toàn bộ app và:
 * 1. Hiển thị loading khi đang check session
 * 2. Cho phép truy cập trang landing (index) và auth nếu chưa login
 * 3. Redirect về trang landing nếu chưa login và cố truy cập route protected
 * 4. Redirect về tabs nếu đã login và đang ở trang auth
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

        // Public pages that don't need authentication
        const publicPages = ['about', 'contact', 'lien-minh-giai-cap', 'modal'];
        const isPublicPage = publicPages.includes(segments[0] as string);

        console.log('🛡️ AuthGuard: inAuthGroup =', inAuthGroup, ', isPublicPage =', isPublicPage);

        if (!user && !inAuthGroup && !isPublicPage) {
            // User chưa login và cố truy cập route protected → redirect về landing (/)
            console.log('🛡️ AuthGuard: Not authenticated, redirecting to /');
            router.replace('/');
        } else if (user && inAuthGroup) {
            // User đã login nhưng đang ở trang auth → redirect về tabs
            console.log('🛡️ AuthGuard: User logged in at auth page, redirecting to /(tabs)');
            setTimeout(() => {
                router.replace('/(tabs)');
            }, 100);
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
