/**
 * TRẬN CHIẾN TRI THỨC - Game Quiz Triết Học MLN111
 * 
 * Trò chơi học tập hấp dẫn với:
 * - Quiz đa dạng từ dữ liệu có sẵn
 * - Hệ thống điểm và combo streak
 * - Thời gian đếm ngược gây hồi hộp
 * - Power-ups và thành tích
 * - Leaderboard cá nhân
 */

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import quiz data
import flashcardData from "@/data/flashcards.json";
import quizData from "@/data/quiz.json";

const { width } = Dimensions.get("window");

interface Question {
    id: string;
    question: string;
    options: string[];
    answer: number;
    explanation: string;
    type: "multiple-choice" | "flashcard";
}

interface GameStats {
    score: number;
    combo: number;
    maxCombo: number;
    correct: number;
    wrong: number;
    totalTime: number;
    powerUpsUsed: number;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
}

export default function GameScreen() {
    const router = useRouter();

    // Game state
    const [gameStarted, setGameStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);

    // Stats
    const [stats, setStats] = useState<GameStats>({
        score: 0,
        combo: 0,
        maxCombo: 0,
        correct: 0,
        wrong: 0,
        totalTime: 0,
        powerUpsUsed: 0,
    });

    // Power-ups
    const [powerUps, setPowerUps] = useState({
        fiftyFifty: 1, // Loại bỏ 2 đáp án sai
        extraTime: 1,   // Thêm 15 giây
        skipQuestion: 1, // Bỏ qua câu hỏi
    });
    const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);

    // Achievements
    const [achievements, setAchievements] = useState<Achievement[]>([
        { id: "first-blood", title: "Khởi Đầu", description: "Trả lời đúng câu đầu tiên", icon: "🎯", unlocked: false },
        { id: "combo-5", title: "Streak Master", description: "Đạt combo 5", icon: "🔥", unlocked: false },
        { id: "perfect-10", title: "Hoàn Hảo", description: "10 câu đúng liên tiếp", icon: "💯", unlocked: false },
        { id: "speed-demon", title: "Tốc Độ", description: "Trả lời trong 5 giây", icon: "⚡", unlocked: false },
        { id: "scholar", title: "Học Giả", description: "Đạt 500 điểm", icon: "🎓", unlocked: false },
    ]);
    const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

    // Animation
    const [scaleAnim] = useState(new Animated.Value(1));
    const [shakeAnim] = useState(new Animated.Value(0));

    // Questions pool
    const [questions, setQuestions] = useState<Question[]>([]);

    // Initialize questions
    useEffect(() => {
        const mcQuestions: Question[] = quizData.multipleChoice.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation,
            type: "multiple-choice" as const,
        }));

        // Convert flashcards to quiz format
        const fcQuestions: Question[] = flashcardData.slice(0, 10).map((fc, idx) => ({
            id: fc.id,
            question: fc.front,
            options: [
                fc.back,
                "Đây không phải đáp án đúng",
                "Câu trả lời này sai",
                "Không chính xác",
            ].sort(() => Math.random() - 0.5),
            answer: 0, // Will need to find correct index after shuffle
            explanation: fc.back,
            type: "flashcard" as const,
        }));

        // Fix answer index for flashcards after shuffle
        fcQuestions.forEach(q => {
            q.answer = q.options.findIndex(opt => opt === q.explanation);
        });

        const allQuestions = [...mcQuestions, ...fcQuestions].sort(() => Math.random() - 0.5);
        setQuestions(allQuestions);
    }, []);

    // Timer countdown
    useEffect(() => {
        if (gameStarted && !showResult && !gameOver && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showResult) {
            handleTimeout();
        }
    }, [gameStarted, timeLeft, showResult, gameOver]);

    // Start game
    const handleStartGame = () => {
        setGameStarted(true);
        setCurrentQuestionIndex(0);
        setTimeLeft(30);
        setStats({
            score: 0,
            combo: 0,
            maxCombo: 0,
            correct: 0,
            wrong: 0,
            totalTime: 0,
            powerUpsUsed: 0,
        });
        setEliminatedOptions([]);
    };

    // Handle answer selection
    const handleAnswerSelect = (index: number) => {
        if (showResult || eliminatedOptions.includes(index)) return;

        setSelectedAnswer(index);
        setShowResult(true);

        const currentQuestion = questions[currentQuestionIndex];
        const correct = index === currentQuestion.answer;
        setIsCorrect(correct);

        const timeBonus = Math.floor(timeLeft / 3) * 10;
        const comboMultiplier = stats.combo > 0 ? 1 + (stats.combo * 0.2) : 1;
        const baseScore = correct ? 100 : 0;
        const earnedScore = Math.floor((baseScore + timeBonus) * comboMultiplier);

        if (correct) {
            const newCombo = stats.combo + 1;
            const newScore = stats.score + earnedScore;

            setStats({
                ...stats,
                score: newScore,
                combo: newCombo,
                maxCombo: Math.max(stats.maxCombo, newCombo),
                correct: stats.correct + 1,
                totalTime: stats.totalTime + (30 - timeLeft),
            });

            // Animate success
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();

            // Check achievements
            checkAchievements(newScore, newCombo, 30 - timeLeft);
        } else {
            setStats({
                ...stats,
                combo: 0,
                wrong: stats.wrong + 1,
                totalTime: stats.totalTime + (30 - timeLeft),
            });

            // Animate failure
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();
        }
    };

    // Handle timeout
    const handleTimeout = () => {
        setShowResult(true);
        setIsCorrect(false);
        setStats({
            ...stats,
            combo: 0,
            wrong: stats.wrong + 1,
            totalTime: stats.totalTime + 30,
        });
    };

    // Next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setShowResult(false);
            setTimeLeft(30);
            setEliminatedOptions([]);
        } else {
            setGameOver(true);
        }
    };

    // Power-ups
    const useFiftyFifty = () => {
        if (powerUps.fiftyFifty <= 0 || showResult) return;

        const currentQuestion = questions[currentQuestionIndex];
        const wrongOptions = currentQuestion.options
            .map((_, idx) => idx)
            .filter(idx => idx !== currentQuestion.answer);

        const toEliminate = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        setEliminatedOptions(toEliminate);
        setPowerUps({ ...powerUps, fiftyFifty: powerUps.fiftyFifty - 1 });
        setStats({ ...stats, powerUpsUsed: stats.powerUpsUsed + 1 });
    };

    const useExtraTime = () => {
        if (powerUps.extraTime <= 0 || showResult) return;

        setTimeLeft(timeLeft + 15);
        setPowerUps({ ...powerUps, extraTime: powerUps.extraTime - 1 });
        setStats({ ...stats, powerUpsUsed: stats.powerUpsUsed + 1 });
    };

    const useSkipQuestion = () => {
        if (powerUps.skipQuestion <= 0 || showResult) return;

        handleNextQuestion();
        setPowerUps({ ...powerUps, skipQuestion: powerUps.skipQuestion - 1 });
        setStats({ ...stats, powerUpsUsed: stats.powerUpsUsed + 1 });
    };

    // Check achievements
    const checkAchievements = (score: number, combo: number, responseTime: number) => {
        const newAchievements = [...achievements];
        let unlocked: Achievement | null = null;

        if (stats.correct === 0 && !achievements[0].unlocked) {
            newAchievements[0].unlocked = true;
            unlocked = newAchievements[0];
        }
        if (combo >= 5 && !achievements[1].unlocked) {
            newAchievements[1].unlocked = true;
            unlocked = newAchievements[1];
        }
        if (combo >= 10 && !achievements[2].unlocked) {
            newAchievements[2].unlocked = true;
            unlocked = newAchievements[2];
        }
        if (responseTime <= 5 && !achievements[3].unlocked) {
            newAchievements[3].unlocked = true;
            unlocked = newAchievements[3];
        }
        if (score >= 500 && !achievements[4].unlocked) {
            newAchievements[4].unlocked = true;
            unlocked = newAchievements[4];
        }

        if (unlocked) {
            setAchievements(newAchievements);
            setShowAchievement(unlocked);
            setTimeout(() => setShowAchievement(null), 3000);
        }
    };

    // Restart game
    const handleRestartGame = () => {
        setGameStarted(false);
        setGameOver(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
        setEliminatedOptions([]);
        setPowerUps({ fiftyFifty: 1, extraTime: 1, skipQuestion: 1 });

        // Shuffle questions
        setQuestions([...questions].sort(() => Math.random() - 0.5));
    };

    if (questions.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.accent} />
                <ThemedText style={styles.loadingText}>Đang chuẩn bị trận chiến...</ThemedText>
            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <>
            <Stack.Screen options={{ title: "🎮 Trận Chiến Tri Thức" }} />
            <SafeAreaView style={styles.container} edges={["bottom"]}>
                {/* Achievement Popup */}
                {showAchievement && (
                    <View style={styles.achievementPopup}>
                        <ThemedText style={styles.achievementIcon}>{showAchievement.icon}</ThemedText>
                        <ThemedText style={styles.achievementTitle}>{showAchievement.title}</ThemedText>
                        <ThemedText style={styles.achievementDesc}>{showAchievement.description}</ThemedText>
                    </View>
                )}

                {!gameStarted ? (
                    <ScrollView contentContainerStyle={styles.menuContainer}>
                        <View style={styles.titleSection}>
                            <ThemedText style={styles.gameTitleIcon}>⚔️</ThemedText>
                            <ThemedText style={styles.gameTitle}>TRẬN CHIẾN</ThemedText>
                            <ThemedText style={styles.gameTitleSub}>TRÍ THỨC</ThemedText>
                            <ThemedText style={styles.gameSubtitle}>
                                Triết Học Mác - Lênin
                            </ThemedText>
                        </View>

                        <View style={styles.featuresSection}>
                            <FeatureItem icon="🎯" text={`${questions.length} câu hỏi thử thách`} />
                            <FeatureItem icon="⏱️" text="30 giây mỗi câu" />
                            <FeatureItem icon="🔥" text="Hệ thống Combo & Điểm" />
                            <FeatureItem icon="⚡" text="Power-ups hỗ trợ" />
                            <FeatureItem icon="🏆" text="Thành tích mở khóa" />
                        </View>

                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={handleStartGame}
                            activeOpacity={0.8}
                        >
                            <ThemedText style={styles.startButtonText}>BẮT ĐẦU CHIẾN ĐẤU</ThemedText>
                        </TouchableOpacity>

                        <View style={styles.achievementsPreview}>
                            <ThemedText type="subtitle" style={styles.achievementsTitle}>
                                🏆 Thành Tích
                            </ThemedText>
                            <View style={styles.achievementsList}>
                                {achievements.map(ach => (
                                    <View
                                        key={ach.id}
                                        style={[
                                            styles.achievementBadge,
                                            !ach.unlocked && styles.achievementLocked,
                                        ]}
                                    >
                                        <ThemedText style={styles.achievementBadgeIcon}>
                                            {ach.unlocked ? ach.icon : "🔒"}
                                        </ThemedText>
                                        <ThemedText style={styles.achievementBadgeText}>
                                            {ach.title}
                                        </ThemedText>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                ) : gameOver ? (
                    <ScrollView contentContainerStyle={styles.gameOverContainer}>
                        <ThemedText style={styles.gameOverTitle}>
                            {stats.score >= 500 ? "🎉 XUẤT SẮC!" : stats.score >= 300 ? "👍 TỐT!" : "💪 CỐ LÊN!"}
                        </ThemedText>

                        <View style={styles.finalScoreCard}>
                            <ThemedText style={styles.finalScore}>{stats.score}</ThemedText>
                            <ThemedText style={styles.finalScoreLabel}>ĐIỂM TỔNG</ThemedText>
                        </View>

                        <View style={styles.statsGrid}>
                            <StatItem label="Đúng" value={stats.correct} icon="✅" />
                            <StatItem label="Sai" value={stats.wrong} icon="❌" />
                            <StatItem label="Combo Max" value={stats.maxCombo} icon="🔥" />
                            <StatItem label="Thời gian TB" value={`${Math.floor(stats.totalTime / (stats.correct + stats.wrong))}s`} icon="⏱️" />
                        </View>

                        <View style={styles.feedbackSection}>
                            <ThemedText style={styles.feedbackText}>
                                {stats.correct / (stats.correct + stats.wrong) >= 0.8
                                    ? "Bạn nắm vững kiến thức! Tiếp tục phát huy! 🌟"
                                    : stats.correct / (stats.correct + stats.wrong) >= 0.5
                                        ? "Cần ôn tập thêm một chút nữa! 📚"
                                        : "Hãy xem lại bài học để hiểu rõ hơn nhé! 💡"}
                            </ThemedText>
                        </View>

                        <View style={styles.gameOverButtons}>
                            <TouchableOpacity
                                style={styles.restartButton}
                                onPress={handleRestartGame}
                            >
                                <ThemedText style={styles.restartButtonText}>🔄 CHƠI LẠI</ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                            >
                                <ThemedText style={styles.backButtonText}>◀ TRANG CHỦ</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                ) : (
                    <View style={styles.gameContainer}>
                        {/* Header Stats */}
                        <View style={styles.headerStats}>
                            <View style={styles.statBubble}>
                                <ThemedText style={styles.statLabel}>Điểm</ThemedText>
                                <Animated.Text style={[styles.statValue, { transform: [{ scale: scaleAnim }] }]}>
                                    {stats.score}
                                </Animated.Text>
                            </View>

                            <View style={[styles.statBubble, styles.timerBubble]}>
                                <ThemedText style={styles.statLabel}>⏱️</ThemedText>
                                <ThemedText style={[
                                    styles.statValue,
                                    timeLeft <= 5 && styles.urgentTimer,
                                ]}>
                                    {timeLeft}s
                                </ThemedText>
                            </View>

                            <View style={styles.statBubble}>
                                <ThemedText style={styles.statLabel}>Combo</ThemedText>
                                <ThemedText style={[styles.statValue, stats.combo > 0 && styles.comboActive]}>
                                    {stats.combo > 0 ? `🔥 ${stats.combo}x` : "0x"}
                                </ThemedText>
                            </View>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` },
                                    ]}
                                />
                            </View>
                            <ThemedText style={styles.progressText}>
                                Câu {currentQuestionIndex + 1}/{questions.length}
                            </ThemedText>
                        </View>

                        {/* Question Card */}
                        <Animated.View style={[
                            styles.questionCard,
                            { transform: [{ translateX: shakeAnim }] },
                        ]}>
                            <ThemedText style={styles.questionText}>
                                {currentQuestion.question}
                            </ThemedText>
                        </Animated.View>

                        {/* Answer Options */}
                        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const isCorrectAnswer = index === currentQuestion.answer;
                                const isEliminated = eliminatedOptions.includes(index);

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.optionButton,
                                            isEliminated && styles.optionEliminated,
                                            showResult && isSelected && isCorrect && styles.optionCorrect,
                                            showResult && isSelected && !isCorrect && styles.optionWrong,
                                            showResult && isCorrectAnswer && styles.optionCorrect,
                                        ]}
                                        onPress={() => handleAnswerSelect(index)}
                                        disabled={showResult || isEliminated}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.optionInner}>
                                            <View style={styles.optionContent}>
                                                <ThemedText style={styles.optionLetter}>
                                                    {String.fromCharCode(65 + index)}
                                                </ThemedText>
                                                <ThemedText style={[
                                                    styles.optionText,
                                                    isEliminated && styles.optionTextEliminated,
                                                ]}>
                                                    {option}
                                                </ThemedText>
                                            </View>
                                            {showResult && isCorrectAnswer && (
                                                <View style={styles.iconContainer}>
                                                    <ThemedText style={styles.correctIcon}>✓</ThemedText>
                                                </View>
                                            )}
                                            {showResult && isSelected && !isCorrect && (
                                                <View style={styles.iconContainer}>
                                                    <ThemedText style={styles.wrongIcon}>✗</ThemedText>
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {/* Power-ups Bar */}
                        {!showResult && (
                            <View style={styles.powerUpsBar}>
                                <TouchableOpacity
                                    style={[styles.powerUpButton, powerUps.fiftyFifty === 0 && styles.powerUpDisabled]}
                                    onPress={useFiftyFifty}
                                    disabled={powerUps.fiftyFifty === 0}
                                >
                                    <ThemedText style={styles.powerUpIcon}>50:50</ThemedText>
                                    <ThemedText style={styles.powerUpLabel}>Loại 2 đáp án</ThemedText>
                                    <ThemedText style={styles.powerUpCount}>x{powerUps.fiftyFifty}</ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.powerUpButton, powerUps.extraTime === 0 && styles.powerUpDisabled]}
                                    onPress={useExtraTime}
                                    disabled={powerUps.extraTime === 0}
                                >
                                    <ThemedText style={styles.powerUpIcon}>⏱️</ThemedText>
                                    <ThemedText style={styles.powerUpLabel}>Thêm 15s</ThemedText>
                                    <ThemedText style={styles.powerUpCount}>x{powerUps.extraTime}</ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.powerUpButton, powerUps.skipQuestion === 0 && styles.powerUpDisabled]}
                                    onPress={useSkipQuestion}
                                    disabled={powerUps.skipQuestion === 0}
                                >
                                    <ThemedText style={styles.powerUpIcon}>⏭️</ThemedText>
                                    <ThemedText style={styles.powerUpLabel}>Bỏ qua</ThemedText>
                                    <ThemedText style={styles.powerUpCount}>x{powerUps.skipQuestion}</ThemedText>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Result Modal */}
                        {showResult && (
                            <View style={styles.resultOverlay}>
                                <View style={[
                                    styles.resultCard,
                                    isCorrect ? styles.resultCorrect : styles.resultWrong,
                                ]}>
                                    <ThemedText style={styles.resultIcon}>
                                        {isCorrect ? "🎉" : "❌"}
                                    </ThemedText>
                                    <ThemedText style={styles.resultTitle}>
                                        {isCorrect ? "CHÍNH XÁC!" : "SAI RỒI!"}
                                    </ThemedText>
                                    <ThemedText style={styles.resultExplanation}>
                                        {currentQuestion.explanation}
                                    </ThemedText>

                                    <TouchableOpacity
                                        style={styles.nextButton}
                                        onPress={handleNextQuestion}
                                    >
                                        <ThemedText style={styles.nextButtonText}>
                                            {currentQuestionIndex < questions.length - 1 ? "CÂU TIẾP THEO ▶" : "KẾT THÚC 🏁"}
                                        </ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </SafeAreaView>
        </>
    );
}

// Helper Components
function FeatureItem({ icon, text }: { icon: string; text: string }) {
    return (
        <View style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>{icon}</ThemedText>
            <ThemedText style={styles.featureText}>{text}</ThemedText>
        </View>
    );
}

function StatItem({ label, value, icon }: { label: string; value: string | number; icon: string }) {
    return (
        <View style={styles.statItem}>
            <ThemedText style={styles.statItemIcon}>{icon}</ThemedText>
            <ThemedText style={styles.statItemValue}>{value}</ThemedText>
            <ThemedText style={styles.statItemLabel}>{label}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surfaceAlt,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.surfaceAlt,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.muted,
    },

    // Menu styles
    menuContainer: {
        padding: 24,
        alignItems: "center",
        flexGrow: 1,
    },
    titleSection: {
        alignItems: "center",
        marginBottom: 32,
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.border,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    gameTitleIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    gameTitle: {
        fontSize: 32,
        fontWeight: "800",
        color: Colors.accent,
        textAlign: "center",
        letterSpacing: 2,
        marginBottom: 0,
    },
    gameTitleSub: {
        fontSize: 32,
        fontWeight: "800",
        color: Colors.primary,
        textAlign: "center",
        letterSpacing: 2,
        marginBottom: 12,
    },
    gameSubtitle: {
        fontSize: 15,
        color: Colors.text,
        marginTop: 8,
        textAlign: "center",
        fontWeight: "500",
    },
    featuresSection: {
        width: "100%",
        marginBottom: 28,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    featureIcon: {
        fontSize: 24,
        marginRight: 14,
        width: 32,
    },
    featureText: {
        fontSize: 15,
        color: Colors.text,
        flex: 1,
        fontWeight: "500",
    },
    startButton: {
        backgroundColor: Colors.accent,
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 14,
        width: "100%",
        alignItems: "center",
        marginBottom: 28,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 2,
        borderColor: "#a01828",
    },
    startButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: 1,
    },
    achievementsPreview: {
        width: "100%",
        backgroundColor: Colors.surface,
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    achievementsTitle: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 16,
        textAlign: "center",
        color: Colors.text,
    },
    achievementsList: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        gap: 10,
    },
    achievementBadge: {
        backgroundColor: Colors.surfaceAlt,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        width: (width - 80) / 3,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    achievementLocked: {
        opacity: 0.4,
    },
    achievementBadgeIcon: {
        fontSize: 28,
        marginBottom: 4,
    },
    achievementBadgeText: {
        fontSize: 9,
        textAlign: "center",
        color: Colors.muted,
        lineHeight: 12,
    },

    // Game styles
    gameContainer: {
        flex: 1,
        padding: 12,
    },
    headerStats: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        gap: 8,
    },
    statBubble: {
        backgroundColor: Colors.surface,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        minHeight: 70,
        justifyContent: "center",
    },
    timerBubble: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    statLabel: {
        fontSize: 11,
        color: Colors.muted,
        marginBottom: 4,
        fontWeight: "600",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "800",
        color: Colors.text,
    },
    urgentTimer: {
        color: Colors.accent,
        fontSize: 20,
    },
    comboActive: {
        color: Colors.accent,
        fontSize: 16,
    },
    progressContainer: {
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    progressBar: {
        height: 6,
        backgroundColor: Colors.surface,
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 6,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    progressFill: {
        height: "100%",
        backgroundColor: Colors.accent,
    },
    progressText: {
        fontSize: 11,
        textAlign: "center",
        color: Colors.muted,
        fontWeight: "600",
    },
    questionCard: {
        backgroundColor: Colors.surface,
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: Colors.accent,
        minHeight: 100,
        justifyContent: "center",
    },
    questionText: {
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 24,
        color: Colors.text,
        textAlign: "center",
    },
    optionsContainer: {
        flex: 1,
        marginBottom: 12,
    },
    optionButton: {
        backgroundColor: Colors.surface,
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: Colors.border,
        minHeight: 60,
    },
    optionEliminated: {
        opacity: 0.3,
        backgroundColor: "#f0f0f0",
    },
    optionCorrect: {
        borderColor: "#4caf50",
        backgroundColor: "#e8f5e9",
        borderWidth: 3,
    },
    optionWrong: {
        borderColor: Colors.accent,
        backgroundColor: "#ffebee",
        borderWidth: 3,
    },
    optionInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    optionContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        paddingRight: 10,
    },
    optionLetter: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        color: "#1a1a1a",
        textAlign: "center",
        lineHeight: 32,
        fontWeight: "700",
        marginRight: 12,
        fontSize: 16,
        flexShrink: 0,
    },
    optionText: {
        flex: 1,
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
    },
    optionTextEliminated: {
        textDecorationLine: "line-through",
        color: Colors.muted,
    },
    iconContainer: {
        width: 30,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    correctIcon: {
        fontSize: 22,
        color: "#4caf50",
        fontWeight: "700",
    },
    wrongIcon: {
        fontSize: 22,
        color: Colors.accent,
        fontWeight: "700",
    },

    // Power-ups
    powerUpsBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        paddingHorizontal: 8,
        backgroundColor: Colors.surface,
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: 6,
    },
    powerUpButton: {
        alignItems: "center",
        padding: 8,
        flex: 1,
        borderRadius: 8,
        backgroundColor: Colors.surfaceAlt,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    powerUpDisabled: {
        opacity: 0.25,
    },
    powerUpIcon: {
        fontSize: 18,
        marginBottom: 2,
    },
    powerUpLabel: {
        fontSize: 9,
        color: Colors.muted,
        fontWeight: "600",
        marginBottom: 2,
        textAlign: "center",
    },
    powerUpCount: {
        fontSize: 10,
        color: Colors.accent,
        fontWeight: "700",
    },

    // Result overlay
    resultOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    resultCard: {
        backgroundColor: Colors.surface,
        padding: 24,
        borderRadius: 16,
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
    },
    resultCorrect: {
        borderWidth: 3,
        borderColor: "#4caf50",
    },
    resultWrong: {
        borderWidth: 3,
        borderColor: Colors.accent,
    },
    resultIcon: {
        fontSize: 56,
        marginBottom: 12,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 12,
        color: Colors.text,
    },
    resultExplanation: {
        fontSize: 14,
        textAlign: "center",
        color: Colors.text,
        marginBottom: 20,
        lineHeight: 22,
        paddingHorizontal: 8,
    },
    nextButton: {
        backgroundColor: Colors.accent,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 10,
        minWidth: 200,
    },
    nextButtonText: {
        color: Colors.accentSoft,
        fontSize: 15,
        fontWeight: "700",
        textAlign: "center",
    },

    // Game Over
    gameOverContainer: {
        padding: 20,
        alignItems: "center",
    },
    gameOverTitle: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 20,
        color: Colors.accent,
        textAlign: "center",
    },
    finalScoreCard: {
        backgroundColor: Colors.accent,
        padding: 28,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 20,
        width: "100%",
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    finalScore: {
        fontSize: 56,
        fontWeight: "800",
        color: Colors.accentSoft,
    },
    finalScoreLabel: {
        fontSize: 14,
        color: Colors.accentSoft,
        marginTop: 6,
        fontWeight: "600",
        letterSpacing: 1,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
        width: "100%",
    },
    statItem: {
        backgroundColor: Colors.surface,
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        width: (width - 60) / 2,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statItemIcon: {
        fontSize: 28,
        marginBottom: 6,
    },
    statItemValue: {
        fontSize: 20,
        fontWeight: "700",
        color: Colors.text,
        marginBottom: 4,
    },
    statItemLabel: {
        fontSize: 11,
        color: Colors.muted,
        fontWeight: "600",
    },
    feedbackSection: {
        backgroundColor: Colors.surface,
        padding: 18,
        borderRadius: 12,
        marginBottom: 20,
        width: "100%",
        borderWidth: 1,
        borderColor: Colors.border,
    },
    feedbackText: {
        fontSize: 14,
        textAlign: "center",
        color: Colors.text,
        lineHeight: 22,
    },
    gameOverButtons: {
        width: "100%",
    },
    restartButton: {
        backgroundColor: Colors.accent,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 10,
    },
    restartButtonText: {
        color: Colors.accentSoft,
        fontSize: 16,
        fontWeight: "700",
    },
    backButton: {
        backgroundColor: Colors.surface,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 2,
        borderColor: Colors.border,
    },
    backButtonText: {
        color: Colors.text,
        fontSize: 15,
        fontWeight: "600",
    },

    // Achievement Popup
    achievementPopup: {
        position: "absolute",
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: Colors.accent,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        zIndex: 1000,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    achievementIcon: {
        fontSize: 40,
        marginBottom: 6,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.accentSoft,
        marginBottom: 4,
    },
    achievementDesc: {
        fontSize: 12,
        color: Colors.accentSoft,
        textAlign: "center",
        lineHeight: 16,
    },
});
