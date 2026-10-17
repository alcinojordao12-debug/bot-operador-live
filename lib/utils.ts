import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Deterministic number formatting across server (SSR) and client (hydration).
 * Always formats as 1,234.56 without locale-dependent comma/period flipping.
 */
export function formatUSD(value: number, minDecimals = 2, maxDecimals = 2): string {
  if (value === 0) return '0.00';
  if (value < 0.01) {
    return value.toFixed(Math.max(6, maxDecimals));
  }
  const parts = value.toFixed(minDecimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
