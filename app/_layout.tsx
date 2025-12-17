import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ProfileButton } from "@/components/ProfileButton";
import { Colors } from "@/constants/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/contexts/AuthGuard";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Custom theme with web app colors
const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.accent,
    background: Colors.surfaceAlt,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.accentSoft,
    background: "#151718",
    card: "#1f1f1f",
    text: Colors.dark.text,
  },
};

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <AuthGuard>
        <ThemeProvider
          value={colorScheme === "dark" ? CustomDarkTheme : LightTheme}
        >
          <Stack
            screenOptions={{
              headerRight: () => <ProfileButton />,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
            <Stack.Screen name="lesson/index" />
            <Stack.Screen name="lesson/[slug]" />
            <Stack.Screen name="video/index" />
            <Stack.Screen name="video/[slug]" />
            <Stack.Screen name="flashcard" />
            <Stack.Screen name="quiz" />
            <Stack.Screen name="mindmap" />
            <Stack.Screen
              name="profile"
              options={{ headerRight: undefined }}
            />
            <Stack.Screen name="summary" />
            <Stack.Screen name="about" />
            <Stack.Screen name="contact" />
            <Stack.Screen
              name="auth"
              options={{ headerRight: undefined, headerShown: false }}
            />
            <Stack.Screen name="lien-minh-giai-cap" />
            <Stack.Screen name="game" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
