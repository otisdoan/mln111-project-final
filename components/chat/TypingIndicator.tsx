/**
 * Typing Indicator Component (AI đang suy nghĩ...)
 */

import { Colors } from "@/constants/theme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = animate(dot1, 0);
    const animation2 = animate(dot2, 200);
    const animation3 = animate(dot3, 400);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot1,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot2,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot3,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 12,
    alignItems: "flex-start",
  },
  bubble: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.accentSoft,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
});
