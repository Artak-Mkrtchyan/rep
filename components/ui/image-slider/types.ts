import type { ImageSourcePropType } from 'react-native';

export type ImageSliderImage = ImageSourcePropType;

export type ImageSliderProps = {
  /** Image sources: { uri: string } or require() number. When empty, shows a single "No image" slide. */
  images: ImageSliderImage[];

  /** Container class name. */
  className?: string;
  /** Accessibility label for the slider. */
  accessibilityLabel?: string;
};
