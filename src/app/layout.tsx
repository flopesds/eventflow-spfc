import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { SpfcCrest } from "@/components/spfc-crest";

export const metadata: Metadata = {
  title: "EventFlow SPFC | Gestão de Eventos e Matchday",
  description: "Sistema de gestão de eventos, ativações de patrocinadores, cronogramas operacionais e comprovação de matchday do São Paulo FC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('eventflow_theme');
                if (storedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              } catch (_) {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090b0e] text-slate-900 dark:text-zinc-100 selection:bg-[#d3151b] selection:text-white antialiased transition-colors">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 dark:border-[#1f2633] bg-white dark:bg-[#0c0f14] py-6 mt-12 text-center text-xs text-slate-500 dark:text-zinc-500 transition-colors">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <SpfcCrest className="w-4 h-4" />
              <span className="font-medium text-slate-700 dark:text-zinc-400">EventFlow SPFC</span>
              <span>•</span>
              <span>Gestão Operacional de Matchday & MorumBIS</span>
            </div>
            <p className="text-slate-500 dark:text-zinc-500">
              Trilha de Portfólio de Gestão Esportiva (SponsorHub • FanMetrics • EventFlow)
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
