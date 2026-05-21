import React from 'react';
import { Text, TextStyle } from 'react-native';

const c = String.fromCharCode;

const ICON_GLYPHS: Record<string, string> = {
  info: c(0xe031),
  size: c(0xe022),
  bed: c(0xe020),
  bath: c(0xe021),
  condition: c(0xe080),
  'year-built': c(0xe04c),
  year: c(0xe054),
  'ownership-type': c(0xe061),
  'number-of-floors': c(0xe04b),
  parking: c(0xe04f),
  elevator: c(0xe050),
  balcony: c(0xe070),
  terrace: c(0xe083),
  garden: c(0xe07c),
  bicycle: c(0xe081),
  laundry: c(0xe07a),
  'disabled-access': c(0xe07f),
  'ev-charging-station': c(0xe085),
  'attached-garage': c(0xe082),
  'detached-garage': c(0xe07e),
  'house-area': c(0xe07d),
  'land-area': c(0xe0a4),
  'usable-area': c(0xe0a1),
  'space-size': c(0xe0a2),
  'ceiling-height': c(0xe084),
  'car-height': c(0xe09d),
  'car-length': c(0xe09e),
  motorcycle: c(0xe086),
  'remote-automatic-door': c(0xe087),
  '24-clock': c(0xe099),
  'gated-entry': c(0xe09a),
  'remote-control-access': c(0xe0a6),
  'security-cctv': c(0xe09b),
  'security-guard': c(0xe09c),
  cooling: c(0xe089),
  'cooling-heating': c(0xe04e),
  heating: c(0xe08b),
  ventilation: c(0xe092),
  'fire-safety-system': c(0xe08a),
  sprinkler: c(0xe091),
  'reception-concierge': c(0xe08e),
  'restrooms-count': c(0xe08f),
  'server-room': c(0xe090),
  kitchenette: c(0xe08d),
  wifi: c(0xe08c),
  electricity: c(0xe088),
  'water-supply': c(0xe0a9),
  gas: c(0xe09f),
  sewage: c(0xe0a7),
  'road-access': c(0xe0a8),
  'road-type': c(0xe0a0),
  'land-type': c(0xe0a3),
  'permitted-use': c(0xe0a5),
  cat: c(0xe06a),
  'large-dog': c(0xe069),
  'small-dog': c(0xe06b),
  'security-deposit': c(0xe068),
};

export type ReIconName = keyof typeof ICON_GLYPHS;

interface ReIconProps {
  name?: ReIconName | string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

export const ReIcon: React.FC<ReIconProps> = ({
  name,
  size = 20,
  color = '#737373',
  style,
}) => {
  const glyph = (name && ICON_GLYPHS[name]) || ICON_GLYPHS.info;
  return (
    <Text
      style={[
        { fontFamily: 're-icons', fontSize: size, lineHeight: size, color },
        style,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no">
      {glyph}
    </Text>
  );
};
