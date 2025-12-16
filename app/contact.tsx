import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    Alert.alert("Thông báo", "Chức năng gửi liên hệ đang được phát triển.");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Liên hệ",
          headerLargeTitle: true,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            <ThemedText type="title" style={styles.title}>
              Liên hệ
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Góp ý và hỗ trợ cho nền tảng học Triết Mác – Lênin.
            </ThemedText>

            <View style={styles.card}>
              <ThemedText style={styles.infoText}>
                Vui lòng gửi email tới: contact@example.com hoặc để lại thông
                tin bên dưới.
              </ThemedText>

              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Họ tên"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Nội dung góp ý"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  value={message}
                  onChangeText={setMessage}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <ThemedText style={styles.submitButtonText}>Gửi</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ThemedView>
        </ScrollView>
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
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 24,
  },
  card: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    backgroundColor: Colors.surface,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  infoText: {
    fontSize: 15,
    color: Colors.muted,
    marginBottom: 20,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: Colors.accentSoft,
    fontSize: 16,
    fontWeight: "600",
  },
});
