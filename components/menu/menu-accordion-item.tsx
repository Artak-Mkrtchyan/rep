import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { THEME } from '@/lib/theme';

type MenuAccordionItemProps = {
  title: string;
  items: string[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemPress?: (item: string) => void;
  onTitlePress?: () => void;
};

export const MenuAccordionItem: React.FC<MenuAccordionItemProps> = ({
  title,
  items,
  isExpanded,
  onToggle,
  onItemPress,
  onTitlePress,
}) => {
  const rotation = useDerivedValue(() => withTiming(isExpanded ? 180 : 0, { duration: 250 }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View layout={LinearTransition.duration(250)}>
      <Pressable
        onPress={onTitlePress || onToggle}
        className="flex-row items-center justify-between border-b border-border px-4 py-4"
        accessibilityRole="button">
        <ThemedText
          className={`flex-1 text-[16px] font-medium ${isExpanded ? 'text-primary' : 'text-foreground'}`}>
          {title}
        </ThemedText>
        {items.length > 0 ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="h-10 w-10 items-center justify-center -mr-2 -my-2"
            accessibilityRole="button"
            accessibilityState={{ expanded: isExpanded }}>
            <Animated.View style={chevronStyle}>
              <Ionicons
                name="chevron-down"
                size={20}
                color={isExpanded ? THEME.light.primary : THEME.light.foreground}
              />
            </Animated.View>
          </Pressable>
        ) : null}
      </Pressable>

      {isExpanded && items.length > 0 && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(150)}
          className="px-8 pb-2">
          {items.map((item) => (
            <Pressable
              key={item}
              onPress={() => onItemPress?.(item)}
              className="py-3"
              accessibilityRole="button">
              <ThemedText className="text-[15px] text-foreground">{item}</ThemedText>
            </Pressable>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
};
