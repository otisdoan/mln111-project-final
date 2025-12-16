import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import flashcards from "@/data/flashcards.json";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FlashcardScreen() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));

  const card = flashcards[index];
  const progress = useMemo(
    () => Math.round(((index + 1) / flashcards.length) * 100),
    [index]
  );

  const handleFlip = () => {
    if (flipped) {
      Animated.spring(flipAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
    setFlipped(!flipped);
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % flashcards.length);
    setFlipped(false);
    flipAnim.setValue(0);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setFlipped(false);
    flipAnim.setValue(0);
  };

  const shuffle = () => {
    const random = Math.floor(Math.random() * flashcards.length);
    setIndex(random);
    setFlipped(false);
    flipAnim.setValue(0);
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: "Flashcard",
          headerLargeTitle: true,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ThemedView style={styles.container}>
          <View style={styles.section}>
            <View style={styles.header}>
              <View>
                <ThemedText type="title" style={styles.title}>
                  Flashcard ôn nhanh
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  Tap để lật thẻ. Dùng Next/Prev/Shuffle để luyện.
                </ThemedText>
              </View>
              <View style={styles.counterPill}>
                <ThemedText style={styles.counterText}>
                  {index + 1}/{flashcards.length}
                </ThemedText>
              </View>
            </View>

            <TouchableOpacity
              style={styles.flashcardContainer}
              onPress={handleFlip}
              activeOpacity={0.9}
            >
              <Animated.View
                style={[
                  styles.flashcard,
                  styles.flashcardFront,
                  { transform: [{ rotateY: frontRotate }] },
                  flipped && styles.hidden,
                ]}
              >
                <ThemedText type="subtitle" style={styles.cardText}>
                  {card.front}
                </ThemedText>
              </Animated.View>

              <Animated.View
                style={[
                  styles.flashcard,
                  styles.flashcardBack,
                  { transform: [{ rotateY: backRotate }] },
                  !flipped && styles.hidden,
                ]}
              >
                <ThemedText style={styles.cardText}>{card.back}</ThemedText>
              </Animated.View>
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={prev}>
                <ThemedText style={styles.buttonText}>← Prev</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={next}>
                <ThemedText style={styles.primaryButtonText}>Next →</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={shuffle}
              >
                <ThemedText style={styles.buttonText}>🔀 Shuffle</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
  },
  section: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.muted,
  },
  counterPill: {
    backgroundColor: Colors.badgeWarning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  counterText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.badgeWarningText,
  },
  flashcardContainer: {
    height: 300,
    marginBottom: 24,
  },
  flashcard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    padding: 32,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    backfaceVisibility: "hidden",
    borderWidth: 2,
    borderColor: Colors.accentSoft,
  },
  flashcardFront: {
    backgroundColor: Colors.highlightBg,
  },
  flashcardBack: {
    backgroundColor: Colors.badgeSuccess,
  },
  hidden: {
    opacity: 0,
  },
  cardText: {
    fontSize: 20,
    textAlign: "center",
    lineHeight: 30,
    color: Colors.text,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.accent,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.accentSoft,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.accent,
  },
});
