import type { LocationPreset } from "../api/types";

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("ko-KR").format(price)}원`;
}

export function formatDistance(meter?: number): string {
  if (meter === undefined || Number.isNaN(meter)) return "거리 계산 중";
  if (meter < 1000) return `${meter}m`;
  return `${(meter / 1000).toFixed(1)}km`;
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function toLocalDateTimeInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

export function normalizeLocalDateTime(value: string): string {
  if (!value) return value;
  return value.length === 16 ? `${value}:00` : value;
}

export function getDefaultStartTime(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(13, 0, 0, 0);
  return toLocalDateTimeInputValue(date);
}

export function getDefaultEndTime(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(14, 0, 0, 0);
  return toLocalDateTimeInputValue(date);
}

export function distanceMeter(
  from: Pick<LocationPreset, "latitude" | "longitude">,
  to: { latitude: number; longitude: number },
): number {
  const earthRadiusMeter = 6_371_000;
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);
  const latDiff = toRadians(to.latitude - from.latitude);
  const lngDiff = toRadians(to.longitude - from.longitude);
  const haversine =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(lngDiff / 2) *
      Math.sin(lngDiff / 2);
  const angularDistance =
    2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return Math.round(earthRadiusMeter * angularDistance);
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}
