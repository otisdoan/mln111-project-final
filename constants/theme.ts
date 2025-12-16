/**
 * Theme colors matching the web app design
 * Based on dau-tranh-giai-cap/app/globals.css
 */

import { Platform } from "react-native";

export const Colors = {
  primary: "#d4af37", // --color-primary: gold
  accent: "#c41e3a", // --color-accent: red
  accentSoft: "#ffd700", // --color-accent-soft: bright gold
  surface: "#ffffff", // --color-surface
  surfaceAlt: "#fff8f0", // --color-surface-alt: cream
  text: "#1a1a1a", // --color-text: dark gray
  muted: "#666666", // --color-muted
  border: "#ffe4e1", // --color-border: light pink

  // Hero colors
  heroText: "#ffd666", // Hero heading gold
  heroSubtext: "#ffe8a3", // Hero paragraph gold
  heroButton: "#e74c3c", // Hero button red

  // Badge colors
  badgeSuccess: "#e7f6ed",
  badgeSuccessText: "#1f8a4c",
  badgeWarning: "#fff4e0",
  badgeWarningText: "#b85c00",
  badgeMuted: "#eef1f6",

  // Highlight
  highlightBg: "#fffbf0",
  highlightBorder: "#ffd700",

  light: {
    text: "#1a1a1a",
    background: "#fff8f0",
    tint: "#c41e3a",
    icon: "#666666",
    tabIconDefault: "#666666",
    tabIconSelected: "#c41e3a",
  },
  dark: {
    text: "#ffe8a3",
    background: "#151718",
    tint: "#ffd700",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#ffd700",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
