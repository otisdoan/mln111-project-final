import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handle Sign In / Sign Up
   * 
   * Flow:
   * 1. Validate input
   * 2. Call signIn/signUp từ AuthContext
   * 3. Nếu thành công → AuthGuard tự động redirect
   * 4. useEffect check user → redirect home
   * 5. Nếu lỗi → hiển thị error message
   */
  const handleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
        Alert.alert("Lỗi", error.message);
      } else {
        // Success - AuthContext sẽ tự động redirect
        if (isSignUp) {
          Alert.alert(
            "Thành công",
            "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản (nếu bật email confirmation)."
          );
        }
      }
    } catch (err: any) {
      setError(err.message);
      Alert.alert("Lỗi", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('🔍 Google login button pressed');
    setError("");
    setLoading(true);

    try {
      console.log('🔍 Calling signInWithGoogle...');
      const { error } = await signInWithGoogle();

      if (error) {
        console.error('❌ Google login error:', error.message);
        setError(error.message);
        Alert.alert("Lỗi đăng nhập Google", error.message);
      } else {
        console.log('✅ Google login initiated successfully');
        // Success - AuthGuard sẽ tự động redirect
      }
    } catch (err: any) {
      console.error('❌ Google login exception:', err);
      setError(err.message);
      Alert.alert("Lỗi", err.message || "Không thể đăng nhập bằng Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: isSignUp ? "Đăng ký" : "Đăng nhập",
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
                {isSignUp ? "Đăng ký tài khoản" : "Đăng nhập"}
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                {isSignUp
                  ? "Tạo tài khoản mới để bắt đầu học tập"
                  : "Đăng nhập để tiếp tục học tập"}
              </ThemedText>

              {error ? (
                <View style={styles.errorBox}>
                  <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
                </View>
              ) : null}

              <View style={styles.form}>
                <View style={styles.formGroup}>
                  <ThemedText style={styles.label}>Email</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                  />
                </View>

                <View style={styles.formGroup}>
                  <ThemedText style={styles.label}>Mật khẩu</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry
                    autoComplete="password"
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                  />
                  {isSignUp && (
                    <ThemedText style={styles.hint}>
                      Tối thiểu 6 ký tự
                    </ThemedText>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.buttonDisabled]}
                  onPress={handleAuth}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.accentSoft} />
                  ) : (
                    <ThemedText style={styles.loginButtonText}>
                      {isSignUp ? "Đăng ký" : "Đăng nhập"}
                    </ThemedText>
                  )}
                </TouchableOpacity>
              </View>

              <ThemedText style={styles.divider}>— hoặc —</ThemedText>

              <TouchableOpacity
                style={[styles.googleButton, loading && styles.buttonDisabled]}
                onPress={handleGoogleLogin}
                disabled={loading}
                activeOpacity={0.7}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.text} />
                ) : (
                  <>
                    <ThemedText style={styles.googleIcon}>🔍</ThemedText>
                    <ThemedText style={styles.googleButtonText}>
                      Đăng nhập với Google
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <ThemedText style={styles.signupText}>
                  {isSignUp ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
                  <ThemedText style={styles.signupLink}>
                    {isSignUp ? "Đăng nhập" : "Đăng ký"}
                  </ThemedText>
                </ThemedText>
              </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  googleIcon: {
    fontSize: 20,
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
  errorBox: {
    backgroundColor: "#fee",
    borderWidth: 1,
    borderColor: "#fcc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#c00",
    fontSize: 14,
  },
  hint: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
