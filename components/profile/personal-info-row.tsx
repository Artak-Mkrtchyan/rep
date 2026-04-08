import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ProfileEditIcon } from '@/components/icons/profile-edit-icon';
import { ThemedText } from '@/components/themed-text';

const NEUTRAL_950 = '#111111';
const NEUTRAL_500 = '#777777';
const NEUTRAL_50 = '#F1F1F1';
const EDIT_ICON = 20;
const EDIT_CHIP = 32;

export type PersonalInfoRowProps = {
  label: string;
  value: string;
  onPress?: () => void;
  showDivider: boolean;
};

export function PersonalInfoRow({ label, value, onPress, showDivider }: PersonalInfoRowProps) {
  const display = value || '—';
  const body = (
    <>
      <View style={styles.rowText}>
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
        <ThemedText style={styles.rowValue} numberOfLines={2}>
          {display}
        </ThemedText>
      </View>
      {onPress ? (
        <View style={styles.editChip} pointerEvents="none">
          <ProfileEditIcon width={EDIT_ICON} height={EDIT_ICON} color={NEUTRAL_950} />
        </View>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.row, showDivider && styles.rowDivider]}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${display}`}>
        {body}
      </Pressable>
    );
  }

  return (
    <View style={[styles.row, showDivider && styles.rowDivider]} accessibilityLabel={`${label}. ${display}`}>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_50,
  },
  rowText: {
    flex: 1,
    gap: 4,
    marginRight: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: NEUTRAL_500,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: NEUTRAL_950,
  },
  editChip: {
    width: EDIT_CHIP,
    height: EDIT_CHIP,
    borderRadius: EDIT_CHIP / 2,
    backgroundColor: NEUTRAL_50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
