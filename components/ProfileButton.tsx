/**
 * Profile Button - Hiển thị trên header
 * 
 * Features:
 * - Hiển thị avatar hoặc chữ cái đầu của email
 * - Nhấn vào → navigate đến profile screen
 * - Chỉ hiển thị khi user đã login
 */

import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function ProfileButton() {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) return null; // Không hiển thị nếu chưa login

    // Lấy chữ cái đầu từ email
    const initial = user.email?.charAt(0).toUpperCase() || '?';

    const handlePress = () => {
        router.push('/profile');
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initial}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: 16,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.accentSoft,
    },
    avatarText: {
        color: Colors.accentSoft,
        fontSize: 16,
        fontWeight: '600',
    },
});
