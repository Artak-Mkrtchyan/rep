import type { GeoDetailsDto, LangFormDTO } from '@/types/announcement';
import type { Language } from '@/lib/i18n/i18n';

const LOCALE_MAP: Record<Language, string> = {
  en: 'en-GB',
  ru: 'ru-RU',
  uz: 'uz-UZ',
};

const resolveLocale = (lang: string | undefined): string =>
  LOCALE_MAP[lang as Language] ?? LOCALE_MAP.en;

/** `dd.MM.yyyy HH:mm`, locale-aware. */
export const formatDateTime = (iso: string | undefined, lang: string | undefined): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const datePart = date.toLocaleDateString(resolveLocale(lang), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString(resolveLocale(lang), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${datePart} ${timePart}`;
};

/** `HH:mm:ss`, used for feedback timestamps. */
export const formatTimeWithSeconds = (iso: string | undefined): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

/** Range like `dd.MM.yyyy HH:mm — HH:mm` (or full second date if it differs). */
export const formatDateTimeRange = (
  minIso: string | undefined,
  maxIso: string | undefined,
  lang: string | undefined
): string => {
  if (!minIso) return '';
  if (!maxIso || minIso === maxIso) return formatDateTime(minIso, lang);

  const min = new Date(minIso);
  const max = new Date(maxIso);
  if (Number.isNaN(min.getTime()) || Number.isNaN(max.getTime())) return '';

  const sameDay =
    min.getFullYear() === max.getFullYear() &&
    min.getMonth() === max.getMonth() &&
    min.getDate() === max.getDate();

  if (sameDay) {
    const start = formatDateTime(minIso, lang);
    const end = max.toLocaleTimeString(resolveLocale(lang), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${start} — ${end}`;
  }

  return `${formatDateTime(minIso, lang)} — ${formatDateTime(maxIso, lang)}`;
};

/** Pick the localized field of a multi-language DTO with fallbacks. */
export const localized = (
  field: LangFormDTO | undefined,
  lang: string | undefined
): string => {
  if (!field) return '';
  const code = (lang as Language) ?? 'en';
  return (field[code] || field.en || field.ru || field.uz || '').trim();
};

/** Pretty address string for a booking, falling back to `formattedAddress` parts. */
export const formatAddress = (geo: GeoDetailsDto | undefined, lang: string | undefined): string => {
  if (!geo) return '';
  const formatted = localized(geo.formattedAddress, lang);
  if (formatted) return formatted;
  const parts = [
    localized(geo.street, lang),
    localized(geo.locality, lang),
    localized(geo.province, lang),
    localized(geo.country, lang),
  ].filter(Boolean);
  return parts.join(', ');
};

/** Format file size in human-readable units (bytes/KB/MB/GB). */
export const formatFileSize = (bytes: number, units: [string, string, string, string]): string => {
  if (!bytes || bytes <= 0) return `0 ${units[0]}`;
  const k = 1024;
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
};
