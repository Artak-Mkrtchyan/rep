import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

const STEP_COLORS = {
  completedBg: '#087443',
  completedFg: '#FFFFFF',
  incompleteBg: '#FFFFFF',
  incompleteFg: '#111111',
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
  label = 'List',
  containerClassName,
}) => {
  return (
    <View
      className={`rounded-[12px] px-[16px] py-[16px] ${containerClassName ?? ''}`}
      style={{ backgroundColor: STEP_COLORS.containerBg }}>
      <View className="flex-row items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepIndex = i + 1;
          const isCompleted = stepIndex <= completedStep;
          const isLast = i === totalSteps - 1;

          return (
            <React.Fragment key={stepIndex}>
              <View
                className="h-6 w-6 items-center justify-center rounded-full"
                style={{
                  backgroundColor: isCompleted ? STEP_COLORS.completedBg : STEP_COLORS.incompleteBg,
                  borderWidth: isCompleted ? 0 : 1,
                  borderColor: STEP_COLORS.connectorLine,
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
                    backgroundColor: isCompleted
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
          {label}
        </ThemedText>
      </View>
    </View>
  );
};
