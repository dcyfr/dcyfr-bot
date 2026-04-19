import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { PageShell, SiteNav, SiteFooter } from '@/components/chrome';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DCYFR Agents — AI Agent Marketplace',
    template: '%s | dcyfr.bot',
  },
  description:
    'Browse, deploy, and chat with production-grade AI agents from the DCYFR workspace.',
  metadataBase: new URL('https://dcyfr.bot'),
  openGraph: {
    siteName: 'dcyfr.bot',
    type: 'website',
    url: 'https://dcyfr.bot',
  },
};

const DcyfrBotLogo = (
  <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight">
    <span className="text-muted-foreground">⬡</span>
    <span>
      dcyfr<span className="text-muted-foreground">.bot</span>
    </span>
  </span>
);

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/agents', label: 'Agents' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

const FOOTER_COLUMNS = [
  {
    title: 'Agents',
    links: [
      { href: '/agents', label: 'Directory' },
      { href: '/leaderboard', label: 'Leaderboard' },
    ],
  },
  {
    title: 'Ecosystem',
    links: [
      { href: 'https://dcyfr.io', label: 'dcyfr.io', external: true },
      { href: 'https://github.com/dcyfr', label: 'GitHub', external: true },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} theme-dcyfr-bot`}
    >
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PageShell
            nav={<SiteNav logo={DcyfrBotLogo} links={NAV_LINKS} />}
            footer={
              <SiteFooter
                brand={{
                  name: 'dcyfr.bot',
                  tagline: 'AI Agent Marketplace',
                }}
                columns={FOOTER_COLUMNS}
                copyright="© 2026 DCYFR. All agents MIT licensed. — launching Q4 2026"
              />
            }
            padding="none"
            maxWidth="full"
          >
            {children}
          </PageShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
