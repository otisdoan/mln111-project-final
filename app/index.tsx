/**
 * Landing Page / Home - Trang đầu tiên khi mở app
 * 
 * Hiển thị khi user chưa đăng nhập
 * Giới thiệu app và nút CTA để đăng nhập/đăng ký
 */

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function LandingPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    // Nếu đã login → redirect về tabs
    useEffect(() => {
        if (!loading && user) {
            router.replace("/(tabs)");
        }
    }, [user, loading]);

    // Nếu đã login thì không hiển thị landing page
    if (user) {
        return null;
    }

    return (
        <SafeAreaView
            style={styles.container}
            edges={["top", "bottom"]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={styles.hero}>
                    <View style={styles.logoContainer}>
                        <ThemedText style={styles.logoText}>📚</ThemedText>
                    </View>

                    <ThemedText type="title" style={styles.title}>
                        Chào mừng đến MLN111
                    </ThemedText>

                    <ThemedText style={styles.subtitle}>
                        Nền tảng học tập thông minh với flashcard, quiz, mindmap và video bài giảng
                    </ThemedText>
                </View>

                {/* Features Section */}
                <View style={styles.features}>
                    <FeatureCard
                        icon="🎯"
                        title="Học theo module"
                        description="Nội dung được tổ chức thành các module logic, dễ theo dõi"
                    />
                    <FeatureCard
                        icon="🎴"
                        title="Flashcard"
                        description="Ghi nhớ kiến thức hiệu quả với flashcard tương tác"
                    />
                    <FeatureCard
                        icon="✅"
                        title="Quiz & Test"
                        description="Kiểm tra kiến thức với câu hỏi trắc nghiệm đa dạng"
                    />
                    <FeatureCard
                        icon="🧠"
                        title="Mindmap"
                        description="Trực quan hóa kiến thức với sơ đồ tư duy"
                    />
                    <FeatureCard
                        icon="🎥"
                        title="Video bài giảng"
                        description="Học qua video chất lượng cao, dễ hiểu"
                    />
                    <FeatureCard
                        icon="📊"
                        title="Theo dõi tiến độ"
                        description="Xem lịch sử học tập và tiến độ của bạn"
                    />
                </View>

                {/* CTA Buttons */}
                <View style={styles.ctaContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push("/auth")}
                        activeOpacity={0.8}
                    >
                        <ThemedText style={styles.primaryButtonText}>
                            Bắt đầu học ngay
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push("/auth")}
                        activeOpacity={0.8}
                    >
                        <ThemedText style={styles.secondaryButtonText}>
                            Đã có tài khoản? Đăng nhập
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <ThemedText style={styles.footerText}>
                        © 2025 MLN111 Learning Platform
                    </ThemedText>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Feature Card Component
function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <View style={styles.featureCard}>
            <ThemedText style={styles.featureIcon}>{icon}</ThemedText>
            <View style={styles.featureContent}>
                <ThemedText type="subtitle" style={styles.featureTitle}>
                    {title}
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                    {description}
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surfaceAlt,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    hero: {
        alignItems: "center",
        marginBottom: 48,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.accent,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logoText: {
        fontSize: 56,
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 16,
        color: Colors.text,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: Colors.muted,
        lineHeight: 24,
        paddingHorizontal: 16,
    },
    features: {
        marginBottom: 48,
    },
    featureCard: {
        flexDirection: "row",
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    featureIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
        color: Colors.text,
    },
    featureDescription: {
        fontSize: 14,
        color: Colors.muted,
        lineHeight: 20,
    },
    ctaContainer: {
        marginBottom: 32,
    },
    primaryButton: {
        backgroundColor: Colors.accent,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: "center",
        marginBottom: 16,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: Colors.accentSoft,
        fontSize: 18,
        fontWeight: "700",
    },
    secondaryButton: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: "center",
    },
    secondaryButtonText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: "600",
    },
    footer: {
        alignItems: "center",
        paddingVertical: 24,
    },
    footerText: {
        fontSize: 12,
        color: Colors.muted,
    },
});
