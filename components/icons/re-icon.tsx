import React from 'react';
import { Text, type TextStyle } from 'react-native';

/**
 * Glyph map for the re-icons custom icon font.
 * Add entries as needed from pics-web/packages/ui/src/styles/icons/icons.css
 */
const GLYPH_MAP: Record<string, string> = {
  settings: '\ue095',
};

type ReIconProps = {
  name: keyof typeof GLYPH_MAP;
  size?: number;
  color?: string;
  style?: TextStyle;
};

export const ReIcon: React.FC<ReIconProps> = ({ name, size = 24, color = '#111111', style }) => (
  <Text
    style={[{ fontFamily: 're-icons', fontSize: size, color }, style]}
    allowFontScaling={false}>
    {GLYPH_MAP[name]}
  </Text>
);
