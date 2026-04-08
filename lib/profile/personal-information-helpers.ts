import type { TFunction } from 'i18next';

import type { UserInfo } from '@/context/AuthContext';
import type { IndividualBrokerProfile } from '@/lib/api/profile';

export type PersonalInfoEditableField = 'fullName' | 'phone' | 'dateOfBirth';

export type PersonalInfoRowSpec = {
  key: string;
  label: string;
  value: string;
  onPress?: () => void;
};

export type PersonalInfoEditSheetProps = {
  label: string;
  value: string;
  placeholder?: string;
  type?: 'text' | 'phone';
  keyboardType?: 'default' | 'phone-pad' | 'numeric';
};

/** Formats e.g. "+998901211323" → "+998 (90)121 13 23" */
export function formatPhoneDisplay(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('998') && digits.length >= 12) {
    const local = digits.slice(3);
    return `+998 (${local.slice(0, 2)})${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`;
  }
  return phone;
}

export function buildPersonalInformationRows(
  t: TFunction,
  userInfo: UserInfo | null,
  brokerProfile: IndividualBrokerProfile | undefined,
  isBroker: boolean,
  isBrokerCompany: boolean,
  onEditField: (field: PersonalInfoEditableField) => void,
): PersonalInfoRowSpec[] {
  const base: PersonalInfoRowSpec[] = [
    {
      key: 'fullName',
      label: t('profile.full_name', 'Full name'),
      value: userInfo?.fullName || '',
      onPress: () => onEditField('fullName'),
    },
    {
      key: 'email',
      label: t('profile.email', 'Email'),
      value: userInfo?.email || '',
    },
  ];

  if (isBroker && brokerProfile) {
    return [
      ...base,
      {
        key: 'certifiedBy',
        label: t('profile.certified_by', 'Certified by'),
        value: brokerProfile.certifiedBy || '',
      },
      {
        key: 'phone',
        label: t('profile.phone_number', 'Phone number'),
        value: formatPhoneDisplay(brokerProfile.phoneNumber || userInfo?.phone || ''),
        onPress: () => onEditField('phone'),
      },
      {
        key: 'certifiedOn',
        label: t('profile.certified_on', 'Certified on'),
        value: brokerProfile.certifiedOn || '',
      },
      {
        key: 'years',
        label: t('profile.years_of_activity', 'Years of activity'),
        value: brokerProfile.yearsOfActivity?.toString() || '',
      },
    ];
  }

  if (!isBroker && !isBrokerCompany) {
    return [
      ...base,
      {
        key: 'phone',
        label: t('profile.phone_number', 'Phone number'),
        value: formatPhoneDisplay(userInfo?.phone || ''),
        onPress: () => onEditField('phone'),
      },
      {
        key: 'dob',
        label: t('profile.date_of_birth', 'Date of birth'),
        value: '',
        onPress: () => onEditField('dateOfBirth'),
      },
    ];
  }

  return base;
}

export function buildPersonalInfoEditSheetProps(
  editingField: PersonalInfoEditableField | null,
  t: TFunction,
  userInfo: UserInfo | null,
  isBroker: boolean,
  brokerPhone: string | undefined,
): PersonalInfoEditSheetProps | null {
  switch (editingField) {
    case 'fullName':
      return {
        label: t('profile.full_name', 'Full name'),
        value: userInfo?.fullName || '',
        placeholder: t('profile.full_name', 'Full name'),
        keyboardType: 'default',
      };
    case 'phone':
      return {
        label: t('profile.phone_number', 'Phone number'),
        value: (isBroker && brokerPhone) || userInfo?.phone || '',
        type: 'phone',
        keyboardType: 'phone-pad',
      };
    case 'dateOfBirth':
      return {
        label: t('profile.date_of_birth', 'Date of birth'),
        value: '',
        placeholder: 'DD/MM/YYYY',
        keyboardType: 'numeric',
      };
    default:
      return null;
  }
}
