import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (username: string) => {
  const parts = username.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export function isExternalUrl(url: string): boolean {
  if (!url) return false

  try {
    const urlObj = new URL(url, window.location.origin)
    return urlObj.origin !== window.location.origin
  } catch {
    return false
  }
}

export function normalizeUrl(url: string): string {
  if (!url) return ""

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  if (url.startsWith("/")) {
    return url
  }

  return `/${url}`
}

export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const validParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`);

  return validParams.length > 0 ? `?${validParams.join('&')}` : '';
}
