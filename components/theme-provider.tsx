'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Site-level theme provider for dcyfr.io.
 *
 * Wraps `next-themes` with `attribute="class"` so `.dark` toggles cleanly
 * alongside the site's permanent identity class (`theme-dcyfr-io` set on
 * <html> in app/layout.tsx). Default scheme: system (per identity doc).
 *
 * Phase 2 of openspec/changes/dcyfr-skeleton-sites-scaffolding.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
