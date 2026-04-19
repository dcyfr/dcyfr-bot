import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Canonical className merge for dcyfr.io. Wrapper around clsx + tailwind-merge
 * so components imported from @dcyfr-labs registry can resolve `cn` at `@/lib/utils`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
