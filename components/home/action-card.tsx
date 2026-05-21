import { Image } from 'expo-image';
import React from 'react';
import { type ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';

type ActionCardProps = {
  title: string;
  description: string;
  buttonText: string;
  image: ImageSourcePropType;
  onPress: () => void;
};

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  buttonText,
  image,
  onPress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} contentFit="contain" />
      </View>

      <View style={styles.textContainer}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {title}
        </ThemedText>
        <ThemedText style={styles.description} numberOfLines={3}>
          {description}
        </ThemedText>
      </View>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        accessibilityRole="button"
        accessibilityLabel={buttonText}>
        <ThemedText style={styles.buttonText}>{buttonText}</ThemedText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: HOME_DESIGN.white,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: HOME_DESIGN.neutral950,
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: HOME_DESIGN.neutral500,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: HOME_DESIGN.main500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: 'rgba(8, 116, 67, 0.05)',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: HOME_DESIGN.main500,
  },
});
