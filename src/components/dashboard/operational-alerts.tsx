import Link from "next/link";
import { MockEvent } from "@/lib/mock-data";
import { formatDate, getStatusBadge } from "@/lib/utils";
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle, 
  FileCheck, 
  Calendar 
} from "lucide-react";

interface OperationalAlertsProps {
  events: MockEvent[];
}

export function OperationalAlerts({ events }: OperationalAlertsProps) {
  // Extract all delayed checklist items with event context
  const delayedItems = events.flatMap((e) =>
    e.checklistItems
      .filter((item) => item.status === "ATRASADO")
      .map((item) => ({ ...item, eventName: e.name, eventId: e.id }))
  );

  // Extract pending proofs waiting for validation
  const pendingProofs = events.flatMap((e) =>
    e.proofs
      .filter((p) => p.status === "ENVIADO")
      .map((p) => ({ ...p, eventName: e.name, eventId: e.id }))
  );

  // Upcoming planned/in-execution events
  const upcomingEvents = events
    .filter((e) => e.status === "EM_EXECUCAO" || e.status === "PLANEJADO")
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Alertas Operacionais Críticos */}
      <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1f2633] mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-[#d3151b] dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ações Urgentes & Pendências
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
            {delayedItems.length + pendingProofs.length} pendências
          </span>
        </div>

        <div className="space-y-3">
          {delayedItems.length === 0 && pendingProofs.length === 0 ? (
            <div className="py-8 text-center text-slate-400 dark:text-zinc-500 text-xs">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
              Nenhuma pendência crítica ou atraso no momento!
            </div>
          ) : (
            <>
              {delayedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-[#d3151b] dark:text-red-400 font-bold text-[10px]">
                        ATRASADO
                      </span>
                      <span className="text-slate-600 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-xs font-medium">
                        {item.eventName}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.description}</p>
                    <p className="text-slate-500 dark:text-zinc-500 text-[11px]">
                      Responsável: <span className="text-slate-700 dark:text-zinc-300 font-medium">{item.responsible}</span> • Prazo: {formatDate(item.dueDate, "dd/MM/yyyy")}
                    </p>
                  </div>
                  <Link
                    href={`/events/${item.eventId}`}
                    className="shrink-0 p-1.5 rounded bg-red-100 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-[#d3151b] dark:text-red-400 transition-colors"
                    title="Ver evento"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}

              {pendingProofs.map((proof) => (
                <div
                  key={proof.id}
                  className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-[10px]">
                        COMPROVAÇÃO ENVIADA
                      </span>
                      <span className="text-slate-600 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-xs font-medium">
                        {proof.eventName}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Relatório fotográfico de ativação aguardando validação
                    </p>
                    <p className="text-slate-500 dark:text-zinc-500 text-[11px]">
                      Enviado em: {formatDate(proof.submittedAt, "dd/MM 'às' HH:mm")}
                    </p>
                  </div>
                  <Link
                    href={`/events/${proof.eventId}`}
                    className="shrink-0 p-1.5 rounded bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 transition-colors"
                    title="Validar comprovação"
                  >
                    <FileCheck className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Próximos Eventos no Cronograma */}
      <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1f2633] mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-600/10 border border-red-200 dark:border-red-600/30 flex items-center justify-center text-[#d3151b]">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Próximos Eventos Agendados
            </h3>
          </div>
          <Link
            href="/events"
            className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1 transition-colors font-medium"
          >
            Ver todos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {upcomingEvents.map((ev) => {
            const badge = getStatusBadge(ev.status);
            return (
              <Link
                key={ev.id}
                href={`/events/${ev.id}`}
                className="block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white group-hover:text-[#d3151b] dark:group-hover:text-[#f87171] text-xs transition-colors">
                    {ev.name}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 dark:text-zinc-400">
                  <span>{formatDate(ev.date, "dd/MM/yyyy 'às' HH:mm")}</span>
                  <span className="text-slate-400 dark:text-zinc-500">{ev.venue}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
