import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ProfileEditIcon } from '@/components/icons/profile-edit-icon';
import { ThemedText } from '@/components/themed-text';

/** Figma `3766:83399` — profile row + `3766:83177` edit control */
const AVATAR_SIZE = 78;
const AVATAR_PLACEHOLDER_BG = '#D9D9D9';
const EDIT_BADGE_SIZE = 32;
/** Figma edit badge `left-[52px] top-[52px]` in 78×78 frame → RN `bottom` extends 6px past circle. */
const EDIT_BADGE_LEFT = 52;
const EDIT_BADGE_BOTTOM = -6;
const EDIT_BADGE_RADIUS = 18;
/** Figma Main/500 — edit badge border */
const PRIMARY_BORDER = '#087443';
/** Figma neutral/950 — icon/edit stroke */
const NEUTRAL_950 = '#111111';
const EDIT_ICON_SIZE = 16;
/** Figma `stile/card` shadow */
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  avatarStack: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    position: 'relative',
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: AVATAR_PLACEHOLDER_BG,
  },
  /** Solid `View` so white fill + green ring always paint (Pressable often skips them). */
  editBadge: {
    position: 'absolute',
    width: EDIT_BADGE_SIZE,
    height: EDIT_BADGE_SIZE,
    left: EDIT_BADGE_LEFT,
    bottom: EDIT_BADGE_BOTTOM,
    borderRadius: EDIT_BADGE_RADIUS,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: PRIMARY_BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  editIconSlot: {
    width: EDIT_ICON_SIZE,
    height: EDIT_ICON_SIZE,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  avatarPlaceholderInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUri?: string;
  onEditPress: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  avatarUri,
  onEditPress,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View style={styles.avatarStack}>
        <View style={styles.avatarCircle}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              contentFit="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholderInner}>
              <Ionicons name="person" size={40} color="#919191" />
            </View>
          )}
        </View>

        <View style={styles.editBadge} collapsable={false}>
          <View pointerEvents="none" style={styles.editIconSlot}>
            <ProfileEditIcon
              width={EDIT_ICON_SIZE}
              height={EDIT_ICON_SIZE}
              color={NEUTRAL_950}
            />
          </View>
          <Pressable
            onPress={onEditPress}
            style={StyleSheet.absoluteFillObject}
            android_ripple={{ color: 'rgba(8, 116, 67, 0.12)' }}
            accessibilityRole="button"
            accessibilityLabel={t('profile.edit_profile')}
          />
        </View>
      </View>

      <View style={styles.textBlock}>
        <ThemedText className="text-[20px] font-bold leading-6 text-[#111111]">{name}</ThemedText>
        <ThemedText className="text-[16px] font-normal leading-6 text-[#777777]">{email}</ThemedText>
      </View>
    </View>
  );
};
