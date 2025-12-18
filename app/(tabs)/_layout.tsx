import { Tabs } from "expo-router";

import { FloatingChatButton } from "@/components/FloatingChatButton";
import { HapticTab } from "@/components/haptic-tab";
import { ProfileButton } from "@/components/ProfileButton";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          tabBarButton: HapticTab,
          headerRight: () => <ProfileButton />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Khám phá",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="magnifyingglass" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="user"
          options={{
            title: "Người dùng",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
            headerRight: undefined,
          }}
        />
      </Tabs>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </View>
  );
}
