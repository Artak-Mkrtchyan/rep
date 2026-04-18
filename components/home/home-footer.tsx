import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';

export const HomeFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <ThemedText style={styles.description}>
        {t('home.footer_description')}
      </ThemedText>
      <ThemedText style={styles.copyright}>
        {t('home.footer_copyright')}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: HOME_DESIGN.layout.sectionGap,
    paddingHorizontal: HOME_DESIGN.layout.affordabilityPaddingH,
    paddingBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: HOME_DESIGN.neutral100,
    marginBottom: 20,
  },
  description: {
    fontSize: 13,
    color: HOME_DESIGN.neutral500,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  copyright: {
    fontSize: 12,
    color: HOME_DESIGN.neutral300,
    textAlign: 'center',
  },
});
