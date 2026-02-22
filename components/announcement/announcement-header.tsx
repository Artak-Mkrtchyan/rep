import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { StepProgressProps } from './step-progress';
import { StepProgress } from './step-progress';

const HEADER_TITLE = 'Add announcement';

type Props = {
  completedStep?: number;
  totalSteps?: number;
  label?: string;
  stepProgressContainerClassName?: string;
};

export const AnnouncementHeader: React.FC<Props> = ({
  completedStep = 1,
  totalSteps = 7,
  label = 'List',
  stepProgressContainerClassName,
}) => {
  const insets = useSafeAreaInsets();
  const setCurrentStep = useAnnouncementForRentFormStore((s) => s.setCurrentStep);

  const handleBackPress = () => {
    if (completedStep === 1) {
      router.push('/(tabs)');
    } else {
      setCurrentStep(--completedStep);
    }
  };

  const stepProgressProps: StepProgressProps = {
    completedStep,
    totalSteps,
    label,
    containerClassName: stepProgressContainerClassName,
  };

  return (
    <View className="bg-white px-4" style={{ paddingTop: insets.top, paddingBottom: 12 }}>
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
            {HEADER_TITLE}
          </ThemedText>
        </View>
      </View>

      <View className="mt-[24px]">
        <StepProgress {...stepProgressProps} />
      </View>
    </View>
  );
};
