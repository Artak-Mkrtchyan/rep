import React from 'react';
import { View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

type SearchMapWebViewProps = {
  webViewRef: React.RefObject<WebView | null>;
  embedUrl: string;
  onMessage: (event: WebViewMessageEvent) => void;
};

export const SearchMapWebView: React.FC<SearchMapWebViewProps> = ({
  webViewRef,
  embedUrl,
  onMessage,
}) => (
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
      style={{ flex: 1 }}
    />
  </View>
);
