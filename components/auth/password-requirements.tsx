import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface PasswordRequirementItemProps {
  icon: string;
  label: string;
  isValid: boolean;
}

const PasswordRequirementItem: React.FC<PasswordRequirementItemProps> = ({
  icon,
  label,
  isValid,
}) => {
  return (
    <View className="items-center gap-1.5">
      <View
        className={`h-[26px] w-[26px] items-center justify-center rounded-full ${isValid ? 'bg-[#5EBC39]' : 'bg-muted'}`}>
        <ThemedText
          className={`text-[12px] font-medium ${isValid ? 'text-white' : 'text-muted-foreground'}`}
          numberOfLines={1}>
          {icon}
        </ThemedText>
      </View>
      <ThemedText className="text-[12px] text-muted-foreground" numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
};

export interface PasswordRequirementsListProps {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

export const PasswordRequirementsList: React.FC<PasswordRequirementsListProps> = ({
  hasMinLength,
  hasUpperCase,
  hasLowerCase,
  hasNumber,
  hasSymbol,
}) => {
  return (
    <View className="w-full flex-row flex-wrap items-start justify-between gap-4">
      <PasswordRequirementItem icon="A" label="uppercase" isValid={hasUpperCase} />
      <PasswordRequirementItem icon="a" label="lowercase" isValid={hasLowerCase} />
      <PasswordRequirementItem icon="123" label="number" isValid={hasNumber} />
      <PasswordRequirementItem icon="#&?" label="symbol" isValid={hasSymbol} />
      <PasswordRequirementItem icon="8+" label="8 characters" isValid={hasMinLength} />
    </View>
  );
};
