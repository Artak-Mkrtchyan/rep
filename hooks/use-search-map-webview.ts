import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { WebView, WebViewMessageEvent } from 'react-native-webview';

import { getWebBaseUrl } from '@/constants/env';
import type { Announcement } from '@/types/api';

const DEFAULT_CENTER: [number, number] = [69.32375, 41.290231];
const DEFAULT_ZOOM = 14;

export type UseSearchMapWebViewOptions = {
  /** Fit camera to all markers (fullscreen results map); default follows first marker only */
  fitBoundsToMarkers?: boolean;
  /** Embed posts `{ type: 'markerClick', id: publicId }` from the map */
  onMarkerPress?: (publicId: string) => void;
  /** Initial center for the embed URL so the map starts at the right location */
  initialCenter?: [number, number];
};

function buildMarkers(announcements: Announcement[]) {
  return announcements
    .filter((a) => a.geo?.latitude != null && a.geo?.longitude != null)
    .map((a) => ({
      id: a.id,
      publicId: a.publicId,
      coordinates: [a.geo.longitude!, a.geo.latitude!] as [number, number],
      status: a.status?.code ?? 'ACTIVE',
    }));
}

function boundsFromMarkerCoordinates(
  coords: [number, number][]
): [[number, number], [number, number]] | null {
  if (coords.length === 0) return null;
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of coords) {
    minLng = Math.min(minLng, lng);
    minLat = Math.min(minLat, lat);
    maxLng = Math.max(maxLng, lng);
    maxLat = Math.max(maxLat, lat);
  }
  if (minLng === maxLng && minLat === maxLat) {
    const pad = 0.02;
    return [
      [minLng - pad, minLat - pad],
      [maxLng + pad, maxLat + pad],
    ];
  }
  const padLng = (maxLng - minLng) * 0.08 || 0.02;
  const padLat = (maxLat - minLat) * 0.08 || 0.02;
  return [
    [minLng - padLng, minLat - padLat],
    [maxLng + padLng, maxLat + padLat],
  ];
}

export function useSearchMapWebView(
  announcements: Announcement[],
  options?: UseSearchMapWebViewOptions
) {
  const { i18n } = useTranslation();
  const fitBoundsToMarkers = options?.fitBoundsToMarkers ?? false;
  const onMarkerPress = options?.onMarkerPress;
  const optionsCenter = options?.initialCenter;
  const webViewRef = useRef<WebView>(null);
  const hasCenteredRef = useRef(false);
  const announcementsSignatureRef = useRef<string>('');
  const mapReadyRef = useRef(false);
  const pendingMessagesRef = useRef<Record<string, unknown>[]>([]);

  const locale = i18n.language || 'ru';
  const center = optionsCenter ?? DEFAULT_CENTER;
  const embedUrl = `${getWebBaseUrl()}/${locale}/embed/map?ll=${center[0]},${center[1]}&zoom=${DEFAULT_ZOOM}`;

  const sendMessage = useCallback((msg: Record<string, unknown>) => {
    webViewRef.current?.injectJavaScript(`
      window.dispatchEvent(new MessageEvent('message', {
        data: JSON.stringify(${JSON.stringify(msg)})
      }));
      true;
    `);
  }, []);

  const sendOrQueue = useCallback(
    (msg: Record<string, unknown>) => {
      if (mapReadyRef.current) {
        sendMessage(msg);
      } else {
        pendingMessagesRef.current.push(msg);
      }
    },
    [sendMessage]
  );

  const flushPendingMessages = useCallback(() => {
    const pending = pendingMessagesRef.current;
    pendingMessagesRef.current = [];
    for (const msg of pending) {
      sendMessage(msg);
    }
  }, [sendMessage]);

  const zoomIn = useCallback(() => {
    sendMessage({ type: 'zoom', direction: 'in' });
  }, [sendMessage]);

  const zoomOut = useCallback(() => {
    sendMessage({ type: 'zoom', direction: 'out' });
  }, [sendMessage]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data) as {
          type?: string;
          id?: string;
        };

        if (data.type === 'mapReady') {
          mapReadyRef.current = true;
          flushPendingMessages();
          return;
        }

        if (data.type === 'markerClick' && data.id != null && data.id !== '') {
          onMarkerPress?.(data.id);
        }
      } catch {
        /* ignore non-JSON messages from the map */
      }
    },
    [onMarkerPress, flushPendingMessages]
  );

  const resetCenter = useCallback(() => {
    hasCenteredRef.current = false;
    announcementsSignatureRef.current = '';
    pendingMessagesRef.current = [];
  }, []);

  const setCenter = useCallback(
    (lng: number, lat: number, zoom = DEFAULT_ZOOM) => {
      hasCenteredRef.current = true;
      sendOrQueue({ type: 'setCenter', center: [lng, lat], zoom });
    },
    [sendOrQueue]
  );

  // When announcements change, send markers and center/fit the map
  useEffect(() => {
    if (!webViewRef.current) return;

    const markers = buildMarkers(announcements);
    const signature = announcements.map((a) => a.id).join(',');

    sendOrQueue({ type: 'setMarkers', markers });

    if (markers.length === 0) {
      if (fitBoundsToMarkers) {
        announcementsSignatureRef.current = '';
      }
      return;
    }

    if (fitBoundsToMarkers) {
      if (signature === announcementsSignatureRef.current) return;
      announcementsSignatureRef.current = signature;
      const bounds = boundsFromMarkerCoordinates(markers.map((m) => m.coordinates));
      if (bounds) {
        sendOrQueue({ type: 'setBounds', bounds });
      }
      return;
    }

    // Center on first marker when hasCenteredRef is false (initial load or after resetCenter)
    if (!hasCenteredRef.current) {
      hasCenteredRef.current = true;
      const [lng, lat] = markers[0].coordinates;
      sendOrQueue({ type: 'setCenter', center: [lng, lat], zoom: DEFAULT_ZOOM });
    }
  }, [announcements, sendOrQueue, fitBoundsToMarkers]);

  return {
    webViewRef,
    embedUrl,
    zoomIn,
    zoomOut,
    handleMessage,
    resetCenter,
    setCenter,
  };
}
