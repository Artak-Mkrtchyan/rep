import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EditFieldSheet } from '@/components/profile/edit-field-sheet';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { AuthScope } from '@/lib/api/auth';
import { useIndividualBrokerProfile } from '@/hooks/api/use-profile';

type EditingField = 'fullName' | 'phone' | 'dateOfBirth' | null;

/**
 * Formats a phone number like "+998901211323" to "+998 (90)121 13 23"
 */
function formatPhoneDisplay(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  // Expect 12 digits: 998 + 9 digit number
  if (digits.startsWith('998') && digits.length >= 12) {
    const local = digits.slice(3);
    return `+998 (${local.slice(0, 2)})${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`;
  }
  return phone;
}

function InfoRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={styles.row}>
      <ThemedText className="text-[12px] text-[#777]">{label}</ThemedText>
      <View className="flex-row items-center justify-between">
        <ThemedText className="text-[16px] text-[#111]" numberOfLines={1}>
          {value || '—'}
        </ThemedText>
        {onPress && <Ionicons name="chevron-forward" size={18} color="#ABABAB" />}
      </View>
    </Pressable>
  );
}

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

  const handleSave = useCallback(
    (_value: string) => {
      // TODO: call profileService.updateUser() when API supports profile updates
      setEditingField(null);
    },
    [],
  );

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
          value: userInfo?.phone || '',
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
          <ActivityIndicator size="large" color="#087443" />
        </View>
      </SafeAreaView>
    );
  }

  const editSheetProps = getEditSheetProps();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </Pressable>
        <ThemedText className="text-[20px] font-semibold text-[#111]">
          {t('profile.personal_info', 'Personal information')}
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <InfoRow
          label={t('profile.full_name', 'Full name')}
          value={userInfo?.fullName || ''}
          onPress={() => setEditingField('fullName')}
        />

        <InfoRow
          label={t('profile.email', 'Email')}
          value={userInfo?.email || ''}
        />

        {isBroker && brokerProfile && (
          <>
            <InfoRow
              label={t('profile.certified_by', 'Certified by')}
              value={brokerProfile.certifiedBy || ''}
            />
            <InfoRow
              label={t('profile.phone_number', 'Phone number')}
              value={formatPhoneDisplay(brokerProfile.phoneNumber || userInfo?.phone || '')}
              onPress={() => setEditingField('phone')}
            />
            <InfoRow
              label={t('profile.certified_on', 'Certified on')}
              value={brokerProfile.certifiedOn || ''}
            />
            <InfoRow
              label={t('profile.years_of_activity', 'Years of activity')}
              value={brokerProfile.yearsOfActivity?.toString() || ''}
            />
          </>
        )}

        {!isBroker && !isBrokerCompany && (
          <>
            <InfoRow
              label={t('profile.phone_number', 'Phone number')}
              value={formatPhoneDisplay(userInfo?.phone || '')}
              onPress={() => setEditingField('phone')}
            />
            <InfoRow
              label={t('profile.date_of_birth', 'Date of birth')}
              value=""
              onPress={() => setEditingField('dateOfBirth')}
            />
          </>
        )}
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
    backgroundColor: '#fff',
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
  },
  content: {
    paddingHorizontal: 16,
  },
  row: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
    gap: 4,
  },
});
