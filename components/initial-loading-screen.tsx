import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StyleSheet, View } from 'react-native';

/** Matches `expo-splash-screen` plugin in app.json */
const SPLASH_BACKGROUND = '#ffffff';
const SPLASH_LOGO_WIDTH = 200;

/**
 * Hide native splash as soon as the React loading screen mounts so only one
 * logo is ever visible (no flicker between native splash icon and the
 * React-rendered rounded icon).
 */
export function InitialLoadingScreen() {
  React.useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <View style={styles.root}>
      <Image
        source={require('@/assets/images/icon.png')}
        style={styles.logo}
        contentFit="contain"
        transition={0}
        cachePolicy="memory-disk"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SPLASH_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: SPLASH_LOGO_WIDTH,
    height: SPLASH_LOGO_WIDTH,
    borderRadius: 44,
    backgroundColor: SPLASH_BACKGROUND,
  },
});
