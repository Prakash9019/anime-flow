// theme.ts
// theme.ts
import { Platform } from 'react-native';

export const COLORS = {
  black: '#000000',
  cyan: '#00FCEB',
  grey: '#1C1C1E',
  text: '#FFFFFF',
  dim: 'rgba(255,255,255,0.75)'
} as const;

export const SIZES = {
  h1: 34,
  h2: 24,
  h3: 18,
  body: 14,
  small: 12,
  radius: 14
} as const;

export const FONTS = {
  title: Platform.select({
    ios: 'JapanRamen',
    android: 'JapanRamen',
    default: 'System', // Fallback
  }),
  body: 'System'
} as const;