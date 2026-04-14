import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StyleSheet, View } from 'react-native';

/** Matches `expo-splash-screen` plugin in app.json */
const SPLASH_BACKGROUND = '#ffffff';
const SPLASH_LOGO_WIDTH = 200;

/**
 * Hide native splash only after the logo has decoded and the next frame has painted,
 * so we never flash an empty or half-drawn view. Keep the logo square here so it
 * matches the generated native splash (rounded PNG would “pop” after hide).
 */
export function InitialLoadingScreen() {
  const didHideSplash = React.useRef(false);

  const hideSplashWhenReady = React.useCallback(() => {
    if (didHideSplash.current) return;
    didHideSplash.current = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void SplashScreen.hideAsync();
      });
    });
  }, []);

  return (
    <View style={styles.root}>
      <Image
        source={require('@/assets/images/icon.png')}
        style={styles.logo}
        contentFit="contain"
        transition={0}
        cachePolicy="memory-disk"
        onLoadEnd={hideSplashWhenReady}
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
    backgroundColor: SPLASH_BACKGROUND,
  },
});
