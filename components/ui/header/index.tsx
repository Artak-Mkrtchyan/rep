import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';

import type { StepProgressProps } from '@/components/ui/header/step-progress';
import { StepProgress } from '@/components/ui/header/step-progress';
import { cn } from '@/lib/utils';

type Props = {
  completedStep?: number;
  totalSteps?: number;
  headerTitle: string;
  label?: string;
  stepProgressContainerClassName?: string;
  isStepProgressVisible?: boolean;
  rightComponent?: React.ReactNode;
  onHandleBackPress?: () => void;
  headerClassName?: string;
};

export const Header: React.FC<Props> = ({
  completedStep = 1,
  totalSteps = 7,
  headerTitle,
  label,
  stepProgressContainerClassName,
  isStepProgressVisible = true,
  rightComponent = null,
  onHandleBackPress,
  headerClassName,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { horizontalStyle } = useScreenEdgePadding();
  const resolvedLabel = label ?? t('announcement.steps.list');

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
    label: resolvedLabel,
    containerClassName: stepProgressContainerClassName,
  };

  return (
    <View
      className={cn('bg-white', headerClassName)}
      style={[{ paddingTop: insets.top }, horizontalStyle]}>
      <View className="flex-row items-center">
        <View className="flex-1 items-center justify-center">
          <Pressable
            onPress={handleBackPress}
            className="absolute left-0 h-10 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={t('common.go_back')}>
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
