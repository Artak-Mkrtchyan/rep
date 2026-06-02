import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { HOME_DESIGN } from '@/components/home/home-design-tokens';
import { ThemedText } from '@/components/themed-text';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';

const FOOTER_LINK_KEYS = [
  'home.footer_buy',
  'home.footer_rent',
  'home.footer_sell',
  'home.footer_get_mortgage',
  'home.footer_partners',
  'home.footer_about',
  'home.footer_help',
  'home.footer_terms',
  'home.footer_privacy',
  'home.footer_contact',
] as const;

const SOCIAL_LINKS = [
  { id: 'facebook', icon: 'logo-facebook' },
  { id: 'instagram', icon: 'logo-instagram' },
  { id: 'youtube', icon: 'logo-youtube' },
] as const;

export const HomeFooter: React.FC = () => {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();

  return (
    <View style={[styles.container, horizontalStyle]}>
      <View style={styles.brandBlock}>
        <ThemedText style={styles.description}>{t('home.footer_description')}</ThemedText>
      </View>

      <View style={styles.linksWrap}>
        {FOOTER_LINK_KEYS.map((key) => (
          <ThemedText key={key} style={styles.linkText}>
            {t(key)}
          </ThemedText>
        ))}
      </View>

      <View style={styles.bottomBlock}>
        <View style={styles.divider} />
        <View style={styles.bottomRow}>
          <ThemedText style={styles.copyright}>{t('home.footer_copyright')}</ThemedText>
          <View style={styles.socialRow}>
            {SOCIAL_LINKS.map((item) => (
              <View key={item.id} style={styles.socialButton}>
                <Ionicons name={item.icon} size={14} color={HOME_DESIGN.neutral950} />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
    marginTop: HOME_DESIGN.layout.sectionGap,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: HOME_DESIGN.beigeSection,
    borderTopWidth: 1,
    borderColor: HOME_DESIGN.neutral100,
  },
  brandBlock: {
    gap: 18,
  },
  description: {
    fontSize: 12,
    color: '#474747',
    lineHeight: 13,
    fontStyle: 'normal',
  },
  linksWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  linkText: {
    color: HOME_DESIGN.neutral950,
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'normal',
  },
  bottomBlock: {
    gap: 32,
  },
  divider: {
    height: 1,
    backgroundColor: HOME_DESIGN.white,
    width: '100%',
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  copyright: {
    fontSize: 12,
    color: HOME_DESIGN.neutral950,
    textAlign: 'center',
  },
  socialRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    alignItems: 'center',
    backgroundColor: HOME_DESIGN.white,
    borderRadius: 20,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  logoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 28,
  },
  logoMark: {
    height: 28,
    marginRight: 2,
    position: 'relative',
    width: 30,
  },
  logoRoof: {
    borderBottomWidth: 4,
    borderColor: '#13B86D',
    borderLeftWidth: 4,
    height: 18,
    left: 0,
    position: 'absolute',
    top: 6,
    transform: [{ rotate: '-45deg' }],
    width: 18,
  },
  logoHouse: {
    alignItems: 'center',
    backgroundColor: HOME_DESIGN.white,
    borderColor: HOME_DESIGN.neutral950,
    borderRadius: 9,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    left: 9,
    position: 'absolute',
    top: 4,
    width: 20,
  },
  logoWindowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    width: 8,
  },
  logoWindow: {
    backgroundColor: '#13B86D',
    height: 3,
    width: 3,
  },
  logoText: {
    color: '#1B1B1B',
    fontSize: 28,
    letterSpacing: -2,
    lineHeight: 30,
  },
});
