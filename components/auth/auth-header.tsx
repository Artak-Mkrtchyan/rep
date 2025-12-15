import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface AuthHeaderProps {
  title: string;
  imageSource: any;
  imageWidth: number;
  imageHeight: number;
  description?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  imageSource,
  imageWidth,
  imageHeight,
  description,
}) => {
  return (
    <View className="items-center gap-4">
      <Image
        style={{ width: imageWidth, height: imageHeight }}
        source={imageSource}
        contentFit="contain"
      />
      <ThemedText type="title" className="text-center">
        {title}
      </ThemedText>
      {description ? (
        <ThemedText className="text-center text-muted-foreground">{description}</ThemedText>
      ) : null}
    </View>
  );
};
