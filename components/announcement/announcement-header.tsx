import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

import { cn } from '@/lib/utils';
import type { StepProgressProps } from './step-progress';
import { StepProgress } from './step-progress';

type Props = {
  completedStep?: number;
  totalSteps?: number;
  headerTitle?: string;
  label?: string;
  stepProgressContainerClassName?: string;
  isStepProgressVisible?: boolean;
  rightComponent?: React.ReactNode;
  onHandleBackPress?: () => void;
  headerClassName?: string;
};

export const AnnouncementHeader: React.FC<Props> = ({
  completedStep = 1,
  totalSteps = 7,
  headerTitle = 'Add announcement',
  label = 'List',
  stepProgressContainerClassName,
  isStepProgressVisible = true,
  rightComponent = null,
  onHandleBackPress,
  headerClassName,
}) => {
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onHandleBackPress) {
      onHandleBackPress();
    } else {
      router.back();
    }
  };

  const stepProgressProps: StepProgressProps = {
    completedStep,
    totalSteps,
    label,
    containerClassName: stepProgressContainerClassName,
  };

  return (
    <View
      className={cn('bg-white px-4', headerClassName)}
      style={{ paddingTop: insets.top, paddingBottom: 12 }}>
      <View className="flex-row items-center">
        <View className="flex-1 items-center justify-center">
          <Pressable
            onPress={handleBackPress}
            className="absolute left-0 h-10 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={24} color="#111111" />
          </Pressable>
          <ThemedText
            className="text-[17px] font-semibold leading-[22px] text-foreground"
            numberOfLines={1}>
            {headerTitle}
          </ThemedText>
          <View className="absolute right-0 h-10 items-center justify-center">
            {rightComponent}
          </View>
        </View>
      </View>

      {isStepProgressVisible ? (
        <View className="mt-[24px]">
          <StepProgress {...stepProgressProps} />
        </View>
      ) : null}
    </View>
  );
};
