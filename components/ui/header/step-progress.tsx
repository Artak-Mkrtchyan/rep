import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

const STEP_COLORS = {
  completedBg: '#087443',
  completedFg: '#FFFFFF',
  currentBg: '#FFFFFF',
  currentFg: '#087443',
  currentBorder: '#087443',
  incompleteBg: '#FFFFFF',
  incompleteFg: '#111111',
  incompleteBorder: '#FFFFFF',
  connectorDone: '#087443',
  connectorLine: '#FFFFFF',
  containerBg: '#F1F1F1',
} as const;

export type StepProgressProps = {
  totalSteps?: number;
  completedStep: number;
  label?: string;
  containerClassName?: string;
};

export const StepProgress: React.FC<StepProgressProps> = ({
  totalSteps = 7,
  completedStep,
  label,
  containerClassName,
}) => {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('announcement.steps.list');
  return (
    <View
      className={`rounded-[12px] px-[16px] py-[16px] ${containerClassName ?? ''}`}
      style={{ backgroundColor: STEP_COLORS.containerBg }}>
      <View className="flex-row items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepIndex = i + 1;
          const isCompleted = stepIndex < completedStep;
          const isCurrent = stepIndex === completedStep;
          const isUpcoming = stepIndex > completedStep;
          const isLast = i === totalSteps - 1;

          return (
            <React.Fragment key={stepIndex}>
              <View
                className="h-6 w-6 items-center justify-center rounded-full"
                style={{
                  backgroundColor: isCompleted
                    ? STEP_COLORS.completedBg
                    : isCurrent
                      ? STEP_COLORS.currentBg
                      : STEP_COLORS.incompleteBg,
                  borderWidth: isCurrent || isUpcoming ? 1.5 : 0,
                  borderColor: isCurrent ? STEP_COLORS.currentBorder : STEP_COLORS.incompleteBorder,
                }}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color={STEP_COLORS.completedFg} />
                ) : (
                  <ThemedText
                    className="text-[12px] font-semibold"
                    style={{ color: STEP_COLORS.incompleteFg }}>
                    {stepIndex}
                  </ThemedText>
                )}
              </View>
              {!isLast && (
                <View
                  className="mx-0.5 h-[4px] min-w-[8px] flex-1 rounded-[33px]"
                  style={{
                    backgroundColor:
                      stepIndex < completedStep
                        ? STEP_COLORS.completedBg
                        : STEP_COLORS.incompleteBg,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
      <View className="mt-1 flex-row">
        <ThemedText className="text-[12px] font-medium text-foreground" numberOfLines={1}>
          {resolvedLabel}
        </ThemedText>
      </View>
    </View>
  );
};
