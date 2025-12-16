import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import quizData from "@/data/quiz.json";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "mcq" | "match" | "fill";

export default function QuizScreen() {
  const [mode, setMode] = useState<Mode>("mcq");

  return (
    <>
      <Stack.Screen
        options={{
          title: "Quiz",
          headerLargeTitle: true,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            <View style={styles.header}>
              <View>
                <ThemedText type="title" style={styles.title}>
                  Quiz & Mini game ôn tập
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  Trắc nghiệm, ghép cặp, điền chỗ trống.
                </ThemedText>
              </View>
            </View>

            {/* Mode Selector */}
            <View style={styles.modeSelector}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  mode === "mcq" && styles.modeButtonActive,
                ]}
                onPress={() => setMode("mcq")}
              >
                <ThemedText
                  style={[
                    styles.modeButtonText,
                    mode === "mcq" && styles.modeButtonTextActive,
                  ]}
                >
                  Trắc nghiệm
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  mode === "match" && styles.modeButtonActive,
                ]}
                onPress={() => setMode("match")}
              >
                <ThemedText
                  style={[
                    styles.modeButtonText,
                    mode === "match" && styles.modeButtonTextActive,
                  ]}
                >
                  Ghép cặp
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  mode === "fill" && styles.modeButtonActive,
                ]}
                onPress={() => setMode("fill")}
              >
                <ThemedText
                  style={[
                    styles.modeButtonText,
                    mode === "fill" && styles.modeButtonTextActive,
                  ]}
                >
                  Điền chỗ trống
                </ThemedText>
              </TouchableOpacity>
            </View>

            {mode === "mcq" && <McqQuiz />}
            {mode === "match" && <MatchQuiz />}
            {mode === "fill" && <FillQuiz />}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function McqQuiz() {
  const questions = quizData.multipleChoice;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  const current = questions[index];
  const progress = Math.round(((index + 1) / questions.length) * 100);

  const handleSelect = (i: number) => {
    setSelected(i);
    const isCorrect = i === current.answer;
    setResult(isCorrect ? "correct" : "incorrect");
  };

  const next = () => {
    setSelected(null);
    setResult(null);
    setIndex((prev) => (prev + 1) % questions.length);
  };

  return (
    <View style={styles.quizCard}>
      <View style={styles.modePill}>
        <ThemedText style={styles.modePillText}>Chế độ: Trắc nghiệm</ThemedText>
      </View>

      <ThemedText type="defaultSemiBold" style={styles.question}>
        {current.question}
      </ThemedText>

      <View style={styles.optionsContainer}>
        {current.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.option,
              selected === i && result === "correct" && styles.optionCorrect,
              selected === i &&
                result === "incorrect" &&
                styles.optionIncorrect,
            ]}
            onPress={() => handleSelect(i)}
          >
            <ThemedText style={styles.optionText}>{opt}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {result && (
        <ThemedText style={styles.explanation}>
          {result === "correct" ? "✅ Chính xác!" : "❌ Chưa đúng."}{" "}
          {current.explanation}
        </ThemedText>
      )}

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={next}>
        <ThemedText style={styles.primaryButtonText}>Câu tiếp →</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function MatchQuiz() {
  const item = quizData.matchPairs[0];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const correctPairs = Object.fromEntries(
    item.answer.map((pair: any) => [pair[0], pair[1]])
  );

  const isCorrect = (leftId: string) =>
    answers[leftId] && correctPairs[leftId] === answers[leftId];

  return (
    <View style={styles.quizCard}>
      <View style={styles.modePill}>
        <ThemedText style={styles.modePillText}>Chế độ: Ghép cặp</ThemedText>
      </View>

      <ThemedText type="defaultSemiBold" style={styles.question}>
        {item.prompt}
      </ThemedText>

      {item.left.map((left: any) => (
        <View key={left.id} style={styles.matchItem}>
          <ThemedText style={styles.matchLabel}>{left.text}</ThemedText>
          <ThemedText style={styles.matchSubtext}>Chọn mô tả:</ThemedText>
          <View style={styles.matchOptions}>
            {item.right.map((right: any) => (
              <TouchableOpacity
                key={right.id}
                style={[
                  styles.matchOption,
                  answers[left.id] === right.id && styles.matchOptionSelected,
                ]}
                onPress={() =>
                  setAnswers((prev) => ({ ...prev, [left.id]: right.id }))
                }
              >
                <ThemedText style={styles.matchOptionText}>
                  {right.text}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          {checked && answers[left.id] && (
            <ThemedText
              style={
                isCorrect(left.id) ? styles.correctText : styles.incorrectText
              }
            >
              {isCorrect(left.id) ? "✅ Đúng" : "❌ Sai"}
            </ThemedText>
          )}
        </View>
      ))}

      <View style={styles.quizActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setChecked(true)}
        >
          <ThemedText style={styles.primaryButtonText}>Kiểm tra</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setAnswers({});
            setChecked(false);
          }}
        >
          <ThemedText style={styles.buttonText}>Làm lại</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FillQuiz() {
  const items = quizData.fillBlank;
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const correctCount = items.filter(
    (i: any) => inputs[i.id]?.trim().toLowerCase() === i.answer.toLowerCase()
  ).length;
  const progress = Math.round((correctCount / items.length) * 100);

  return (
    <View style={styles.quizCard}>
      <View style={styles.modePill}>
        <ThemedText style={styles.modePillText}>
          Chế độ: Điền chỗ trống
        </ThemedText>
      </View>

      {items.map((q: any) => (
        <View key={q.id} style={styles.fillItem}>
          <ThemedText style={styles.fillQuestion}>{q.question}</ThemedText>
          <TextInput
            style={styles.textInput}
            value={inputs[q.id] ?? ""}
            onChangeText={(value) =>
              setInputs((prev) => ({ ...prev, [q.id]: value }))
            }
            placeholder="Nhập đáp án"
            placeholderTextColor="#999"
          />
          {checked && (
            <ThemedText style={styles.fillAnswer}>
              Đáp án đúng: {q.answer}
            </ThemedText>
          )}
        </View>
      ))}

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.quizActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setChecked(true)}
        >
          <ThemedText style={styles.primaryButtonText}>Kiểm tra</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setInputs({});
            setChecked(false);
          }}
        >
          <ThemedText style={styles.buttonText}>Làm lại</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
  },
  section: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
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
  modeSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  modeButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  modeButtonTextActive: {
    color: Colors.surface,
  },
  quizCard: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modePill: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.accentSoft,
  },
  modePillText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    color: Colors.text,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  option: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionCorrect: {
    borderColor: Colors.accentSoft,
    backgroundColor: Colors.highlightBg,
  },
  optionIncorrect: {
    borderColor: Colors.accent,
    backgroundColor: "#FFEBEE",
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
  explanation: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.accentSoft,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: Colors.surfaceAlt,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  matchItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  matchLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.text,
  },
  matchSubtext: {
    fontSize: 12,
    color: Colors.muted,
    marginBottom: 8,
  },
  matchOptions: {
    gap: 8,
  },
  matchOption: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  matchOptionSelected: {
    borderColor: Colors.accentSoft,
    backgroundColor: Colors.highlightBg,
  },
  matchOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  correctText: {
    color: Colors.accentSoft,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  incorrectText: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  quizActions: {
    flexDirection: "row",
    gap: 12,
  },
  fillItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fillQuestion: {
    fontSize: 16,
    marginBottom: 12,
    color: Colors.text,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },
  fillAnswer: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.muted,
  },
});
