import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Форматирует числовую строку в формат с разделителями тысяч (запятая) и десятичной точкой
 * Использует встроенный toLocaleString
 *
 * @param value - Число в строковом типе
 * @returns Отформатированная строка
 */
export function formatNumericString(value: string): string {
  if (!value || value.trim() === '') {
    return value;
  }

  const trimmedValue = value.trim();

  const num = parseFloat(trimmedValue);
  if (isNaN(num)) {
    return trimmedValue;
  }

  const parts = trimmedValue.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  const isNegative = integerPart.startsWith('-');
  let absIntegerPart = isNegative ? integerPart.substring(1) : integerPart;

  // Добавляем разделители тысяч (каждые 3 цифры справа)
  absIntegerPart = absIntegerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const formattedInteger = isNegative ? '-' + absIntegerPart : absIntegerPart;

  if (decimalPart !== '') {
    return `${formattedInteger}.${decimalPart}`;
  }

  return formattedInteger;
}
