export function formatDistance(distance?: string) {
  if (!distance) return null;

  const meters = Number(distance);
  if (!Number.isFinite(meters)) return distance;

  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function buildPlaceDetailHref(place: {
  id: string;
  placeName: string;
  x: string;
  y: string;
  distance?: string;
}) {
  const params = new URLSearchParams({
    name: place.placeName,
    x: place.x,
    y: place.y,
  });
  if (place.distance) {
    params.set("distance", place.distance);
  }
  return `/place/${place.id}?${params.toString()}`;
}
