import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeValue } from '@/hooks/use-theme';

export interface ProfileMenuItemProps {
  label: string;
  icon: React.ReactElement;
  onPress: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
  showDivider?: boolean;
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  label,
  icon,
  onPress,
  showChevron = true,
  isDestructive = false,
  showDivider = true,
}) => {
  const mutedForeground = useThemeValue('mutedForeground');
  const destructiveColor = useThemeValue('destructive');

  return (
    <>
      <Pressable
        onPress={onPress}
        className="flex-row items-center px-4 py-[14px]"
        style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
        accessibilityRole="button"
        accessibilityLabel={label}>
        <View className="mr-3 h-[22px] w-[22px] items-center justify-center">{icon}</View>

        <ThemedText
          className={`flex-1 text-[15px] font-normal ${isDestructive ? '' : 'text-foreground'}`}
          style={isDestructive ? { color: destructiveColor } : undefined}>
          {label}
        </ThemedText>

        {showChevron && <Ionicons name="chevron-forward" size={18} color={mutedForeground} />}
      </Pressable>

      {showDivider && <View className="ml-[54px] h-px" />}
    </>
  );
};
