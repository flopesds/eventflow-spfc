import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventById, getVendors } from "@/lib/data";
import { EventDetailTabs } from "@/components/events/event-detail-tabs";
import { formatDate, getEventTypeBadge, getStatusBadge } from "@/lib/utils";
import { ArrowLeft, Calendar, MapPin, Pencil } from "lucide-react";

export const revalidate = 0;

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage(props: EventDetailPageProps) {
  const { id } = await props.params;
  const event = await getEventById(id);
  const availableVendors = await getVendors();

  if (!event) {
    notFound();
  }

  const typeBadge = getEventTypeBadge(event.type);
  const statusBadge = getStatusBadge(event.status);

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center space-x-3">
          <Link
            href="/events"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors"
            title="Voltar para a lista de eventos"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${typeBadge.className}`}>
                {typeBadge.label}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1.5 font-semibold ${statusBadge.className}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
                {statusBadge.label}
              </span>
              {event.sponsor && (
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">
                  {event.sponsor.name}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {event.name}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#d3151b]" />
            <span>{formatDate(event.date, "dd/MM/yyyy HH:mm")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <span>{event.venue}</span>
          </div>

          <Link
            href={`/events/${event.id}/edit`}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-[#d3151b] hover:text-white dark:bg-zinc-800 dark:hover:bg-[#d3151b] text-slate-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-zinc-700 transition-all shadow-sm ml-auto sm:ml-2"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Editar Evento</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <EventDetailTabs event={event} availableVendors={availableVendors} />
    </div>
  );
}
