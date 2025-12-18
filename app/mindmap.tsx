import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function MindmapScreen() {
  const router = useRouter();

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "navigate" && data.link) {
        router.push(data.link);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Sơ đồ tư duy",
          headerLargeTitle: true,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}
        edges={["bottom"]}
      >
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Sơ đồ tư duy
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Vuốt và zoom để khám phá cấu trúc kiến thức
            </ThemedText>
          </View>

          <WebView
            source={require("@/assets/mindmap.html")}
            style={styles.webview}
            onMessage={handleMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={true}
            scalesPageToFit={true}
            originWhitelist={["*"]}
          />
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
  header: {
    padding: 20,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.muted,
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
  },
});
