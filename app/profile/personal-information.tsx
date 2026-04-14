import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrokerUploadedFilesCard } from '@/components/profile/broker-uploaded-files-card';
import { EditFieldSheet } from '@/components/profile/edit-field-sheet';
import { PersonalInfoRow } from '@/components/profile/personal-info-row';
import { PROFILE_CARD_SHADOW } from '@/components/profile/profile-card-tokens';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import {
  useIndividualBrokerProfile,
  useUpdateUsualUser,
  useUserProfile,
} from '@/hooks/api/use-profile';
import { AuthScope } from '@/lib/api/auth';
import {
  buildPersonalInfoEditSheetProps,
  buildPersonalInformationRows,
  type PersonalInfoEditableField,
} from '@/lib/profile/personal-information-helpers';

type EditingField = PersonalInfoEditableField | null;

const NEUTRAL_900 = '#1B1B1B';
const NEUTRAL_950 = '#111111';
const MAIN_500 = '#087443';

export default function PersonalInformationScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userInfo } = useAuth();
  const [editingField, setEditingField] = useState<EditingField>(null);

  const isBroker = userInfo?.scope === AuthScope.BROKER;
  const isBrokerCompany = userInfo?.scope === AuthScope.BROKER_COMPANY;

  const { data: brokerProfile, isLoading: brokerLoading } = useIndividualBrokerProfile(
    isBroker ? userInfo?.id : undefined
  );
  const { data: userProfile } = useUserProfile(
    !isBroker && !isBrokerCompany ? userInfo?.id : undefined
  );
  const { mutateAsync: updateUser } = useUpdateUsualUser();
  const editingFieldRef = useRef<EditingField>(null);

  const onEditField = useCallback((field: PersonalInfoEditableField) => {
    editingFieldRef.current = field;
    setEditingField(field);
  }, []);

  const handleSave = useCallback(
    async (value: string) => {
      const field = editingFieldRef.current;
      if (!field || !userInfo?.id) return;

      try {
        // PUT replaces the full resource — always send all current fields
        // with the edited one overridden
        const currentData = {
          fullName: userInfo.fullName || '',
          phone: userInfo.phone || '',
        };
        const payload = { ...currentData, [field]: value };
        await updateUser({ id: userInfo.id, data: payload });
        setEditingField(null);
      } catch {
        Alert.alert(
          t('common.error', 'Error'),
          t('profile.update_failed', 'Failed to update profile.')
        );
      }
    },
    [userInfo, updateUser, t]
  );

  const handleUploadedFilesEdit = useCallback(() => {
    // Wire when upload / document API is available
  }, []);

  const rows = useMemo(
    () =>
      buildPersonalInformationRows(
        t,
        userInfo,
        brokerProfile,
        isBroker,
        isBrokerCompany,
        onEditField,
        userProfile?.dateOfBirth
      ),
    [t, userInfo, brokerProfile, isBroker, isBrokerCompany, onEditField, userProfile?.dateOfBirth]
  );

  const editSheetProps = useMemo(
    () =>
      buildPersonalInfoEditSheetProps(
        editingField,
        t,
        userInfo,
        isBroker,
        brokerProfile?.phoneNumber,
        userProfile?.dateOfBirth
      ),
    [editingField, t, userInfo, isBroker, brokerProfile?.phoneNumber, userProfile?.dateOfBirth]
  );

  const showBrokerPersonalLayout = Boolean(isBroker && brokerProfile);

  if (brokerLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={MAIN_500} />
        </View>
      </SafeAreaView>
    );
  }

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
        contentContainerStyle={[
          styles.scrollContent,
          showBrokerPersonalLayout && styles.scrollContentBroker,
        ]}>
        <View style={styles.card}>
          {rows.map((row, index) => (
            <PersonalInfoRow
              key={row.key}
              label={row.label}
              value={row.value}
              onPress={row.onPress}
              showDivider={index < rows.length - 1}
            />
          ))}
        </View>

        {showBrokerPersonalLayout ? (
          <BrokerUploadedFilesCard files={[]} onEditPress={handleUploadedFilesEdit} />
        ) : null}
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
  scrollContentBroker: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
    ...PROFILE_CARD_SHADOW,
  },
});
