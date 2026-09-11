"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SpfcCrest } from "./spfc-crest";
import { ThemeToggle } from "./theme-toggle";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Layers, 
  Users, 
  PlusCircle, 
  Flame 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/events", label: "Eventos", icon: Layers },
    { href: "/calendar", label: "Calendário & Matchday", icon: CalendarDays },
    { href: "/vendors", label: "Fornecedores", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0c0f14]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#1f2633] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <SpfcCrest className="w-9 h-9 transition-transform group-hover:scale-105" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black tracking-tight text-slate-900 dark:text-white text-lg">
                    EVENT<span className="text-[#d3151b]">FLOW</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#d3151b]/15 text-[#d3151b] dark:text-[#f87171] border border-[#d3151b]/30">
                    SPFC OPS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 -mt-0.5 font-medium hidden sm:block">
                  MorumBIS Matchday & Activation Ops
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#d3151b]/10 dark:bg-[#d3151b]/15 text-[#d3151b] dark:text-white border border-[#d3151b]/30 font-semibold"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/40"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-[#d3151b]" : "text-slate-400 dark:text-zinc-400")} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Status badge, Theme Toggle & Quick Action */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="font-semibold">Próximo:</span>
              <span className="text-slate-700 dark:text-zinc-300">SPFC x Palmeiras</span>
            </div>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            <Link
              href="/events/new"
              className="flex items-center space-x-1.5 bg-[#d3151b] hover:bg-[#b01015] text-white px-3.5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-red-950/20 dark:shadow-red-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Evento</span>
            </Link>
          </div>
        </div>
      </div>
      {/* SPFC Tricolor Accent Line */}
      <div className="spfc-tricolor-line w-full" />
    </header>
  );
}
