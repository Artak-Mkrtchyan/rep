import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';

const ctaBg = require('@/assets/images/cta-bg-mobile.jpg');
const ctaIllustration = require('@/assets/images/cta-illustration-mobile.svg');

type GetRecommendationsCTAProps = {
  onPress: () => void;
};

export const GetRecommendationsCTA: React.FC<GetRecommendationsCTAProps> = ({ onPress }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <ImageBackground source={ctaBg} resizeMode="cover" style={styles.background}>
        <View style={styles.content}>
          <View style={styles.illustrationWrapper}>
            <Image
              source={ctaIllustration}
              style={styles.illustration}
              contentFit="contain"
            />
          </View>
          <ThemedText style={styles.title}>
            {t('home.cta_title')}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t('home.cta_subtitle')}
          </ThemedText>
          <Button onPress={onPress}>
            {t('home.cta_button')}
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: HOME_DESIGN.layout.sectionGap,
    overflow: 'hidden',
  },
  background: {
    width: '100%',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  illustrationWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  illustration: {
    width: 250,
    height: 180,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: HOME_DESIGN.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: HOME_DESIGN.white,
    lineHeight: 18,
    marginBottom: 16,
  },
});
