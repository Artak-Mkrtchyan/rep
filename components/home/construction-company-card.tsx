import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export type ConstructionCompanyCardProps = {
  name: string;
  rating: string;
  logoUri?: string;
  onPress?: () => void;
};

const LogoWithFallback = ({ uri, name }: { uri?: string; name: string }) => {
  const [failed, setFailed] = useState(false);

  if (uri && uri.length > 0 && !failed) {
    return (
      <Image
        source={{ uri }}
        style={styles.logoImage}
        contentFit="cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <View style={styles.initialsBox}>
      <ThemedText style={styles.initialsText}>{getInitials(name)}</ThemedText>
    </View>
  );
};

export const ConstructionCompanyCard: React.FC<ConstructionCompanyCardProps> = ({
  name,
  rating,
  logoUri,
  onPress,
}) => {
  const content = (
    <View
      className="w-full flex-row items-center gap-2 px-4 py-2"
      style={HOME_DESIGN.carouselStripCard}>
      <View className="h-[62px] w-[62px] overflow-hidden rounded-xl">
        <LogoWithFallback uri={logoUri} name={name} />
      </View>
      <View className="min-w-0 flex-1 justify-center gap-1">
        <ThemedText className="text-[14px] font-semibold leading-[17px] text-foreground" numberOfLines={2}>
          {name}
        </ThemedText>
        <View className="flex-row items-center gap-1">
          <ThemedText className="text-[14px] text-foreground">{rating}</ThemedText>
          <Ionicons name="star" size={20} color={HOME_DESIGN.green500} />
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  logoImage: {
    width: 62,
    height: 62,
    borderRadius: 12,
  },
  initialsBox: {
    width: 62,
    height: 62,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  initialsText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#666666',
  },
});
