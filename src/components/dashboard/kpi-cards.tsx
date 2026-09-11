import { MockEvent } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { 
  CalendarCheck, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2 
} from "lucide-react";

interface KpiCardsProps {
  events: MockEvent[];
}

export function KpiCards({ events }: KpiCardsProps) {
  // 1. Total de eventos
  const totalEvents = events.length;
  const completedEvents = events.filter((e) => e.status === "CONCLUIDO").length;

  // 2. Checklist items calculation
  const allChecklistItems = events.flatMap((e) => e.checklistItems);
  const totalChecklist = allChecklistItems.length;
  const delayedChecklist = allChecklistItems.filter((i) => i.status === "ATRASADO").length;
  const completedChecklist = allChecklistItems.filter((i) => i.status === "CONCLUIDO").length;

  // On-time execution rate = items concluded on time / total evaluated items
  const onTimeRate = totalChecklist > 0
    ? Math.round(((totalChecklist - delayedChecklist) / totalChecklist) * 100)
    : 100;

  // 3. Financial calculations
  const totalEstimated = events.reduce((acc, e) => acc + (e.budgetEstimated || 0), 0);
  const totalReal = events.reduce((acc, e) => acc + (e.budgetReal || 0), 0);
  const budgetVariance = totalEstimated > 0 ? ((totalReal - totalEstimated) / totalEstimated) * 100 : 0;
  const isBudgetUnder = totalReal <= totalEstimated;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Eventos */}
      <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Eventos no Período
          </span>
          <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center text-[#d3151b]">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{totalEvents}</span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completedEvents} realizados
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400 dark:text-zinc-500">
          Jogos, ativações de marcas e eventos de torcida
        </p>
      </div>

      {/* Taxa de Execução no Prazo */}
      <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Execução no Prazo
          </span>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{onTimeRate}%</span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            {completedChecklist}/{totalChecklist} entregues
          </span>
        </div>
        <div className="mt-3 w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${onTimeRate}%` }}
          />
        </div>
      </div>

      {/* Custo Total vs Orçado */}
      <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Custo Executado
          </span>
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalReal)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-400 dark:text-zinc-500">Orçado: {formatCurrency(totalEstimated)}</span>
          <span
            className={`font-semibold flex items-center gap-0.5 ${
              isBudgetUnder ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {isBudgetUnder ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {Math.abs(budgetVariance).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Alertas Críticos em Atraso */}
      <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Itens em Atraso
          </span>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            delayedChecklist > 0
              ? "bg-red-500/20 border border-red-500/40 text-red-500 animate-pulse"
              : "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-400"
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className={`text-3xl font-bold tracking-tight ${
            delayedChecklist > 0 ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-zinc-300"
          }`}>
            {delayedChecklist}
          </span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            {delayedChecklist > 0 ? "Requer atenção imediata" : "Operação em dia"}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400 dark:text-zinc-500">
          Checklists com prazo expirado antes da abertura dos portões
        </p>
      </div>
    </div>
  );
}
