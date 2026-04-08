import React from 'react';
import { StyleSheet, View } from 'react-native';

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
    <View className="mx-4 mb-3" style={sectionStyles.card}>
      {items.map((item) => (
        <ProfileMenuItem
          key={item.id}
          label={item.label}
          icon={item.icon}
          onPress={item.onPress}
          showChevron={item.showChevron ?? true}
          isDestructive={item.isDestructive ?? false}
        />
      ))}
    </View>
  );
};

const sectionStyles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    backgroundColor: '#FFFFFF',
    /** Figma `2060:73630` — `gap-[2px]` between rows, no row dividers */
    gap: 2,
    overflow: 'hidden',
    shadowColor: '#6E6E6E',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 33,
    elevation: 4,
  },
});
