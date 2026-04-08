import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type ZoomControlsProps = {
  top: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export const ZoomControls: React.FC<ZoomControlsProps> = ({ top, onZoomIn, onZoomOut }) => (
  <View style={[styles.container, { top }]}>
    <Pressable onPress={onZoomIn} style={styles.button}>
      <Ionicons name="add" size={22} color="#333" />
    </Pressable>
    <Pressable onPress={onZoomOut} style={styles.button}>
      <Ionicons name="remove" size={22} color="#333" />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    gap: 8,
    zIndex: 5,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
