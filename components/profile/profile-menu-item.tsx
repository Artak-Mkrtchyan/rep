import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeValue } from '@/hooks/use-theme';

/** Figma Profile — menu chevron secondary */
const CHEVRON_SIZE = 16;

export interface ProfileMenuItemProps {
  label: string;
  icon: React.ReactElement;
  onPress: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  label,
  icon,
  onPress,
  showChevron = true,
  isDestructive = false,
}) => {
  const mutedForeground = useThemeValue('mutedForeground');
  /** Figma Profile — Log out label #ff7070 */
  const destructiveLabel = '#FF7070';

  return (
    <Pressable
      onPress={onPress}
      className="min-h-[52px] flex-row items-center px-4 py-1.5"
      style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <View className="mr-3 h-6 w-6 items-center justify-center">{icon}</View>

      <ThemedText
        className={`flex-1 text-[14px] font-normal leading-5 ${isDestructive ? '' : 'text-[#111111]'}`}
        style={isDestructive ? { color: destructiveLabel } : undefined}>
        {label}
      </ThemedText>

      {showChevron && <Ionicons name="chevron-forward" size={CHEVRON_SIZE} color={mutedForeground} />}
    </Pressable>
  );
};
