import { test, expect } from '@playwright/test';

/**
 * Visual regression baseline per
 * openspec/changes/archive/2026-04-18-dcyfr-skeleton-sites-scaffolding/spec.md#51-screenshot-baseline
 *
 * dcyfr.bot is the agent marketplace (Q4 2026 launch). Two views covered:
 * - `/` home (featured agents + hero + tagline)
 * - `/agents` full directory (primary marketplace surface)
 *
 * Both at desktop (1440×900) and mobile (375×812). Motion paused.
 * colorScheme:'dark' locks baselines to dark-mode render (bot site is
 * dark-default; matches Tailwind's violet-950 canvas).
 */

const VIEWPORTS = [
  { width: 1440, height: 900, name: 'desktop' },
  { width: 375, height: 812, name: 'mobile' },
] as const;

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/agents', name: 'agents' },
] as const;

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    test(`${route.name} @ ${vp.name}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      await expect(page).toHaveScreenshot(`${route.name}-${vp.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
        animations: 'disabled',
      });
    });
  }
}
