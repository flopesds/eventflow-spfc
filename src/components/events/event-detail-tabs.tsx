"use client";

import { useState } from "react";
import { MockEvent, MockVendor, MockChecklistItem } from "@/lib/mock-data";
import { 
  formatDate, 
  formatCurrency, 
  getStatusBadge, 
  getEventTypeBadge 
} from "@/lib/utils";
import { 
  toggleChecklistItemStatus, 
  addChecklistItem, 
  updateChecklistItem,
  addVendorToEvent, 
  addProof, 
  validateProof 
} from "@/app/actions";
import { exportSingleEventToExcel } from "@/lib/export-excel";
import { 
  CheckSquare, 
  Users, 
  FileCheck, 
  Info, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  ExternalLink, 
  Sparkles,
  ShieldCheck,
  Calendar,
  MapPin,
  TrendingDown,
  TrendingUp,
  Image as ImageIcon,
  Pencil,
  FileSpreadsheet,
  X,
  Save
} from "lucide-react";

interface EventDetailTabsProps {
  event: MockEvent;
  availableVendors: MockVendor[];
}

export function EventDetailTabs({ event, availableVendors }: EventDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "checklist" | "vendors" | "proofs">("checklist");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<MockChecklistItem | null>(null);
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [isAddingProof, setIsAddingProof] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState<Record<string, string>>({});

  const typeBadge = getEventTypeBadge(event.type);
  const statusBadge = getStatusBadge(event.status);

  // Financial calculations
  const totalVendorEstimated = event.vendors.reduce((acc, v) => acc + (v.costEstimated || 0), 0);
  const totalVendorReal = event.vendors.reduce((acc, v) => acc + (v.costReal || 0), 0);
  const budgetDiff = (event.budgetEstimated || 0) - (event.budgetReal || totalVendorReal);

  // Checklist stats
  const totalTasks = event.checklistItems.length;
  const completedTasks = event.checklistItems.filter(
    (i) => (optimisticStatus[i.id] || i.status) === "CONCLUIDO"
  ).length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  async function handleToggleStatus(itemId: string, currentStatus: string) {
    const nextStatusMap: Record<string, "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO"> = {
      PENDENTE: "EM_ANDAMENTO",
      EM_ANDAMENTO: "CONCLUIDO",
      ATRASADO: "CONCLUIDO",
      CONCLUIDO: "PENDENTE",
    };
    const next = nextStatusMap[currentStatus] || "EM_ANDAMENTO";
    setOptimisticStatus((prev) => ({ ...prev, [itemId]: next }));
    await toggleChecklistItemStatus(itemId, next);
  }

  return (
    <div className="space-y-6">
      {/* Tabs Navigation Header + Export to Excel CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-[#1f2633] gap-3">
        <div className="flex space-x-2 sm:space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center space-x-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "checklist"
                ? "border-[#d3151b] text-slate-900 dark:text-white"
                : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-500" />
            <span>Cronograma & Checklist</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] font-mono font-bold">
              {completedTasks}/{totalTasks}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("vendors")}
            className={`flex items-center space-x-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "vendors"
                ? "border-[#d3151b] text-slate-900 dark:text-white"
                : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-4 h-4 text-amber-500" />
            <span>Fornecedores & Custos</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] font-mono font-bold">
              {event.vendors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("proofs")}
            className={`flex items-center space-x-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "proofs"
                ? "border-[#d3151b] text-slate-900 dark:text-white"
                : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileCheck className="w-4 h-4 text-indigo-500" />
            <span>Comprovação de Entrega</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] font-mono font-bold">
              {event.proofs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center space-x-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "border-[#d3151b] text-slate-900 dark:text-white"
                : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Info className="w-4 h-4 text-blue-500" />
            <span>Visão Geral & Orçamento</span>
          </button>
        </div>

        {/* Export to Excel button for this event */}
        <button
          onClick={() => exportSingleEventToExcel(event)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-semibold transition-all shadow-sm self-start sm:self-auto mb-2 sm:mb-0"
          title="Exportar dados deste evento para planilha Excel (.csv)"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Exportar Evento (Excel)</span>
        </button>
      </div>

      {/* TAB 1: CHECKLIST */}
      {activeTab === "checklist" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Checklist Operacional de Campo
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Acompanhamento em tempo real das entregas antes, durante e após o matchday.
              </p>
            </div>
            <button
              onClick={() => setIsAddingTask(true)}
              className="flex items-center space-x-1.5 bg-[#d3151b] hover:bg-[#b01015] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Item</span>
            </button>
          </div>

          {/* Add Task Form */}
          {isAddingTask && (
            <div className="bg-white dark:bg-[#11151c] border border-red-300 dark:border-[#d3151b]/40 rounded-xl p-5 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#d3151b]" />
                Adicionar Nova Tarefa ao Cronograma
              </h4>
              <form
                action={async (formData) => {
                  await addChecklistItem(formData);
                  setIsAddingTask(false);
                }}
                className="space-y-3"
              >
                <input type="hidden" name="eventId" value={event.id} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-400 uppercase mb-1">
                      Descrição da Entrega *
                    </label>
                    <input
                      type="text"
                      name="description"
                      required
                      placeholder="Ex: Montagem do backdrop do patrocinador no túnel"
                      className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#d3151b]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-400 uppercase mb-1">
                      Responsável *
                    </label>
                    <input
                      type="text"
                      name="responsible"
                      required
                      placeholder="Ex: Coordenação de Ativações"
                      className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#d3151b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-400 uppercase mb-1">
                    Prazo Limite (Deadline) *
                  </label>
                  <input
                    type="datetime-local"
                    name="dueDate"
                    required
                    className="w-full sm:w-64 bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#d3151b]"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#d3151b] hover:bg-[#b01015] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    Adicionar Item
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Task Modal */}
          {editingTask && (
            <div className="bg-white dark:bg-[#11151c] border border-amber-300 dark:border-amber-500/40 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Pencil className="w-4 h-4 text-amber-500" />
                  Editar Tarefa: <span className="text-slate-600 dark:text-zinc-400 font-normal">#{editingTask.id}</span>
                </h4>
                <button
                  onClick={() => setEditingTask(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                action={async (formData) => {
                  await updateChecklistItem(formData);
                  setEditingTask(null);
                }}
                className="space-y-3"
              >
                <input type="hidden" name="itemId" value={editingTask.id} />
                <input type="hidden" name="eventId" value={event.id} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-400 uppercase mb-1">
                      Descrição da Entrega *
                    </label>
                    <input
                      type="text"
                      name="description"
                      required
                      defaultValue={editingTask.description}
                      className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-400 uppercase mb-1">
                      Responsável *
                    </label>
                    <input
                      type="text"
                      name="responsible"
                      required
                      defaultValue={editingTask.responsible}
                      className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-400 uppercase mb-1">
                      Prazo Limite *
                    </label>
                    <input
                      type="datetime-local"
                      name="dueDate"
                      required
                      defaultValue={new Date(editingTask.dueDate).toISOString().slice(0, 16)}
                      className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-400 uppercase mb-1">
                      Status da Tarefa *
                    </label>
                    <select
                      name="status"
                      defaultValue={editingTask.status}
                      className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="PENDENTE">Pendente</option>
                      <option value="EM_ANDAMENTO">Em Andamento</option>
                      <option value="CONCLUIDO">Concluído</option>
                      <option value="ATRASADO">Atrasado</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Alterações</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Checklist Items Table */}
          <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#0c0f14] border-b border-slate-200 dark:border-[#1f2633] text-slate-600 dark:text-zinc-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">Status</th>
                    <th className="py-3 px-4">Descrição da Atividade</th>
                    <th className="py-3 px-4">Responsável</th>
                    <th className="py-3 px-4">Prazo Limite</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#1f2633]/60">
                  {event.checklistItems.map((item) => {
                    const currentStatus = optimisticStatus[item.id] || item.status;
                    const badge = getStatusBadge(currentStatus);
                    const isDone = currentStatus === "CONCLUIDO";

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-zinc-800/30 transition-colors ${
                          isDone ? "opacity-75" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleStatus(item.id, currentStatus)}
                            className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                              isDone
                                ? "bg-emerald-500 border-emerald-400 text-black shadow-sm"
                                : currentStatus === "ATRASADO"
                                ? "border-red-500 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:border-emerald-400"
                                : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 hover:border-emerald-400 text-transparent hover:text-emerald-500"
                            }`}
                            title="Clique para alternar o status"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            <span className={isDone ? "line-through text-slate-400 dark:text-zinc-400" : ""}>
                              {item.description}
                            </span>
                          </div>
                          {item.completedAt && (
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                              Entregue em: {formatDate(item.completedAt)}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-700 dark:text-zinc-300 font-medium">
                          {item.responsible}
                        </td>

                        <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">
                          {formatDate(item.dueDate, "dd/MM/yyyy HH:mm")}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Toggle status pill */}
                            <button
                              onClick={() => handleToggleStatus(item.id, currentStatus)}
                              className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold transition-all hover:scale-105 ${badge.className}`}
                            >
                              {badge.label}
                            </button>

                            {/* Edit task button */}
                            <button
                              onClick={() => setEditingTask(item)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white border border-slate-200 dark:border-zinc-700 transition-colors"
                              title="Editar Tarefa"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VENDORS */}
      {activeTab === "vendors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Fornecedores & Despesas Operacionais
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Custos orçados vs valores faturados por empresa contratada para o evento.
              </p>
            </div>
            <button
              onClick={() => setIsAddingVendor(true)}
              className="flex items-center space-x-1.5 bg-[#d3151b] hover:bg-[#b01015] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Vincular Fornecedor</span>
            </button>
          </div>

          {/* Add Vendor Form */}
          {isAddingVendor && (
            <div className="bg-white dark:bg-[#11151c] border border-amber-300 dark:border-amber-500/40 rounded-xl p-5 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-500" />
                Alocar Fornecedor ao Evento
              </h4>
              <form
                action={async (formData) => {
                  await addVendorToEvent(formData);
                  setIsAddingVendor(false);
                }}
                className="space-y-3"
              >
                <input type="hidden" name="eventId" value={event.id} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-400 uppercase mb-1">
                      Fornecedor *
                    </label>
                    <select
                      name="vendorId"
                      required
                      className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#d3151b]"
                    >
                      {availableVendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-400 uppercase mb-1">
                      Custo Estimado (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="costEstimated"
                      placeholder="Ex: 25000"
                      className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#d3151b]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-400 uppercase mb-1">
                      Custo Real Executado (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="costReal"
                      placeholder="Ex: 24200"
                      className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#d3151b]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingVendor(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    Salvar Fornecedor
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Vendors Table */}
          <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0c0f14] border-b border-slate-200 dark:border-[#1f2633] text-slate-600 dark:text-zinc-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Fornecedor</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Custo Orçado</th>
                  <th className="py-3 px-4">Custo Real</th>
                  <th className="py-3 px-4 text-right">Variação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1f2633]/60">
                {event.vendors.map((evVen) => {
                  const est = evVen.costEstimated || 0;
                  const real = evVen.costReal || 0;
                  const diff = est - real;
                  const isUnder = real <= est;

                  return (
                    <tr key={evVen.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{evVen.vendor.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-500">{evVen.vendor.contact}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-zinc-400 font-medium">
                        {evVen.vendor.category}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-zinc-300 font-semibold">
                        {formatCurrency(evVen.costEstimated)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-900 dark:text-white font-semibold">
                        {evVen.costReal ? formatCurrency(evVen.costReal) : "A faturar"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {evVen.costReal ? (
                          <span
                            className={`font-mono font-bold text-xs ${
                              isUnder ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {isUnder ? "-" : "+"} {formatCurrency(Math.abs(diff))}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-zinc-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-[#0c0f14] font-bold border-t border-slate-200 dark:border-[#1f2633]">
                <tr>
                  <td className="py-3 px-4 text-slate-600 dark:text-zinc-400 uppercase text-[11px]">Total Fornecedores</td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-zinc-300 font-bold">
                    {formatCurrency(totalVendorEstimated)}
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {formatCurrency(totalVendorReal)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 dark:text-zinc-300">
                    Saldo: {formatCurrency(totalVendorEstimated - totalVendorReal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROOFS OF EXECUTION */}
      {activeTab === "proofs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Comprovação de Entrega & Auditoria Pós-Evento
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Evidências visuais de ativações de patrocinador para emissão de relatório contratual.
              </p>
            </div>
            <button
              onClick={() => setIsAddingProof(true)}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enviar Foto / Relatório</span>
            </button>
          </div>

          {/* Add Proof Form */}
          {isAddingProof && (
            <div className="bg-white dark:bg-[#11151c] border border-indigo-300 dark:border-indigo-500/40 rounded-xl p-5 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                Registrar Comprovante de Ativação
              </h4>
              <form
                action={async (formData) => {
                  await addProof(formData);
                  setIsAddingProof(false);
                }}
                className="space-y-3"
              >
                <input type="hidden" name="eventId" value={event.id} />
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-400 uppercase mb-1">
                    URL da Imagem / Foto de Matchday *
                  </label>
                  <input
                    type="url"
                    name="fileUrl"
                    required
                    placeholder="https://..."
                    className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-1">
                    Insira o link da foto de comprovação das placas de LED, camarote ou ativação no gramado.
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingProof(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    Salvar Comprovante
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Proofs Grid */}
          {event.proofs.length === 0 ? (
            <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-12 text-center text-slate-500 dark:text-zinc-500 text-xs">
              <FileCheck className="w-10 h-10 mx-auto mb-2 text-slate-400 dark:text-zinc-600" />
              Nenhum relatório de comprovação enviado para este evento até o momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {event.proofs.map((p) => {
                const isValidated = p.status === "VALIDADO";
                return (
                  <div
                    key={p.id}
                    className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full bg-slate-100 dark:bg-zinc-900 overflow-hidden group">
                      <img
                        src={p.fileUrl}
                        alt="Comprovante de Ativação"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                            isValidated
                              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40"
                              : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/40"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 space-y-1">
                        <div>
                          Enviado em: {p.submittedAt ? formatDate(p.submittedAt) : "-"}
                        </div>
                        {p.validatedAt && (
                          <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Validado em: {formatDate(p.validatedAt)}
                          </div>
                        )}
                      </div>

                      {!isValidated && (
                        <button
                          onClick={async () => {
                            await validateProof(p.id, event.id);
                          }}
                          className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Validar e Aprovar Entrega</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: OVERVIEW & BUDGET */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Informações do Evento
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#1f2633]">
                <span className="text-slate-500 dark:text-zinc-500 font-semibold uppercase block mb-1">Local (Venue)</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#d3151b]" />
                  {event.venue}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#1f2633]">
                <span className="text-slate-500 dark:text-zinc-500 font-semibold uppercase block mb-1">Data e Horário</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                  {formatDate(event.date, "EEEE, dd/MM/yyyy 'às' HH:mm")}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#1f2633]">
                <span className="text-slate-500 dark:text-zinc-500 font-semibold uppercase block mb-1">Patrocinador Parceiro</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">
                  {event.sponsor ? event.sponsor.name : "Evento Institucional do Clube"}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#1f2633]">
                <span className="text-slate-500 dark:text-zinc-500 font-semibold uppercase block mb-1">Status da Operação</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold ${statusBadge.className}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
                  {statusBadge.label}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Balanço Orçamentário
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-[#1f2633]">
                <span className="text-slate-500 dark:text-zinc-400">Orçado:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {formatCurrency(event.budgetEstimated)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-[#1f2633]">
                <span className="text-slate-500 dark:text-zinc-400">Gasto Real (Fornecedores):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {formatCurrency(totalVendorReal > 0 ? totalVendorReal : event.budgetReal)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 dark:text-zinc-400 font-semibold">Saldo / Economia:</span>
                <span
                  className={`font-mono font-bold text-sm ${
                    budgetDiff >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatCurrency(budgetDiff)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
