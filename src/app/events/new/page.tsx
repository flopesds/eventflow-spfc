import { getSponsors } from "@/lib/data";
import { createEvent } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, PlusCircle, Calendar, MapPin, DollarSign, Award, Layers } from "lucide-react";
import { redirect } from "next/navigation";

export default async function NewEventPage() {
  const sponsors = await getSponsors();

  async function handleCreate(formData: FormData) {
    "use server";
    const res = await createEvent(formData);
    if (res.eventId && res.eventId !== "new-event") {
      redirect(`/events/${res.eventId}`);
    } else {
      redirect("/events");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <Link
          href="/events"
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Cadastrar Novo Evento Operacional
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Cadastre um jogo, ativação de patrocinador ou ação de torcida no MorumBIS
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-6 sm:p-8 shadow-sm">
        <form action={handleCreate} className="space-y-6">
          {/* Nome do Evento */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Nome do Evento / Ativação *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ex: SPFC x Corinthians - Majestoso (Brasileirão)"
              className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#d3151b] transition-colors"
            />
          </div>

          {/* Tipo e Patrocinador */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Tipo de Evento *
              </label>
              <select
                name="type"
                required
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
                Patrocinador Vinculado (Opcional)
              </label>
              <select
                name="sponsorId"
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
                Conecta com as contrapartidas registradas no SponsorHub.
              </p>
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
                defaultValue="Estádio do MorumBIS"
                placeholder="Ex: MorumBIS, Camarote Stadium, Praça Roberto Pedrosa"
                className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#d3151b] transition-colors"
              />
            </div>
          </div>

          {/* Orçamento Estimado */}
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
                name="budgetEstimated"
                step="0.01"
                placeholder="50000.00"
                className="w-full bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#d3151b] transition-colors font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-1">
              Valor teto planejado para a contratação de fornecedores e estruturas.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
            <Link
              href="/events"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="flex items-center space-x-1.5 bg-[#d3151b] hover:bg-[#b01015] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-red-950/20 dark:shadow-red-950/40"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Salvar Evento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
