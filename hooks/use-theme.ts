import { THEME } from '@/lib/theme';

export type ThemeMode = 'light' | 'dark';
export type ThemeTokens = (typeof THEME)[keyof typeof THEME];

// Force light mode - app does not follow system theme
const FORCED_THEME: ThemeMode = 'light';

export const useTheme = (): { mode: ThemeMode; tokens: ThemeTokens } => {
  return { mode: FORCED_THEME, tokens: THEME[FORCED_THEME] };
};

export const useThemeValue = <K extends keyof ThemeTokens>(key: K): ThemeTokens[K] => {
  const { tokens } = useTheme();
  return tokens[key];
};
