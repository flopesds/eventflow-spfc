import { getEvents } from "@/lib/data";
import { EventsList } from "@/components/events/events-list";
import { PlusCircle, Layers } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Gestão de Eventos
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-red-50 dark:bg-red-600/10 text-[#d3151b] dark:text-[#f87171] border border-red-200 dark:border-red-600/20">
              {events.length} Cadastrados
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Controle de partidas no MorumBIS, ativações com marcas parceiras e ações para torcedores.
          </p>
        </div>

        <Link
          href="/events/new"
          className="flex items-center space-x-1.5 bg-[#d3151b] hover:bg-[#b01015] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-red-950/20 dark:shadow-red-950/50 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Evento</span>
        </Link>
      </div>

      {/* Interactive List */}
      <EventsList initialEvents={events} />
    </div>
  );
}
