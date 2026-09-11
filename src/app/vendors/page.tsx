import { getVendors, getEvents } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { 
  Users, 
  DollarSign, 
  Briefcase, 
  Phone, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  Layers, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function VendorsPage() {
  const vendors = await getVendors();
  const events = await getEvents();

  // Aggregate stats per vendor across all events
  const vendorStats = vendors.map((v) => {
    const contracted = events.flatMap((e) =>
      e.vendors
        .filter((evVen) => evVen.vendorId === v.id)
        .map((evVen) => ({
          eventId: e.id,
          eventName: e.name,
          costEstimated: evVen.costEstimated || 0,
          costReal: evVen.costReal || 0,
        }))
    );

    const totalEstimated = contracted.reduce((acc, c) => acc + c.costEstimated, 0);
    const totalReal = contracted.reduce((acc, c) => acc + c.costReal, 0);
    const diff = totalEstimated - totalReal;

    return {
      ...v,
      contractedEvents: contracted,
      totalEstimated,
      totalReal,
      diff,
    };
  });

  const totalAggEstimated = vendorStats.reduce((acc, v) => acc + v.totalEstimated, 0);
  const totalAggReal = vendorStats.reduce((acc, v) => acc + v.totalReal, 0);
  const totalDifference = totalAggEstimated - totalAggReal;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Fornecedores & Parceiros Operacionais
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              {vendors.length} Homologados
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Gestão de contratos operacionais, fornecedores de matchday e comparação orçado vs real.
          </p>
        </div>
      </div>

      {/* Aggregate Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 shadow-sm transition-colors">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
            Total Estimado em Contratos
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
            {formatCurrency(totalAggEstimated)}
          </span>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Soma de orçamentos previstos</p>
        </div>

        <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 shadow-sm transition-colors">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
            Total Real Executado
          </span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
            {formatCurrency(totalAggReal)}
          </span>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Valores faturados e validados</p>
        </div>

        <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 shadow-sm transition-colors">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
            Economia Operacional (Saldo)
          </span>
          <span
            className={`text-2xl font-bold tracking-tight font-mono ${
              totalDifference >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(totalDifference)}
          </span>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Diferença consolidada no período</p>
        </div>
      </div>

      {/* Vendors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {vendorStats.map((vendor) => {
          const isUnder = vendor.diff >= 0;

          return (
            <div
              key={vendor.id}
              className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-zinc-700 transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      {vendor.name}
                    </h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                      {vendor.category}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-semibold">
                      Eventos Atendidos
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      {vendor.contractedEvents.length}
                    </span>
                  </div>
                </div>

                {vendor.contact && (
                  <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-[#1f2633]/60">
                    <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                    <span>{vendor.contact}</span>
                  </p>
                )}

                {/* Financial bar */}
                <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#1f2633] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-zinc-500">Orçado:</span>
                    <span className="font-mono text-slate-700 dark:text-zinc-300 font-semibold">
                      {formatCurrency(vendor.totalEstimated)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-zinc-500">Realizado:</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {formatCurrency(vendor.totalReal)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-zinc-800/80">
                    <span className="text-slate-600 dark:text-zinc-400 font-medium">Saldo:</span>
                    <span
                      className={`font-mono font-bold ${
                        isUnder ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatCurrency(vendor.diff)}
                    </span>
                  </div>
                </div>

                {/* List of contracted events preview */}
                {vendor.contractedEvents.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-400 block">
                      Operações Vinculadas:
                    </span>
                    <div className="space-y-1">
                      {vendor.contractedEvents.slice(0, 3).map((cev) => (
                        <Link
                          key={cev.eventId}
                          href={`/events/${cev.eventId}`}
                          className="flex items-center justify-between text-[11px] text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white p-1.5 rounded hover:bg-slate-100 dark:hover:bg-zinc-800/40 transition-colors"
                        >
                          <span className="truncate max-w-[220px]">{cev.eventName}</span>
                          <span className="font-mono text-slate-800 dark:text-zinc-300">
                            {formatCurrency(cev.costReal > 0 ? cev.costReal : cev.costEstimated)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
