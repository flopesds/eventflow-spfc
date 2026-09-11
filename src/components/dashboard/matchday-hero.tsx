import Link from "next/link";
import { MockEvent } from "@/lib/mock-data";
import { formatDate, getEventTypeBadge, getStatusBadge } from "@/lib/utils";
import { 
  MapPin, 
  Calendar, 
  CheckSquare, 
  ArrowRight, 
  Sparkles,
  ShieldAlert
} from "lucide-react";

interface MatchdayHeroProps {
  event: MockEvent;
}

export function MatchdayHero({ event }: MatchdayHeroProps) {
  const typeBadge = getEventTypeBadge(event.type);
  const statusBadge = getStatusBadge(event.status);

  const totalTasks = event.checklistItems.length;
  const completedTasks = event.checklistItems.filter((i) => i.status === "CONCLUIDO").length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const delayedTasks = event.checklistItems.filter((i) => i.status === "ATRASADO").length;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50/70 via-white to-slate-50 dark:from-[#170a0c] dark:via-[#12151c] dark:to-[#0c0f14] border border-red-200 dark:border-[#d3151b]/30 p-6 sm:p-8 shadow-md dark:shadow-xl transition-colors">
      {/* Background stadium subtle glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-400/10 dark:bg-[#d3151b]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d3151b] text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Operação em Destaque
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeBadge.className}`}>
              {typeBadge.label}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusBadge.className}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
              {statusBadge.label}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {event.name}
          </h2>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-slate-600 dark:text-zinc-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#d3151b]" />
              <span>{formatDate(event.date, "EEEE, dd 'de' MMMM 'às' HH:mm")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
              <span>{event.venue}</span>
            </div>
            {event.sponsor && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 dark:text-zinc-500 font-medium">Patrocínio:</span>
                <span className="font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20 text-xs">
                  {event.sponsor.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right card: Operational checklist progress */}
        <div className="bg-white/90 dark:bg-[#0b0d11]/80 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-xl p-5 min-w-[280px] lg:max-w-xs space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                Checklist Operacional
              </span>
              <span className="text-slate-900 dark:text-white font-mono">{taskProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${taskProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-zinc-500">
              <span>{completedTasks} de {totalTasks} itens concluídos</span>
              {delayedTasks > 0 && (
                <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-0.5">
                  <ShieldAlert className="w-3 h-3" />
                  {delayedTasks} em atraso
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/events/${event.id}`}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-[#d3151b] dark:bg-zinc-800 dark:hover:bg-[#d3151b] text-white py-2.5 px-4 rounded-lg text-xs font-bold transition-all group shadow-sm"
          >
            <span>Gerenciar Matchday</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
