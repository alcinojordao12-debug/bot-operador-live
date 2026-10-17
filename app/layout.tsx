import type { Metadata } from 'next';
import { Press_Start_2P, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const sansFont = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HUMANO BOT — Escritório de IA & Crypto Trading',
  description: 'Escritório digital 3D realista estilo Wall Street & 2D com 30 agentes robôs, 8 robôs traders especializados, inteligência de mercado, gestão de risco e salas interativas.',
  openGraph: {
    title: 'HUMANO BOT — Escritório de IA & Crypto Trading',
    description: 'Escritório digital 3D e 2D com 30 agentes robôs e 8 robôs traders.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HUMANO BOT — Escritório de IA & Crypto Trading',
    description: 'Escritório digital 3D e 2D com 30 agentes robôs e 8 robôs traders.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning className={`${pixelFont.variable} ${sansFont.variable} ${monoFont.variable}`}>
      <head>
        {/* Polyfill to prevent 'Cannot set property fetch of #<Window> which has only a getter' from browser extensions */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var _f = window.fetch;
                  Object.defineProperty(window, 'fetch', {
                    get: function() { return _f; },
                    set: function(v) { _f = v; },
                    configurable: true,
                    enumerable: true
                  });
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-slate-950 text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950 min-h-screen">
        {children}
      </body>
    </html>
  );
}
