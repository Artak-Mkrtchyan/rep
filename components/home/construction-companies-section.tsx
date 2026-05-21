import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ConstructionCompanyCard } from '@/components/home/construction-company-card';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';
import { SectionHeaderRow } from '@/components/home/section-header-row';
import { useHomeMetrics } from '@/hooks/use-home-metrics';
import { useHomeConstructionCompanies } from '@/hooks/api/use-home-partners';
import { PaginationIndicator } from '@/components/ui/pagination-indicator';

const styles = StyleSheet.create({
  section: {
    marginTop: HOME_DESIGN.layout.sectionGap,
    gap: HOME_DESIGN.layout.headerToCarousel,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: HOME_DESIGN.layout.affordabilityPaddingH,
  },
  track: {
    backgroundColor: HOME_DESIGN.neutral50,
    paddingVertical: 24,
  },
  stripScroll: {
    backgroundColor: HOME_DESIGN.neutral50,
  },
  stripScrollContent: {
    backgroundColor: HOME_DESIGN.neutral50,
  },
});

type ConstructionCompaniesSectionProps = {
  onSeeMorePress?: () => void;
  onCardPress?: () => void;
};

export const ConstructionCompaniesSection: React.FC<ConstructionCompaniesSectionProps> = ({
  onSeeMorePress,
  onCardPress,
}) => {
  const { t } = useTranslation();
  const metrics = useHomeMetrics();
  const { companies } = useHomeConstructionCompanies();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / metrics.companyStride);
      setActiveIndex(Math.min(Math.max(index, 0), companies.length - 1));
    },
    [metrics.companyStride, companies.length]
  );

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionHeaderRow
          title={t('home.companies_title')}
          actionLabel={t('home.see_more')}
          onActionPress={onSeeMorePress}
        />
      </View>

      <View style={styles.track}>
        <ScrollView
          horizontal
          style={styles.stripScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.stripScrollContent,
            { paddingLeft: metrics.horizontalPad, paddingRight: metrics.horizontalPad },
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {companies.map((company, index) => (
              <View
                key={company.id}
                style={{
                  width: metrics.companyCardWidth,
                  marginRight: index < companies.length - 1 ? metrics.gap : 0,
                }}>
                <ConstructionCompanyCard
                  name={company.name}
                  rating="4.9"
                  logoUri={company.avatarInfo?.thumbnailUrl || company.avatarInfo?.url}
                  onPress={onCardPress}
                />
              </View>
            ))}
        </ScrollView>
      </View>

      <PaginationIndicator
        count={companies.length}
        activeIndex={activeIndex}
        variant="inline"
        inlineMarginTop={HOME_DESIGN.layout.carouselToDots}
      />
    </View>
  );
};
