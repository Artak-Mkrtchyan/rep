import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';

import { affordabilityStyles as styles } from './affordability-calculator-section.styles';

const ILLUSTRATION = require('@/assets/images/affordability-calculator-house.png');

type AffordabilityCalculatorSectionProps = {
  onSubmit?: () => void;
};

export const AffordabilityCalculatorSection: React.FC<AffordabilityCalculatorSectionProps> = ({
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [annualIncome, setAnnualIncome] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [monthlyDebt, setMonthlyDebt] = useState('');

  const handleCta = useCallback(() => {
    onSubmit?.();
  }, [onSubmit]);

  return (
    <View style={styles.section}>
      <View>
        <ThemedText className="text-[20px] font-bold leading-6 text-foreground">
          {t('home.affordability_calculator_title')}
        </ThemedText>
        <ThemedText className="mt-1 text-[12px] leading-[13px] text-foreground">
          {t('home.affordability_calculator_subtitle')}
        </ThemedText>
      </View>

      <View style={styles.illustrationFrame}>
        <Image
          source={ILLUSTRATION}
          style={styles.illustration}
          contentFit="contain"
          accessibilityLabel={t('home.affordability_illustration_a11y')}
        />
      </View>

      <View style={styles.formCard}>
        <ThemedText className="text-[20px] font-bold leading-6 text-foreground">
          {t('home.find_homes_budget_title')}
        </ThemedText>
        <ThemedText className="mt-1 max-w-[276px] text-[12px] text-foreground">
          {t('home.find_homes_budget_subtitle')}
        </ThemedText>

        <View className="mt-4 gap-3">
          <LabeledField label={t('home.field_location')}>
            <Pressable style={styles.inputRow} accessibilityRole="button">
              <ThemedText className="text-[16px]" style={{ color: HOME_DESIGN.neutral300 }}>
                {t('home.select_sale')}
              </ThemedText>
              <Ionicons name="chevron-down" size={20} color={HOME_DESIGN.neutral950} />
            </Pressable>
          </LabeledField>

          <LabeledField label={t('home.field_credit_score')}>
            <Pressable style={styles.inputRow} accessibilityRole="button">
              <ThemedText className="flex-1 text-[16px] text-foreground" />
              <Ionicons name="chevron-down" size={20} color={HOME_DESIGN.neutral950} />
            </Pressable>
          </LabeledField>

          <LabeledField
            label={t('home.field_annual_income')}
            rightSlot={
              <Ionicons
                name="information-circle-outline"
                size={12}
                color={HOME_DESIGN.orange500}
              />
            }>
            <View style={styles.inputRow}>
              <ThemedText className="text-[16px]" style={{ color: HOME_DESIGN.neutral300 }}>
                $
              </ThemedText>
              <TextInput
                value={annualIncome}
                onChangeText={setAnnualIncome}
                keyboardType="decimal-pad"
                placeholderTextColor={HOME_DESIGN.neutral300}
                className="min-h-[24px] flex-1 text-[16px]"
                style={{ color: HOME_DESIGN.neutral950 }}
                placeholder=""
              />
              <ThemedText className="text-[16px]" style={{ color: HOME_DESIGN.neutral200 }}>
                {t('home.per_year')}
              </ThemedText>
            </View>
          </LabeledField>

          <LabeledField label={t('home.field_down_payment')}>
            <View style={styles.inputRow}>
              <ThemedText className="text-[16px]" style={{ color: HOME_DESIGN.neutral300 }}>
                $
              </ThemedText>
              <TextInput
                value={downPayment}
                onChangeText={setDownPayment}
                keyboardType="decimal-pad"
                placeholderTextColor={HOME_DESIGN.neutral300}
                className="min-h-[24px] flex-1 text-[16px]"
                style={{ color: HOME_DESIGN.neutral950 }}
                placeholder=""
              />
              <Ionicons name="chevron-down" size={20} color={HOME_DESIGN.neutral950} />
            </View>
          </LabeledField>

          <LabeledField
            label={t('home.field_monthly_debt')}
            rightSlot={
              <Ionicons
                name="information-circle-outline"
                size={12}
                color={HOME_DESIGN.orange500}
              />
            }>
            <View style={styles.inputRow}>
              <ThemedText className="text-[16px]" style={{ color: HOME_DESIGN.neutral300 }}>
                $
              </ThemedText>
              <TextInput
                value={monthlyDebt}
                onChangeText={setMonthlyDebt}
                keyboardType="decimal-pad"
                placeholderTextColor={HOME_DESIGN.neutral300}
                className="min-h-[24px] flex-1 text-[16px]"
                style={{ color: HOME_DESIGN.neutral950 }}
                placeholder=""
              />
              <ThemedText className="text-[16px]" style={{ color: HOME_DESIGN.neutral200 }}>
                {t('home.per_month')}
              </ThemedText>
            </View>
          </LabeledField>

          <ThemedText className="text-[12px] leading-4" style={{ color: HOME_DESIGN.neutral300 }}>
            {t('home.monthly_debt_hint')}
          </ThemedText>
        </View>

        <Pressable
          onPress={handleCta}
          style={styles.cta}
          accessibilityRole="button"
          accessibilityLabel={t('home.cta_lets_get_started')}>
          <ThemedText className="text-[16px] font-medium text-white">
            {t('home.cta_lets_get_started')}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
};

type LabeledFieldProps = {
  label: string;
  children: ReactNode;
  rightSlot?: ReactNode;
};

const LabeledField: React.FC<LabeledFieldProps> = ({ label, children, rightSlot }) => (
  <View className="gap-1">
    <View className="flex-row items-center gap-1">
      <ThemedText className="text-[12px] font-bold text-foreground">{label}</ThemedText>
      {rightSlot}
    </View>
    {children}
  </View>
);
