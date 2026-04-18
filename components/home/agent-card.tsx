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

export type AgentCardProps = {
  name: string;
  company: string;
  rating: string;
  reviewCount: string;
  avatarUri?: string;
  onPress?: () => void;
};

const AvatarWithFallback = ({ uri, name }: { uri?: string; name: string }) => {
  const [failed, setFailed] = useState(false);

  if (uri && uri.length > 0 && !failed) {
    return (
      <Image
        source={{ uri }}
        style={styles.avatarImage}
        contentFit="cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <View style={styles.initialsCircle}>
      <ThemedText style={styles.initialsText}>{getInitials(name)}</ThemedText>
    </View>
  );
};

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  company,
  rating,
  reviewCount,
  avatarUri,
  onPress,
}) => {
  const content = (
    <View
      className="w-full flex-row items-center gap-2 px-4 py-2"
      style={HOME_DESIGN.carouselStripCard}>
      <AvatarWithFallback uri={avatarUri} name={name} />
      <View className="min-w-0 flex-1 justify-center gap-1">
        <ThemedText className="text-[14px] font-semibold leading-[17px] text-foreground" numberOfLines={1}>
          {name}
        </ThemedText>
        <ThemedText className="text-[10px] leading-[11px] text-foreground" numberOfLines={1}>
          {company}
        </ThemedText>
        <View className="mt-0.5 flex-row items-center gap-1">
          <ThemedText className="text-[14px] font-medium text-foreground">{rating}</ThemedText>
          <Ionicons name="star" size={20} color={HOME_DESIGN.green500} />
          <ThemedText className="text-[14px] text-foreground">{reviewCount}</ThemedText>
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
  avatarImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  initialsCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#666666',
  },
});
