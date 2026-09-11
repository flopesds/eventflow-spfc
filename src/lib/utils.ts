import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "R$ 0,00";
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  if (isNaN(num)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

export function formatDate(date: Date | string | null | undefined, pattern = "dd/MM/yyyy 'às' HH:mm"): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return format(d, pattern, { locale: ptBR });
}

export function formatRelativeDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return formatDistanceToNow(d, { addSuffix: true, locale: ptBR });
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "CONCLUIDO":
    case "VALIDADO":
      return {
        label: "Concluído",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        dotColor: "bg-emerald-400",
      };
    case "EM_EXECUCAO":
    case "EM_ANDAMENTO":
      return {
        label: "Em Execução",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        dotColor: "bg-amber-400",
      };
    case "PLANEJADO":
    case "PENDENTE":
      return {
        label: "Planejado",
        className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        dotColor: "bg-blue-400",
      };
    case "ATRASADO":
      return {
        label: "Atrasado",
        className: "bg-red-500/10 text-red-400 border-red-500/30",
        dotColor: "bg-red-400",
      };
    case "ENVIADO":
      return {
        label: "Enviado",
        className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        dotColor: "bg-indigo-400",
      };
    case "CANCELADO":
      return {
        label: "Cancelado",
        className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
        dotColor: "bg-zinc-400",
      };
    default:
      return {
        label: status,
        className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
        dotColor: "bg-zinc-400",
      };
  }
}

export function getEventTypeBadge(type: string) {
  switch (type) {
    case "JOGO":
      return {
        label: "Matchday / Jogo",
        className: "bg-red-600/20 text-red-400 border-red-600/30",
      };
    case "ATIVACAO_PATROCINADOR":
      return {
        label: "Ativação de Marca",
        className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      };
    case "EVENTO_TORCEDOR":
      return {
        label: "Experiência Torcedor",
        className: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      };
    default:
      return {
        label: "Outro Evento",
        className: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
      };
  }
}
