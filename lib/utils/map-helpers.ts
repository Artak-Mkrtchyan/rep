import type { GeoRectangle } from '@/types/api';

/**
 * Converts WebView map bounds [[minLng, minLat], [maxLng, maxLat]] to API GeoRectangle.
 */
export function boundsToGeoRectangle(
  bounds: [[number, number], [number, number]],
): GeoRectangle {
  return {
    bottomLeftCornerLongitude: bounds[0][0],
    bottomLeftCornerLatitude: bounds[0][1],
    topRightCornerLongitude: bounds[1][0],
    topRightCornerLatitude: bounds[1][1],
  };
}

/**
 * Returns true if `inner` bounds are fully contained within `outer` bounds.
 */
export function isWithinBounds(inner: GeoRectangle, outer: GeoRectangle): boolean {
  return (
    inner.bottomLeftCornerLatitude >= outer.bottomLeftCornerLatitude &&
    inner.bottomLeftCornerLongitude >= outer.bottomLeftCornerLongitude &&
    inner.topRightCornerLatitude <= outer.topRightCornerLatitude &&
    inner.topRightCornerLongitude <= outer.topRightCornerLongitude
  );
}

/**
 * Returns the union of two GeoRectangles (smallest rectangle containing both).
 */
export function expandBounds(a: GeoRectangle | null, b: GeoRectangle): GeoRectangle {
  if (!a) return b;
  return {
    bottomLeftCornerLatitude: Math.min(a.bottomLeftCornerLatitude, b.bottomLeftCornerLatitude),
    bottomLeftCornerLongitude: Math.min(a.bottomLeftCornerLongitude, b.bottomLeftCornerLongitude),
    topRightCornerLatitude: Math.max(a.topRightCornerLatitude, b.topRightCornerLatitude),
    topRightCornerLongitude: Math.max(a.topRightCornerLongitude, b.topRightCornerLongitude),
  };
}
