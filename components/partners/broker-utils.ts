import type { BrokerCardProps } from '@/components/announcement/broker-card';
import type { IndividualBroker, BrokerCompany } from '@/types/applications';

export function mapIndividualBrokerToCardProps(
  broker: IndividualBroker
): Omit<BrokerCardProps, 'onPress' | 'isSelected' | 'className'> {
  return {
    name: broker.fullName,
    avatar: broker.avatarInfo?.thumbnailUrl ?? broker.avatarInfo?.url,
    phone: broker.phoneNumber,
    email: broker.email,
    certifiedOn: broker.certifiedOn,
    certifiedBy: broker.certifiedBy,
    yearsOfActivity: broker.yearsOfActivity,
  };
}

export function mapBrokerCompanyToCardProps(
  broker: BrokerCompany
): Omit<BrokerCardProps, 'onPress' | 'isSelected' | 'className'> {
  return {
    name: broker.name,
    avatar: broker.avatarInfo?.thumbnailUrl ?? broker.avatarInfo?.url,
    phone: broker.phoneNumber,
    email: broker.email,
    certifiedOn: broker.certifiedOn,
    certifiedBy: broker.certifiedBy,
    yearsOfActivity: broker.yearsOfActivity,
  };
}
