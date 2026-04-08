import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import {
  ProfileSocialFacebookGlyph,
  ProfileSocialInstagramGlyph,
  ProfileSocialYoutubeGlyph,
} from '@/components/profile/profile-social-glyphs';

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

/** Figma `10562:111133` — Social media */
const BUTTON_SIZE = 42;
const BUTTON_RADIUS = 20;
const GAP = 16;
const PAD_INSET = 16;
const NEUTRAL_50 = '#F1F1F1';

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

function SocialGlyph({ icon }: { icon: SocialIconName }) {
  switch (icon) {
    case 'logo-facebook':
      return <ProfileSocialFacebookGlyph />;
    case 'logo-instagram':
      return <ProfileSocialInstagramGlyph />;
    case 'logo-youtube':
      return <ProfileSocialYoutubeGlyph />;
  }
}

export const ProfileSocialLinks: React.FC<ProfileSocialLinksProps> = ({ links }) => {
  return (
    <View style={styles.row}>
      {links.map((link) => (
        <View key={link.id} style={styles.buttonWrap} collapsable={false}>
          <View style={styles.buttonFace} pointerEvents="none">
            <SocialGlyph icon={link.icon} />
          </View>
          <Pressable
            onPress={link.onPress}
            style={({ pressed }) => [styles.hit, pressed && { opacity: 0.75 }]}
            accessibilityRole="button"
            accessibilityLabel={link.accessibilityLabel}
            android_ripple={{ color: 'rgba(8, 116, 67, 0.12)' }}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: GAP,
    paddingHorizontal: PAD_INSET,
    paddingTop: 16,
    paddingBottom: 16,
  },
  buttonWrap: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    position: 'relative',
  },
  buttonFace: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: NEUTRAL_50,
    borderWidth: 1,
    borderColor: NEUTRAL_50,
    justifyContent: 'center',
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  hit: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BUTTON_RADIUS,
  },
});
