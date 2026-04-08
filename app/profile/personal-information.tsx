import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileEditIcon } from '@/components/icons/profile-edit-icon';
import { EditFieldSheet } from '@/components/profile/edit-field-sheet';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { AuthScope } from '@/lib/api/auth';
import { useIndividualBrokerProfile } from '@/hooks/api/use-profile';

type EditingField = 'fullName' | 'phone' | 'dateOfBirth' | null;

/** Figma `10562:114110` / `10582:115174` — Personal information */
const NEUTRAL_900 = '#1B1B1B';
const NEUTRAL_950 = '#111111';
const NEUTRAL_500 = '#777777';
const NEUTRAL_50 = '#F1F1F1';
const MAIN_500 = '#087443';
const EDIT_ICON = 20;
const EDIT_CHIP = 32;

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: '#6E6E6E',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 33,
  },
  android: { elevation: 4 },
  default: {},
});

/**
 * Formats a phone number like "+998901211323" to "+998 (90)121 13 23"
 */
function formatPhoneDisplay(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('998') && digits.length >= 12) {
    const local = digits.slice(3);
    return `+998 (${local.slice(0, 2)})${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`;
  }
  return phone;
}

type InfoRowProps = {
  label: string;
  value: string;
  onPress?: () => void;
  showDivider: boolean;
};

function InfoRow({ label, value, onPress, showDivider }: InfoRowProps) {
  const body = (
    <>
      <View style={styles.rowText}>
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
        <ThemedText style={styles.rowValue} numberOfLines={2}>
          {value || '—'}
        </ThemedText>
      </View>
      {onPress ? (
        <View style={styles.editChip} pointerEvents="none">
          <ProfileEditIcon width={EDIT_ICON} height={EDIT_ICON} color={MAIN_500} />
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
        accessibilityLabel={`${label}. ${value || '—'}`}>
        {body}
      </Pressable>
    );
  }

  return (
    <View
      style={[styles.row, showDivider && styles.rowDivider]}
      accessibilityLabel={`${label}. ${value || '—'}`}>
      {body}
    </View>
  );
}

type RowSpec = {
  key: string;
  label: string;
  value: string;
  onPress?: () => void;
};

export default function PersonalInformationScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userInfo } = useAuth();
  const [editingField, setEditingField] = useState<EditingField>(null);

  const isBroker = userInfo?.scope === AuthScope.BROKER;
  const isBrokerCompany = userInfo?.scope === AuthScope.BROKER_COMPANY;

  const { data: brokerProfile, isLoading: brokerLoading } = useIndividualBrokerProfile(
    isBroker ? userInfo?.id : undefined,
  );

  const handleSave = useCallback((_value: string) => {
    setEditingField(null);
  }, []);

  const rows: RowSpec[] = [];

  rows.push(
    {
      key: 'fullName',
      label: t('profile.full_name', 'Full name'),
      value: userInfo?.fullName || '',
      onPress: () => setEditingField('fullName'),
    },
    {
      key: 'email',
      label: t('profile.email', 'Email'),
      value: userInfo?.email || '',
    },
  );

  if (isBroker && brokerProfile) {
    rows.push(
      {
        key: 'certifiedBy',
        label: t('profile.certified_by', 'Certified by'),
        value: brokerProfile.certifiedBy || '',
      },
      {
        key: 'phone',
        label: t('profile.phone_number', 'Phone number'),
        value: formatPhoneDisplay(brokerProfile.phoneNumber || userInfo?.phone || ''),
        onPress: () => setEditingField('phone'),
      },
      {
        key: 'certifiedOn',
        label: t('profile.certified_on', 'Certified on'),
        value: brokerProfile.certifiedOn || '',
      },
      {
        key: 'years',
        label: t('profile.years_of_activity', 'Years of activity'),
        value: brokerProfile.yearsOfActivity?.toString() || '',
      },
    );
  } else if (!isBroker && !isBrokerCompany) {
    rows.push(
      {
        key: 'phone',
        label: t('profile.phone_number', 'Phone number'),
        value: formatPhoneDisplay(userInfo?.phone || ''),
        onPress: () => setEditingField('phone'),
      },
      {
        key: 'dob',
        label: t('profile.date_of_birth', 'Date of birth'),
        value: '',
        onPress: () => setEditingField('dateOfBirth'),
      },
    );
  }

  const getEditSheetProps = () => {
    switch (editingField) {
      case 'fullName':
        return {
          label: t('profile.full_name', 'Full name'),
          value: userInfo?.fullName || '',
          placeholder: t('profile.full_name', 'Full name'),
        };
      case 'phone':
        return {
          label: t('profile.phone_number', 'Phone number'),
          value:
            (isBroker && brokerProfile?.phoneNumber) || userInfo?.phone || '',
          type: 'phone' as const,
        };
      case 'dateOfBirth':
        return {
          label: t('profile.date_of_birth', 'Date of birth'),
          value: '',
          placeholder: 'DD/MM/YYYY',
        };
      default:
        return null;
    }
  };

  if (brokerLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={MAIN_500} />
        </View>
      </SafeAreaView>
    );
  }

  const editSheetProps = getEditSheetProps();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color={NEUTRAL_950} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>
          {t('profile.personal_info', 'Personal information')}
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {rows.map((row, index) => (
            <InfoRow
              key={row.key}
              label={row.label}
              value={row.value}
              onPress={row.onPress}
              showDivider={index < rows.length - 1}
            />
          ))}
        </View>
      </ScrollView>

      {editSheetProps && (
        <EditFieldSheet
          visible={editingField !== null}
          label={editSheetProps.label}
          value={editSheetProps.value}
          placeholder={editSheetProps.placeholder}
          type={editSheetProps.type}
          keyboardType={editSheetProps.keyboardType}
          onSave={handleSave}
          onClose={() => setEditingField(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    color: NEUTRAL_900,
  },
  headerSpacer: {
    width: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
    ...CARD_SHADOW,
  },
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
