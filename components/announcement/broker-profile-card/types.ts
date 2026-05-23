import type { ImageSourcePropType } from 'react-native';

export type BrokerProfileCardProps = {
  avatar?: ImageSourcePropType | string;
  name: string;
  phone: string;
  email: string;
  certifiedOn?: string;
  certifiedBy?: string;
  yearsOfActivity?: number;
  rating?: number;
  reviewCount?: number;
  className?: string;
};
