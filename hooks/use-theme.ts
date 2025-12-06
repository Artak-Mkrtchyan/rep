import { useColorScheme as useRNColorScheme } from 'react-native';

import { THEME } from '@/lib/theme';

export type ThemeMode = 'light' | 'dark';
export type ThemeTokens = (typeof THEME)[keyof typeof THEME];

export const useTheme = (): { mode: ThemeMode; tokens: ThemeTokens } => {
  const scheme = useRNColorScheme();
  const mode: ThemeMode = scheme === 'dark' ? 'dark' : 'light';
  return { mode, tokens: THEME[mode] };
};

export const useThemeValue = <K extends keyof ThemeTokens>(key: K): ThemeTokens[K] => {
  const { tokens } = useTheme();
  return tokens[key];
};
