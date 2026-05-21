import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ProfileEditIcon } from '@/components/icons/profile-edit-icon';
import { PROFILE_CARD_SHADOW } from '@/components/profile/profile-card-tokens';
import { ThemedText } from '@/components/themed-text';

const NEUTRAL_50 = '#F1F1F1';
const NEUTRAL_500 = '#777777';
const NEUTRAL_950 = '#111111';
const EDIT_ICON = 20;
const EDIT_CHIP = 32;

export type BrokerAboutCardProps = {
  bio: string;
  onEditPress?: () => void;
};

export const BrokerAboutCard: React.FC<BrokerAboutCardProps> = ({ bio, onEditPress }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.sectionTitle}>
          {t('profile.about_us', 'About us')}
        </ThemedText>
        {onEditPress ? (
          <Pressable
            onPress={onEditPress}
            style={styles.editChip}
            accessibilityRole="button"
            accessibilityLabel={t('common.edit', 'Edit')}>
            <ProfileEditIcon width={EDIT_ICON} height={EDIT_ICON} color={NEUTRAL_950} />
          </Pressable>
        ) : null}
      </View>

      {bio ? (
        <ThemedText style={styles.bioText}>{bio}</ThemedText>
      ) : (
        <ThemedText style={styles.emptyHint}>
          {t('profile.about_empty', 'No description')}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...PROFILE_CARD_SHADOW,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
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
  bioText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: NEUTRAL_950,
  },
  emptyHint: {
    fontSize: 14,
    lineHeight: 20,
    color: NEUTRAL_500,
  },
});
