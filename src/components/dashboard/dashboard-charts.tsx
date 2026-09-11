"use client";

import { MockEvent } from "@/lib/mock-data";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface DashboardChartsProps {
  events: MockEvent[];
}

export function DashboardCharts({ events }: DashboardChartsProps) {
  // 1. Data for Budget Chart (Top 6 events with budgets)
  const budgetData = events
    .filter((e) => e.budgetEstimated || e.budgetReal)
    .slice(0, 6)
    .map((e) => {
      const shortName = e.name.length > 20 ? e.name.substring(0, 20) + "..." : e.name;
      return {
        name: shortName,
        fullName: e.name,
        Orçado: e.budgetEstimated || 0,
        Real: e.budgetReal || 0,
      };
    });

  // 2. Data for Status Distribution Pie Chart
  const statusCounts: Record<string, number> = {};
  events.forEach((e) => {
    statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
  });

  const statusColors: Record<string, string> = {
    CONCLUIDO: "#10b981", // emerald
    EM_EXECUCAO: "#f59e0b", // amber
    PLANEJADO: "#3b82f6", // blue
    CANCELADO: "#6b7280", // gray
  };

  const statusLabels: Record<string, string> = {
    CONCLUIDO: "Concluído",
    EM_EXECUCAO: "Em Execução",
    PLANEJADO: "Planejado",
    CANCELADO: "Cancelado",
  };

  const pieData = Object.entries(statusCounts).map(([key, value]) => ({
    name: statusLabels[key] || key,
    value,
    color: statusColors[key] || "#8884d8",
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Orçamento Estimado x Real (2 colunas) */}
      <div className="lg:col-span-2 bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1f2633] mb-4 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Custo Estimado x Custo Real por Evento
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Comparativo financeiro das principais operações e ativações de matchday
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#d3151b]" />
              Orçado
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              Executado Real
            </span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={budgetData}
              margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
            >
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] p-3 rounded-lg shadow-xl text-xs">
                        <p className="font-bold text-slate-900 dark:text-white mb-2">{data.fullName}</p>
                        <p className="text-[#d3151b] dark:text-[#f87171] flex justify-between gap-4">
                          <span>Orçado:</span>
                          <span className="font-mono font-semibold">{formatCurrency(data.Orçado)}</span>
                        </p>
                        <p className="text-emerald-600 dark:text-emerald-400 flex justify-between gap-4 mt-1">
                          <span>Real:</span>
                          <span className="font-mono font-semibold">
                            {data.Real > 0 ? formatCurrency(data.Real) : "Aguardando encerramento"}
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="Orçado" fill="#d3151b" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Real" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribuição por Status (1 coluna) */}
      <div className="bg-white dark:bg-[#11151c] border border-slate-200 dark:border-[#1f2633] rounded-xl p-5 shadow-sm flex flex-col justify-between transition-colors">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Status das Operações
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4 pb-2 border-b border-slate-200 dark:border-[#1f2633]">
            Visão consolidada do ciclo de vida dos eventos
          </p>
        </div>

        <div className="h-[200px] w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    return (
                      <div className="bg-white dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232936] px-3 py-1.5 rounded-lg shadow-lg text-xs">
                        <span className="font-semibold text-slate-900 dark:text-white">{item.name}: </span>
                        <span className="font-bold text-slate-700 dark:text-zinc-300">{item.value} evento(s)</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered summary */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{events.length}</span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
              Total
            </span>
          </div>
        </div>

        {/* Legend pills */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-[#1f2633]">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 dark:text-zinc-400 truncate">{item.name}</span>
              <span className="text-slate-900 dark:text-white font-bold ml-auto">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
