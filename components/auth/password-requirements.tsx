import React from 'react';
import { Text, View } from 'react-native';

interface PasswordRequirementItemProps {
  label: string;
  isValid: boolean;
}

export const PasswordRequirementItem: React.FC<PasswordRequirementItemProps> = ({
  label,
  isValid,
}) => {
  return (
    <View className="flex-row items-center gap-2">
      <View className={`h-2.5 w-2.5 rounded-full ${isValid ? 'bg-primary' : 'bg-border'}`} />
      <Text className={`text-[12px] ${isValid ? 'text-foreground' : 'text-muted-foreground'}`}>
        {label}
      </Text>
    </View>
  );
};

interface PasswordRequirementsListProps {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
}

export const PasswordRequirementsList: React.FC<PasswordRequirementsListProps> = ({
  hasMinLength,
  hasUpperCase,
  hasNumber,
}) => {
  return (
    <View className="w-full rounded-[12px] border border-default bg-card px-3 py-2">
      <View className="w-full flex-row items-center justify-between">
        <PasswordRequirementItem label="8+ characters" isValid={hasMinLength} />
        <PasswordRequirementItem label="1 uppercase" isValid={hasUpperCase} />
        <PasswordRequirementItem label="1 number" isValid={hasNumber} />
      </View>
    </View>
  );
};
