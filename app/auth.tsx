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

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    Alert.alert("Thông báo", "Chức năng đăng nhập đang được phát triển.");
  };

  const handleGoogleLogin = () => {
    Alert.alert("Thông báo", "Đăng nhập Google đang được phát triển.");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Đăng nhập",
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ScrollView style={styles.container}>
          <ThemedView style={styles.section}>
            <View style={styles.authCard}>
              <ThemedText type="title" style={styles.title}>
                Đăng nhập / Đăng ký
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Giao diện tối giản. Bạn có thể dùng Google SSO.
              </ThemedText>

              <View style={styles.form}>
                <View style={styles.formGroup}>
                  <ThemedText style={styles.label}>Email</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.formGroup}>
                  <ThemedText style={styles.label}>Mật khẩu</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <ThemedText style={styles.loginButtonText}>
                    Đăng nhập
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <ThemedText style={styles.divider}>— hoặc —</ThemedText>

              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleLogin}
              >
                <ThemedText style={styles.googleButtonText}>
                  Đăng nhập với Google
                </ThemedText>
              </TouchableOpacity>

              <ThemedText style={styles.signupText}>
                Chưa có tài khoản?{" "}
                <ThemedText style={styles.signupLink}>Đăng ký</ThemedText>
              </ThemedText>
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
    paddingTop: 40,
  },
  authCard: {
    padding: 24,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
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
  loginButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: Colors.accentSoft,
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    textAlign: "center",
    color: Colors.muted,
    marginVertical: 16,
  },
  googleButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accentSoft,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  signupText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
    color: Colors.muted,
  },
  signupLink: {
    color: Colors.accent,
    fontWeight: "600",
  },
});
