import React from 'react';
import { View } from 'react-native';

import { ProfileMenuItem } from './profile-menu-item';

export interface ProfileMenuSectionItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  onPress: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
}

export interface ProfileMenuSectionProps {
  items: ProfileMenuSectionItem[];
}

export const ProfileMenuSection: React.FC<ProfileMenuSectionProps> = ({ items }) => {
  return (
    <View className="mx-5 mb-4 overflow-hidden rounded-2xl bg-card">
      {items.map((item, index) => (
        <ProfileMenuItem
          key={item.id}
          label={item.label}
          icon={item.icon}
          onPress={item.onPress}
          showChevron={item.showChevron ?? true}
          isDestructive={item.isDestructive ?? false}
          showDivider={index < items.length - 1}
        />
      ))}
    </View>
  );
};
