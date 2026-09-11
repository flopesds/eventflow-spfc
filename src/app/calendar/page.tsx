import { getEvents } from "@/lib/data";
import { CalendarView } from "@/components/calendar/calendar-view";
import { CalendarDays } from "lucide-react";

export const revalidate = 0;

export default async function CalendarPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Calendário & Cronograma de Matchday
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-red-50 dark:bg-red-600/10 text-[#d3151b] dark:text-[#f87171] border border-red-200 dark:border-red-600/20">
              Operações MorumBIS
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Planejamento visual de datas, ativações de campo e linha do tempo regressiva hora-a-hora.
          </p>
        </div>
      </div>

      {/* Interactive Calendar Component */}
      <CalendarView events={events} />
    </div>
  );
}
