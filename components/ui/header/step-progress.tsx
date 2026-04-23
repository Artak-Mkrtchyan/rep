import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

const STEP_COLORS = {
  completedBg: '#087443',
  completedFg: '#FFFFFF',
  currentBg: '#FFFFFF',
  currentFg: '#111111',
  currentBorder: '#087443',
  incompleteBg: '#FFFFFF',
  incompleteFg: '#111111',
  incompleteBorder: '#FFFFFF',
  connectorDone: '#087443',
  connectorLine: '#FFFFFF',
  containerBg: '#F1F1F1',
  labelMain: '#1B1B1B',
  labelSub: '#474747',
} as const;

export type StepProgressProps = {
  totalSteps?: number;
  completedStep: number;
  label?: string;
  containerClassName?: string;
};

// Split "Property info (1/2)" / "Property info(1/2)" / "Media (1/2)" into
// the main label and the parenthesised sub-step suffix so they can be
// styled independently (semibold dark + regular dimmer).
const splitStepLabel = (label: string): { main: string; suffix: string | null } => {
  const match = label.match(/^(.*?)(\s*\([^()]*\))\s*$/);
  if (!match) {
    return { main: label, suffix: null };
  }
  return { main: match[1].trim(), suffix: match[2].trim() };
};

export const StepProgress: React.FC<StepProgressProps> = ({
  totalSteps = 7,
  completedStep,
  label,
  containerClassName,
}) => {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('announcement.steps.list');
  const { main, suffix } = splitStepLabel(resolvedLabel);

  return (
    <View
      className={`rounded-[16px] p-[16px] ${containerClassName ?? ''}`}
      style={{ backgroundColor: STEP_COLORS.containerBg }}>
      <View className="flex-row items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepIndex = i + 1;
          const isCompleted = stepIndex < completedStep;
          const isCurrent = stepIndex === completedStep;
          const isLast = i === totalSteps - 1;

          return (
            <React.Fragment key={stepIndex}>
              <View
                className="h-5 w-5 items-center justify-center rounded-full"
                style={{
                  backgroundColor: isCompleted
                    ? STEP_COLORS.completedBg
                    : isCurrent
                      ? STEP_COLORS.currentBg
                      : STEP_COLORS.incompleteBg,
                  borderWidth: isCurrent ? 1.5 : 0,
                  borderColor: isCurrent ? STEP_COLORS.currentBorder : 'transparent',
                }}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={12} color={STEP_COLORS.completedFg} />
                ) : (
                  <Text
                    allowFontScaling={false}
                    style={{
                      width: 20,
                      height: 20,
                      color: isCurrent ? STEP_COLORS.currentFg : STEP_COLORS.incompleteFg,
                      fontSize: isCurrent ? 14 : 12,
                      lineHeight: 20,
                      fontWeight: '500',
                      includeFontPadding: false,
                      textAlignVertical: 'center',
                      textAlign: 'center',
                    }}>
                    {stepIndex}
                  </Text>
                )}
              </View>
              {!isLast && (
                <View
                  className="mx-0.5 h-[4px] min-w-[8px] flex-1 rounded-[33px]"
                  style={{
                    backgroundColor:
                      stepIndex < completedStep
                        ? STEP_COLORS.connectorDone
                        : STEP_COLORS.connectorLine,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      <View className="mt-[6px] flex-row items-baseline">
        <ThemedText
          numberOfLines={1}
          style={{
            color: STEP_COLORS.labelMain,
            fontSize: 12,
            fontWeight: '600',
            includeFontPadding: false,
          }}>
          {main}
        </ThemedText>
        {suffix ? (
          <ThemedText
            numberOfLines={1}
            style={{
              color: STEP_COLORS.labelSub,
              fontSize: 12,
              fontWeight: '400',
              includeFontPadding: false,
            }}>
            {suffix}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
};
