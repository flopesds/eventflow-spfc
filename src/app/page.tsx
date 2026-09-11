import { getEvents } from "@/lib/data";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { MatchdayHero } from "@/components/dashboard/matchday-hero";
import { OperationalAlerts } from "@/components/dashboard/operational-alerts";
import { Database, Sparkles, PlusCircle } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Fresh matchday data

export default async function DashboardPage() {
  const events = await getEvents();

  // Find the most relevant featured event: currently in execution, or closest future event
  const featuredEvent =
    events.find((e) => e.status === "EM_EXECUCAO") ||
    events.find((e) => e.status === "PLANEJADO") ||
    events[0];

  const hasCustomDb = Boolean(process.env.DATABASE_URL);

  return (
    <div className="space-y-8">
      {/* Top Header & DB status indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Dashboard Executivo
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              Operações MorumBIS
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Planejamento, execução, custos de fornecedores e comprovação de ativações de matchday.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {hasCustomDb ? (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PostgreSQL Neon Conectado</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300" title="Aguardando DATABASE_URL do Neon para gravar no PostgreSQL em tempo real">
              <Database className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Modo Demonstração (Seed Pop Culture)</span>
            </div>
          )}

          <Link
            href="/events/new"
            className="flex items-center space-x-1.5 bg-[#d3151b] hover:bg-[#b01015] text-white px-3.5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-red-950/50 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Evento</span>
          </Link>
        </div>
      </div>

      {/* Featured Matchday Hero */}
      {featuredEvent && <MatchdayHero event={featuredEvent} />}

      {/* 4 Main Executive KPIs */}
      <KpiCards events={events} />

      {/* Charts Section: Budget comparison + Status Distribution */}
      <DashboardCharts events={events} />

      {/* Critical Operational Alerts + Upcoming Calendar preview */}
      <OperationalAlerts events={events} />
    </div>
  );
}
