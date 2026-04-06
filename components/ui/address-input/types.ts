import { InfrastructureObject } from '@/lib/api/infrastructure';
import { GeoDetailsDto } from '@/types/announcement';

import type { TextInputProps } from 'react-native';
export type AddressInputProps = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'onFocus' | 'onBlur'
> & {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  error?: string;
  containerClassName?: string;
  /** Called when user selects a suggestion (address string and optional coords if we add geocode later) */
  onSelectAddress?: (geo: {
    address: GeoDetailsDto;
    infrastructureObjects?: InfrastructureObject[];
  }) => void;
  /** Language for suggestions (e.g. en_US, ru_RU). */
  lang?: string;
};
