import type { BrokerCardProps } from '@/components/announcement/broker-card';
import type { IndividualBroker, BrokerCompany } from '@/types/applications';

export function mapIndividualBrokerToCardProps(
  broker: IndividualBroker
): Omit<BrokerCardProps, 'onPress' | 'isSelected' | 'className'> {
  return {
    name: broker.fullName,
    avatar: broker.avatarInfo?.thumbnailUrl ?? broker.avatarInfo?.url,
  };
}

export function mapBrokerCompanyToCardProps(
  broker: BrokerCompany
): Omit<BrokerCardProps, 'onPress' | 'isSelected' | 'className'> {
  return {
    name: broker.name,
    avatar: broker.avatarInfo?.thumbnailUrl ?? broker.avatarInfo?.url,
  };
}
