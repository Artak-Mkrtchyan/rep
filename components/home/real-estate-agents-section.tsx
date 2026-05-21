import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AgentCard } from '@/components/home/agent-card';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';
import { SectionHeaderRow } from '@/components/home/section-header-row';
import { useHomeMetrics } from '@/hooks/use-home-metrics';
import { useHomeBrokers } from '@/hooks/api/use-home-partners';
import { PaginationIndicator } from '@/components/ui/pagination-indicator';

const styles = StyleSheet.create({
  section: {
    marginTop: HOME_DESIGN.layout.sectionGap,
    gap: HOME_DESIGN.layout.headerToCarousel,
  },
  header: {
    paddingHorizontal: HOME_DESIGN.layout.affordabilityPaddingH,
  },
  track: {
    backgroundColor: HOME_DESIGN.neutral50,
    paddingVertical: 16,
  },
  stripScroll: {
    backgroundColor: HOME_DESIGN.neutral50,
  },
  stripScrollContent: {
    backgroundColor: HOME_DESIGN.neutral50,
  },
});

type RealEstateAgentsSectionProps = {
  onSeeMorePress?: () => void;
  onCardPress?: () => void;
};

export const RealEstateAgentsSection: React.FC<RealEstateAgentsSectionProps> = ({
  onSeeMorePress,
  onCardPress,
}) => {
  const { t } = useTranslation();
  const metrics = useHomeMetrics();
  const { brokers } = useHomeBrokers();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / metrics.agentStride);
      setActiveIndex(Math.min(Math.max(index, 0), brokers.length - 1));
    },
    [metrics.agentStride, brokers.length]
  );

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionHeaderRow
          title={t('home.agents_title')}
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
          {brokers.map((broker, index) => (
              <View
                key={broker.id}
                style={{
                  width: metrics.agentCardWidth,
                  marginRight: index < brokers.length - 1 ? metrics.gap : 0,
                }}>
                <AgentCard
                  name={broker.fullName}
                  company={broker.email}
                  rating="5.0"
                  reviewCount=""
                  avatarUri={broker.avatarInfo?.thumbnailUrl || broker.avatarInfo?.url}
                  onPress={onCardPress}
                />
              </View>
            ))}
        </ScrollView>
      </View>

      <PaginationIndicator
        count={brokers.length}
        activeIndex={activeIndex}
        variant="inline"
        inlineMarginTop={HOME_DESIGN.layout.carouselToDots}
      />
    </View>
  );
};
