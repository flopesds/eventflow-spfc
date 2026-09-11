import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getEventById, getSponsors } from "@/lib/data";
import { updateEvent } from "@/app/actions";
import { ArrowLeft, Save, Calendar, MapPin, DollarSign, Layers } from "lucide-react";

export const revalidate = 0;

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage(props: EditEventPageProps) {
  const { id } = await props.params;
  const event = await getEventById(id);
  const sponsors = await getSponsors();

  if (!event) {
    notFound();
  }

  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const dateFormatted = new Date(event.date).toISOString().slice(0, 16);

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateEvent(formData);
    redirect(`/events/${id}`);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <Link
          href={`/events/${event.id}`}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Editar Evento
            </h1>
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">#{event.id}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Atualize dados cadastrais, data/horário, status e orçamentos da operação.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-6 sm:p-8 shadow-sm">
        <form action={handleUpdate} className="space-y-6">
          <input type="hidden" name="eventId" value={event.id} />

          {/* Nome do Evento */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Nome do Evento / Ativação *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={event.name}
              placeholder="Ex: SPFC x Palmeiras - Choque-Rei"
              className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#d3151b] transition-colors"
            />
          </div>

          {/* Tipo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Tipo de Evento *
              </label>
              <select
                name="type"
                required
                defaultValue={event.type}
                className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#d3151b] transition-colors"
              >
                <option value="JOGO">Matchday / Jogo Oficial</option>
                <option value="ATIVACAO_PATROCINADOR">Ativação de Patrocinador</option>
                <option value="EVENTO_TORCEDOR">Experiência de Torcedor</option>
                <option value="OUTRO">Outro Evento Institucional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Status Operacional *
              </label>
              <select
                name="status"
                required
                defaultValue={event.status}
                className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#d3151b] transition-colors"
              >
                <option value="PLANEJADO">Planejado</option>
                <option value="EM_EXECUCAO">Em Execução</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Data/Hora e Local */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Data e Horário *
              </label>
              <input
                type="datetime-local"
                name="date"
                required
                defaultValue={dateFormatted}
                className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#d3151b] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Local / Instalação (Venue) *
              </label>
              <input
                type="text"
                name="venue"
                required
                defaultValue={event.venue}
                placeholder="Ex: Estádio do MorumBIS"
                className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#d3151b] transition-colors"
              />
            </div>
          </div>

          {/* Patrocinador */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Patrocinador Vinculado (Opcional)
            </label>
            <select
              name="sponsorId"
              defaultValue={event.sponsorId || "none"}
              className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#d3151b] transition-colors"
            >
              <option value="none">Nenhum / Evento Próprio do Clube</option>
              {sponsors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-1">
              Marcas fictícias do ecossistema de cultura pop para preservação de dados confidenciais.
            </p>
          </div>

          {/* Orçamento Estimado x Orçamento Real */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Orçamento Estimado (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 text-sm">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  name="budgetEstimated"
                  defaultValue={event.budgetEstimated || ""}
                  placeholder="50000.00"
                  className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#d3151b] transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Custo Real Executado (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 text-sm">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  name="budgetReal"
                  defaultValue={event.budgetReal || ""}
                  placeholder="48500.00"
                  className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#d3151b] transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
            <Link
              href={`/events/${event.id}`}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="flex items-center space-x-1.5 bg-[#d3151b] hover:bg-[#b01015] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-red-950/20 dark:shadow-red-950/40"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
