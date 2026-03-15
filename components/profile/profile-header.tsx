import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

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
    <View className="flex-row items-center gap-4 px-5 pb-6">
      <View className="relative">
        <View className="h-[72px] w-[72px] overflow-hidden rounded-full bg-neutral-200">
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={{ width: 72, height: 72 }}
              contentFit="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="person" size={36} color="#919191" />
            </View>
          )}
        </View>

        <Pressable
          onPress={onEditPress}
          className="absolute bottom-0 right-0 h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-white bg-primary"
          style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
          accessibilityRole="button"
          accessibilityLabel={t('profile.edit_profile')}>
          <Ionicons name="pencil" size={12} color="#ffffff" />
        </Pressable>
      </View>

      <View className="flex-1">
        <ThemedText className="text-[18px] font-semibold text-foreground">{name}</ThemedText>
        <ThemedText className="mt-0.5 text-[13px] text-muted-foreground">{email}</ThemedText>
      </View>
    </View>
  );
};
