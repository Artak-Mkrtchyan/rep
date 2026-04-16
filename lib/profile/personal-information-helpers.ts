import type { TFunction } from 'i18next';

import type { UserInfo } from '@/context/AuthContext';
import type { IndividualBrokerProfile } from '@/lib/api/profile';

export type PersonalInfoEditableField =
  | 'fullName'
  | 'phone'
  | 'dateOfBirth'
  | 'certifiedBy'
  | 'certifiedOn'
  | 'yearsOfActivity'
  | 'bio';

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
  type?: 'text' | 'phone' | 'date' | 'textarea';
  keyboardType?: 'default' | 'phone-pad' | 'numeric';
  maxLength?: number;
  numberOfLines?: number;
};

/** Formats e.g. "2007-04-13" → "13.04.2007" */
export function formatDateDisplay(date: string | undefined): string {
  if (!date) return '';
  const [year, month, day] = date.slice(0, 10).split('-');
  if (year && month && day) {
    return `${day}.${month}.${year}`;
  }
  return date;
}

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
  dateOfBirth?: string,
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
        onPress: () => onEditField('certifiedBy'),
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
        value: formatDateDisplay(brokerProfile.certifiedOn),
        onPress: () => onEditField('certifiedOn'),
      },
      {
        key: 'years',
        label: t('profile.years_of_activity', 'Years of activity'),
        value: brokerProfile.yearsOfActivity?.toString() || '',
        onPress: () => onEditField('yearsOfActivity'),
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
        value: formatDateDisplay(dateOfBirth),
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
  brokerProfile: IndividualBrokerProfile | undefined,
  dateOfBirth?: string,
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
        value: (isBroker && brokerProfile?.phoneNumber) || userInfo?.phone || '',
        type: 'phone',
        keyboardType: 'phone-pad',
      };
    case 'dateOfBirth':
      return {
        label: t('profile.date_of_birth', 'Date of birth'),
        value: dateOfBirth?.slice(0, 10) || '',
        placeholder: 'DD.MM.YYYY',
        type: 'date',
        keyboardType: 'numeric',
      };
    case 'certifiedBy':
      return {
        label: t('profile.certified_by', 'Certified by'),
        value: brokerProfile?.certifiedBy || '',
        placeholder: t('profile.certified_by', 'Certified by'),
        keyboardType: 'default',
        maxLength: 100,
      };
    case 'certifiedOn':
      return {
        label: t('profile.certified_on', 'Certified on'),
        value: brokerProfile?.certifiedOn?.slice(0, 10) || '',
        placeholder: 'DD.MM.YYYY',
        type: 'date',
        keyboardType: 'numeric',
      };
    case 'yearsOfActivity':
      return {
        label: t('profile.years_of_activity', 'Years of activity'),
        value: brokerProfile?.yearsOfActivity?.toString() || '',
        placeholder: t('profile.years_of_activity', 'Years of activity'),
        keyboardType: 'numeric',
        maxLength: 3,
      };
    case 'bio':
      return {
        label: t('profile.about_us', 'About us'),
        value: brokerProfile?.bio || '',
        placeholder: t('profile.about_placeholder', 'Tell about yourself'),
        type: 'textarea',
        keyboardType: 'default',
        maxLength: 500,
        numberOfLines: 4,
      };
    default:
      return null;
  }
}
