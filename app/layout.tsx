import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DCYFR Agents — AI Agent Marketplace',
  description: 'Browse, deploy, and chat with production-grade AI agents from the DCYFR workspace.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-violet-950 text-violet-50 min-h-screen flex flex-col`}>
        <header className="border-b border-violet-800/50 bg-violet-950/80 backdrop-blur-sm sticky top-0 z-50">
          <nav
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
            aria-label="Main navigation"
          >
            <Link href="/" className="flex items-center gap-2 text-violet-100 font-bold text-lg hover:text-white transition-colors">
              <span className="text-violet-400">⬡</span>
              <span>dcyfr<span className="text-violet-400">.bot</span></span>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="text-violet-300 hover:text-violet-100 transition-colors">Home</Link>
              <Link href="/agents" className="text-violet-300 hover:text-violet-100 transition-colors">Agents</Link>
              <Link href="/leaderboard" className="text-violet-300 hover:text-violet-100 transition-colors">Leaderboard</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-violet-800/50 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-violet-400">
            <p>&copy; 2026 DCYFR. All agents MIT licensed.</p>
            <p className="text-violet-400">dcyfr.bot — launching Q4 2026</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
