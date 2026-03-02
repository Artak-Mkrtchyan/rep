import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

type SocialIconName = 'logo-facebook' | 'logo-instagram' | 'logo-youtube';

export interface SocialLinkItem {
  id: string;
  icon: SocialIconName;
  onPress: () => void;
  accessibilityLabel: string;
}

export interface ProfileSocialLinksProps {
  links: SocialLinkItem[];
}

export const ProfileSocialLinks: React.FC<ProfileSocialLinksProps> = ({ links }) => {
  return (
    <View className="flex-row items-center justify-center gap-4 py-4">
      {links.map((link) => (
        <Pressable
          key={link.id}
          onPress={link.onPress}
          className="h-11 w-11 items-center justify-center rounded-full border border-border bg-card"
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
          accessibilityRole="button"
          accessibilityLabel={link.accessibilityLabel}>
          <Ionicons name={link.icon} size={22} color="#111111" />
        </Pressable>
      ))}
    </View>
  );
};
