"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MockEvent } from "@/lib/mock-data";
import { formatDate, formatCurrency, getEventTypeBadge, getStatusBadge } from "@/lib/utils";
import { exportAllEventsToExcel, exportSingleEventToExcel } from "@/lib/export-excel";
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  CheckSquare, 
  ArrowRight, 
  DollarSign, 
  PlusCircle, 
  Layers,
  Pencil,
  FileSpreadsheet,
  SlidersHorizontal,
  X,
  RotateCcw
} from "lucide-react";

interface EventsListProps {
  initialEvents: MockEvent[];
}

export function EventsList({ initialEvents }: EventsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Advanced filters state
  const [selectedSponsor, setSelectedSponsor] = useState<string>("ALL");
  const [selectedVenue, setSelectedVenue] = useState<string>("ALL");
  const [checklistFilter, setChecklistFilter] = useState<string>("ALL");

  // Extract unique sponsors and venues for filter dropdowns
  const uniqueSponsors = useMemo(() => {
    const list = new Set<string>();
    initialEvents.forEach((e) => {
      if (e.sponsor?.name) list.add(e.sponsor.name);
    });
    return Array.from(list);
  }, [initialEvents]);

  const uniqueVenues = useMemo(() => {
    const list = new Set<string>();
    initialEvents.forEach((e) => {
      if (e.venue) list.add(e.venue);
    });
    return Array.from(list);
  }, [initialEvents]);

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((ev) => {
      const matchesSearch =
        ev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ev.sponsor && ev.sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = selectedType === "ALL" || ev.type === selectedType;
      const matchesStatus = selectedStatus === "ALL" || ev.status === selectedStatus;
      const matchesSponsor =
        selectedSponsor === "ALL" || (ev.sponsor && ev.sponsor.name === selectedSponsor);
      const matchesVenue = selectedVenue === "ALL" || ev.venue === selectedVenue;

      let matchesChecklist = true;
      if (checklistFilter === "HAS_DELAYED") {
        matchesChecklist = ev.checklistItems.some((i) => i.status === "ATRASADO");
      } else if (checklistFilter === "ALL_DONE") {
        matchesChecklist =
          ev.checklistItems.length > 0 &&
          ev.checklistItems.every((i) => i.status === "CONCLUIDO");
      } else if (checklistFilter === "PENDING") {
        matchesChecklist = ev.checklistItems.some((i) => i.status !== "CONCLUIDO");
      }

      return matchesSearch && matchesType && matchesStatus && matchesSponsor && matchesVenue && matchesChecklist;
    });
  }, [initialEvents, searchTerm, selectedType, selectedStatus, selectedSponsor, selectedVenue, checklistFilter]);

  const activeAdvancedCount = (selectedSponsor !== "ALL" ? 1 : 0) + 
                              (selectedVenue !== "ALL" ? 1 : 0) + 
                              (checklistFilter !== "ALL" ? 1 : 0);

  function resetFilters() {
    setSearchTerm("");
    setSelectedType("ALL");
    setSelectedStatus("ALL");
    setSelectedSponsor("ALL");
    setSelectedVenue("ALL");
    setChecklistFilter("ALL");
  }

  return (
    <div className="space-y-6">
      {/* Top Search, Filters & Export Bar */}
      <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-4 shadow-sm space-y-3 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar evento, local ou patrocinador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white pl-9 pr-4 py-2 rounded-lg text-sm placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#d3151b] transition-colors"
            />
          </div>

          {/* Quick Filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-[#0c0f14] p-1 rounded-lg border border-slate-200 dark:border-[#232936] text-xs">
              <button
                onClick={() => setSelectedType("ALL")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedType === "ALL"
                    ? "bg-[#d3151b] text-white font-semibold shadow-sm"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedType("JOGO")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedType === "JOGO"
                    ? "bg-[#d3151b] text-white font-semibold shadow-sm"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Jogos
              </button>
              <button
                onClick={() => setSelectedType("ATIVACAO_PATROCINADOR")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedType === "ATIVACAO_PATROCINADOR"
                    ? "bg-[#d3151b] text-white font-semibold shadow-sm"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Ativações
              </button>
              <button
                onClick={() => setSelectedType("EVENTO_TORCEDOR")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedType === "EVENTO_TORCEDOR"
                    ? "bg-[#d3151b] text-white font-semibold shadow-sm"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Torcedor
              </button>
            </div>

            {/* Status dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-700 dark:text-zinc-300 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#d3151b]"
            >
              <option value="ALL">Todos os Status</option>
              <option value="EM_EXECUCAO">Em Execução</option>
              <option value="PLANEJADO">Planejado</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>

            {/* Advanced Filters Toggle Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                showAdvancedFilters || activeAdvancedCount > 0
                  ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900/60 text-[#d3151b] dark:text-red-400"
                  : "bg-slate-50 dark:bg-[#0c0f14] border-slate-200 dark:border-[#232936] text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros</span>
              {activeAdvancedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#d3151b] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeAdvancedCount}
                </span>
              )}
            </button>

            {/* Export All to Excel Button */}
            <button
              onClick={() => exportAllEventsToExcel(filteredEvents)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-900/30"
              title="Exportar listagem completa de eventos para Excel (.csv)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel ({filteredEvents.length})</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters Expansion Panel */}
        {showAdvancedFilters && (
          <div className="pt-3 mt-3 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase mb-1">
                Filtrar por Patrocinador
              </label>
              <select
                value={selectedSponsor}
                onChange={(e) => setSelectedSponsor(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-800 dark:text-zinc-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#d3151b]"
              >
                <option value="ALL">Todos os Patrocinadores</option>
                {uniqueSponsors.map((sp) => (
                  <option key={sp} value={sp}>
                    {sp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase mb-1">
                Filtrar por Local (Venue)
              </label>
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-800 dark:text-zinc-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#d3151b]"
              >
                <option value="ALL">Todos os Locais</option>
                {uniqueVenues.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase mb-1">
                Situação do Checklist
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={checklistFilter}
                  onChange={(e) => setChecklistFilter(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-800 dark:text-zinc-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#d3151b]"
                >
                  <option value="ALL">Qualquer Progresso</option>
                  <option value="HAS_DELAYED">Com Itens Atrasados</option>
                  <option value="PENDING">Com Tarefas Pendentes</option>
                  <option value="ALL_DONE">100% Concluído</option>
                </select>

                <button
                  onClick={resetFilters}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300"
                  title="Limpar todos os filtros"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-12 text-center shadow-sm">
          <Layers className="w-12 h-12 text-slate-400 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Nenhum evento encontrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-500 mb-6">
            Tente ajustar os filtros de busca ou cadastre um novo evento operacional.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={resetFilters}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
            <Link
              href="/events/new"
              className="inline-flex items-center space-x-1.5 bg-[#d3151b] hover:bg-[#b01015] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cadastrar Evento</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => {
            const typeBadge = getEventTypeBadge(event.type);
            const statusBadge = getStatusBadge(event.status);

            const totalTasks = event.checklistItems.length;
            const completedTasks = event.checklistItems.filter((i) => i.status === "CONCLUIDO").length;
            const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const delayedTasks = event.checklistItems.filter((i) => i.status === "ATRASADO").length;

            return (
              <div
                key={event.id}
                className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  {/* Badges row + Individual Event Excel Export */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${typeBadge.className}`}>
                      {typeBadge.label}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 font-semibold ${statusBadge.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
                        {statusBadge.label}
                      </span>
                      {/* Individual Event Export Button */}
                      <button
                        onClick={() => exportSingleEventToExcel(event)}
                        className="p-1 rounded-md bg-slate-100 hover:bg-emerald-100 dark:bg-zinc-800/80 dark:hover:bg-emerald-950/60 text-slate-500 hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-zinc-700/60 transition-colors"
                        title="Exportar este evento para Excel (.csv)"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Sponsor */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#d3151b] dark:group-hover:text-[#f87171] transition-colors line-clamp-2">
                      {event.name}
                    </h3>
                    {event.sponsor && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1 flex items-center gap-1">
                        <span className="text-slate-400 dark:text-zinc-500 font-normal">Patrocinador:</span> {event.sponsor.name}
                      </p>
                    )}
                  </div>

                  {/* Date & Location */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#d3151b]" />
                      <span>{formatDate(event.date, "dd/MM/yyyy 'às' HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                  {/* Operational Checklist progress */}
                  <div className="pt-2 border-t border-slate-100 dark:border-[#1f2633]/60">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                        Checklist ({completedTasks}/{totalTasks})
                      </span>
                      <span className="font-mono text-slate-700 dark:text-zinc-300 font-bold">{taskProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${taskProgress}%` }}
                      />
                    </div>
                    {delayedTasks > 0 && (
                      <p className="text-[10px] text-red-500 dark:text-red-400 font-semibold mt-1">
                        ⚠️ {delayedTasks} item(ns) em atraso
                      </p>
                    )}
                  </div>

                  {/* Financial summary */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-[#1f2633]/60">
                    <span className="text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                      Orçado:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-300 font-mono">
                      {formatCurrency(event.budgetEstimated)}
                    </span>
                  </div>
                </div>

                {/* Footer actions: Ver Detalhes + Editar */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#1f2633] flex items-center gap-2">
                  <Link
                    href={`/events/${event.id}`}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-[#d3151b] text-slate-700 hover:text-white dark:bg-zinc-800/80 dark:hover:bg-[#d3151b] dark:text-white text-xs font-bold transition-colors group/btn"
                  >
                    <span>Ver Detalhes</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                  <Link
                    href={`/events/${event.id}/edit`}
                    className="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg bg-white dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] hover:border-slate-400 dark:hover:border-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors"
                    title="Editar Evento"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
