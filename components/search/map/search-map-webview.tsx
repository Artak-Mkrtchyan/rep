import React, { useCallback } from 'react';
import { Linking, Platform, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

type SearchMapWebViewProps = {
  webViewRef: React.RefObject<WebView | null>;
  embedUrl: string;
  onMessage: (event: WebViewMessageEvent) => void;
};

export const SearchMapWebView: React.FC<SearchMapWebViewProps> = ({
  webViewRef,
  embedUrl,
  onMessage,
}) => {
  const handleShouldStartLoadWithRequest = useCallback(
    (request: ShouldStartLoadRequest) => {
      if (!request.url) return true;

      const isInitialLoad = request.url === embedUrl;
      const isHttp = request.url.startsWith('http://') || request.url.startsWith('https://');
      const isAboutBlank = request.url === 'about:blank';

      if (isInitialLoad || isAboutBlank) return true;

      if (isHttp) {
        Linking.openURL(request.url).catch(() => {
          /* no-op */
        });
        return false;
      }

      Linking.openURL(request.url).catch(() => {
        /* no-op */
      });
      return false;
    },
    [embedUrl]
  );

  return (
    <View className="flex-1">
      <WebView
        ref={webViewRef}
        source={{ uri: embedUrl }}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        bounces={false}
        overScrollMode="never"
        originWhitelist={['*']}
        setSupportMultipleWindows={false}
        mixedContentMode="always"
        androidLayerType={Platform.OS === 'android' ? 'hardware' : undefined}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        style={{ flex: 1 }}
      />
    </View>
  );
};
