import type { BrokerCardProps, BrokerCardStat } from '@/components/announcement/broker-card';
import type { IndividualBroker, BrokerCompany } from '@/types/applications';

const PLACEHOLDER_STATS: BrokerCardStat[] = [
  { value: '538', label: 'sales last 12months' },
  { value: '5248', label: 'sales in 12 Chicago' },
];

export function mapIndividualBrokerToCardProps(
  broker: IndividualBroker
): Omit<BrokerCardProps, 'onPress' | 'isSelected' | 'className'> {
  return {
    name: broker.fullName,
    avatar: broker.avatarInfo?.thumbnailUrl ?? broker.avatarInfo?.url,
    rating: 5.0,
    reviewCount: 1024,
    stats: PLACEHOLDER_STATS,
  };
}

export function mapBrokerCompanyToCardProps(
  broker: BrokerCompany
): Omit<BrokerCardProps, 'onPress' | 'isSelected' | 'className'> {
  return {
    name: broker.name,
    avatar: broker.avatarInfo?.thumbnailUrl ?? broker.avatarInfo?.url,
    rating: 5.0,
    reviewCount: 1024,
    stats: PLACEHOLDER_STATS,
  };
}
