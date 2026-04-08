import { Platform } from 'react-native';

/** Figma `stile/card` — shared by profile info / uploaded-files cards */
export const PROFILE_CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: '#6E6E6E',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 33,
  },
  android: { elevation: 4 },
  default: {},
});
