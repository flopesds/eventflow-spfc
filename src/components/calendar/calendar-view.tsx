"use client";

import { useState } from "react";
import Link from "next/link";
import { MockEvent } from "@/lib/mock-data";
import { formatDate, getEventTypeBadge, getStatusBadge } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO 
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarViewProps {
  events: MockEvent[];
}

export function CalendarView({ events }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "matchday-timeline">("calendar");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // Map events to date string (yyyy-MM-dd)
  const eventsByDate = new Map<string, MockEvent[]>();
  events.forEach((ev) => {
    const dStr = format(parseISO(ev.date), "yyyy-MM-dd");
    const existing = eventsByDate.get(dStr) || [];
    existing.push(ev);
    eventsByDate.set(dStr, existing);
  });

  // Selected date events
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const dayEvents = eventsByDate.get(selectedDateStr) || [];

  // Generate calendar days
  const calendarRows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dateKey = format(cloneDay, "yyyy-MM-dd");
      const dayEvs = eventsByDate.get(dateKey) || [];
      const isSelected = isSameDay(cloneDay, selectedDate);
      const isCurrentMonth = isSameMonth(cloneDay, monthStart);

      days.push(
        <div
          key={dateKey}
          onClick={() => setSelectedDate(cloneDay)}
          className={`min-h-[90px] sm:min-h-[110px] p-2 border border-slate-200 dark:border-[#1f2633]/60 cursor-pointer transition-all flex flex-col justify-between ${
            !isCurrentMonth 
              ? "opacity-30 bg-slate-100 dark:bg-[#090b0e]" 
              : "bg-white dark:bg-[#11151c]/60 hover:bg-slate-50 dark:hover:bg-[#151a23]"
          } ${isSelected ? "ring-2 ring-[#d3151b] bg-red-50/50 dark:bg-[#1a1315]" : ""}`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                isSameDay(cloneDay, new Date())
                  ? "bg-[#d3151b] text-white"
                  : isSelected
                  ? "text-[#d3151b] font-black"
                  : "text-slate-800 dark:text-zinc-300"
              }`}
            >
              {format(cloneDay, "d")}
            </span>
            {dayEvs.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#d3151b]" />
            )}
          </div>

          <div className="space-y-1 mt-1 overflow-hidden">
            {dayEvs.slice(0, 2).map((ev) => {
              const isMatch = ev.type === "JOGO";
              const isBrand = ev.type === "ATIVACAO_PATROCINADOR";
              return (
                <div
                  key={ev.id}
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded truncate border ${
                    isMatch
                      ? "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/50"
                      : isBrand
                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50"
                      : "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/50"
                  }`}
                  title={ev.name}
                >
                  {ev.name}
                </div>
              );
            })}
            {dayEvs.length > 2 && (
              <span className="text-[9px] text-slate-500 dark:text-zinc-400 font-mono">
                +{dayEvs.length - 2} mais
              </span>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    calendarRows.push(
      <div key={day.toISOString()} className="grid grid-cols-7 gap-px">
        {days}
      </div>
    );
    days = [];
  }

  // Next matchday for the timeline
  const matchdayEvent = events.find((e) => e.type === "JOGO") || events[0];

  return (
    <div className="space-y-6">
      {/* Switcher Mode: Calendar vs Matchday Timeline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] p-4 rounded-xl shadow-sm transition-colors">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "calendar"
                ? "bg-[#d3151b] text-white shadow-md shadow-red-950/20 dark:shadow-red-950/40"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Visão Mensal de Eventos</span>
          </button>

          <button
            onClick={() => setViewMode("matchday-timeline")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "matchday-timeline"
                ? "bg-[#d3151b] text-white shadow-md shadow-red-950/20 dark:shadow-red-950/40"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timeline Operacional do Jogo (T-Hours)</span>
          </button>
        </div>

        {viewMode === "calendar" && (
          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-slate-900 dark:text-white capitalize min-w-[130px] text-center">
              {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentMonth(new Date());
                setSelectedDate(new Date());
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-300"
            >
              Hoje
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: MONTHLY CALENDAR */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid (3 cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl overflow-hidden shadow-sm transition-colors">
            {/* Days of week header */}
            <div className="grid grid-cols-7 text-center py-2.5 bg-slate-50 dark:bg-[#0c0f14] border-b border-slate-200 dark:border-[#1f2633] text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>
            {/* Rows */}
            <div className="divide-y divide-slate-200 dark:divide-[#1f2633]/50">{calendarRows}</div>
          </div>

          {/* Day Inspector Sidebar (1 col) */}
          <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 shadow-sm space-y-4 transition-colors">
            <div className="pb-3 border-b border-slate-200 dark:border-[#1f2633]">
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase">Eventos Selecionados</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 capitalize">
                {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </h3>
            </div>

            {dayEvents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-zinc-500 text-xs">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-zinc-600" />
                Nenhum evento agendado para esta data.
              </div>
            ) : (
              <div className="space-y-3">
                {dayEvents.map((ev) => {
                  const typeBadge = getEventTypeBadge(ev.type);
                  const statusBadge = getStatusBadge(ev.status);
                  return (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#1f2633] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${typeBadge.className}`}>
                          {typeBadge.label}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ev.name}</h4>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#d3151b]" />
                          <span>{formatDate(ev.date, "HH:mm")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                          <span className="truncate">{ev.venue}</span>
                        </div>
                      </div>
                      <Link
                        href={`/events/${ev.id}`}
                        className="mt-2 w-full flex items-center justify-center space-x-1.5 py-1.5 rounded bg-slate-200 dark:bg-zinc-800 hover:bg-[#d3151b] hover:text-white text-slate-800 dark:text-white text-[11px] font-semibold transition-colors"
                      >
                        <span>Abrir Operação</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: MATCHDAY TACTICAL TIMELINE (T-HOURS) */}
      {viewMode === "matchday-timeline" && matchdayEvent && (
        <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1f2633] gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#d3151b] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                Cronograma Regressivo de Matchday
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {matchdayEvent.name} — MorumBIS
              </h2>
            </div>
            <Link
              href={`/events/${matchdayEvent.id}`}
              className="text-xs font-bold text-[#d3151b] dark:text-[#f87171] hover:underline flex items-center gap-1"
            >
              Ver Checklist Completo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Timeline steps */}
          <div className="relative border-l-2 border-slate-200 dark:border-zinc-800 ml-4 pl-6 sm:ml-6 sm:pl-8 space-y-8 py-2">
            {/* T-6h */}
            <div className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center shadow-md">
                ✓
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#d3151b] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/30">
                    T-6h (10:00)
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-300">Vistoria e Engenharia de Campo</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Ligação e teste de brilho dos painéis de LED perimetrais. Inspeção do gramado e calibração das câmeras do VAR.
                </p>
              </div>
            </div>

            {/* T-4h */}
            <div className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center shadow-md">
                ✓
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#d3151b] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/30">
                    T-4h (12:00)
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-300">Cenografia e Zonas de Patrocinador</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Montagem dos backdrops de entrevista na zona mista. Auditoria dos quiosques e camarotes de hospitalidade.
                </p>
              </div>
            </div>

            {/* T-2h */}
            <div className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center shadow-md animate-pulse">
                •
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/30">
                    T-2h (14:00)
                  </span>
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Abertura dos Portões & Acesso do Público</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Liberação das catracas de reconhecimento facial e distribuição de material promocional nos setores de arquibancada.
                </p>
              </div>
            </div>

            {/* T-45m */}
            <div className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-black text-[10px] flex items-center justify-center border border-slate-300 dark:border-zinc-700">
                •
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                    T-45m (15:15)
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-300">Aquecimento & Cerimonial dos Mascotes</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Entrada dos atletas para aquecimento. Entrada das crianças com o Santo Paulo e ativações nos telões.
                </p>
              </div>
            </div>

            {/* T-0 (Jogo) */}
            <div className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#d3151b] text-white font-black text-[10px] flex items-center justify-center shadow-md">
                ⚽
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white bg-[#d3151b] px-2 py-0.5 rounded">
                    T-0 (16:00)
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Apito Inicial — Execução em Tempo Real</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Transmissão e monitoramento dos tempos de exibição dos patrocinadores nos painéis durante o jogo.
                </p>
              </div>
            </div>

            {/* T+2h */}
            <div className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-black text-[10px] flex items-center justify-center border border-slate-300 dark:border-zinc-700">
                •
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                    T+2h (18:15)
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-300">Coletiva de Imprensa & Comprovação (Auditoria)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Upload das fotos oficiais de ativação e envio de relatório de conformidade da marca ao SponsorHub.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
