import { MockEvent } from "./mock-data";
import { formatDate } from "./utils";

// Format numbers for PT-BR Excel
function formatExcelNumber(val: number | null | undefined): string {
  if (val === null || val === undefined) return "";
  return val.toFixed(2).replace(".", ",");
}

function triggerDownload(content: string, filename: string) {
  // UTF-8 BOM so Excel opens PT-BR accents correctly without gibberish
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAllEventsToExcel(events: MockEvent[]) {
  const headers = [
    "ID",
    "Nome do Evento",
    "Tipo",
    "Status",
    "Data e Hora",
    "Local (Venue)",
    "Patrocinador Vinculado",
    "Orçamento Estimado (R$)",
    "Custo Real Executado (R$)",
    "Variação Financeira (R$)",
    "Total de Tarefas Checklist",
    "Tarefas Concluídas",
    "% Conclusão Checklist",
    "Fornecedores Contratados",
    "Comprovações Enviadas",
  ];

  const rows = events.map((ev) => {
    const totalTasks = ev.checklistItems.length;
    const completedTasks = ev.checklistItems.filter((i) => i.status === "CONCLUIDO").length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const est = ev.budgetEstimated || 0;
    const real = ev.budgetReal || 0;
    const diff = est - real;

    return [
      ev.id,
      `"${ev.name.replace(/"/g, '""')}"`,
      ev.type,
      ev.status,
      formatDate(ev.date, "dd/MM/yyyy HH:mm"),
      `"${ev.venue.replace(/"/g, '""')}"`,
      `"${(ev.sponsor?.name || "Clube Próprio").replace(/"/g, '""')}"`,
      formatExcelNumber(ev.budgetEstimated),
      formatExcelNumber(ev.budgetReal),
      formatExcelNumber(diff),
      totalTasks,
      completedTasks,
      `${progress}%`,
      ev.vendors.length,
      ev.proofs.length,
    ].join(";");
  });

  const csvContent = [headers.join(";"), ...rows].join("\r\n");
  const filename = `EventFlow_SPFC_Todos_Eventos_${new Date().toISOString().slice(0, 10)}.csv`;
  triggerDownload(csvContent, filename);
}

export function exportSingleEventToExcel(event: MockEvent) {
  const lines: string[] = [];

  // Header section
  lines.push("RELATÓRIO OPERACIONAL DE MATCHDAY & ATIVAÇÃO - EVENTFLOW SPFC");
  lines.push("");
  lines.push(`Nome do Evento;${event.name}`);
  lines.push(`Tipo de Evento;${event.type}`);
  lines.push(`Status Operacional;${event.status}`);
  lines.push(`Data e Horário;${formatDate(event.date, "dd/MM/yyyy HH:mm")}`);
  lines.push(`Local;${event.venue}`);
  lines.push(`Patrocinador;${event.sponsor?.name || "Clube Próprio"}`);
  lines.push(`Orçamento Estimado (R$);${formatExcelNumber(event.budgetEstimated)}`);
  lines.push(`Custo Real Executado (R$);${formatExcelNumber(event.budgetReal)}`);
  lines.push("");

  // Checklist section
  lines.push("CRONOGRAMA & CHECKLIST OPERACIONAL");
  lines.push("ID;Descrição da Atividade;Responsável;Prazo Limite;Status;Concluído Em");
  event.checklistItems.forEach((c) => {
    lines.push([
      c.id,
      `"${c.description.replace(/"/g, '""')}"`,
      `"${c.responsible.replace(/"/g, '""')}"`,
      formatDate(c.dueDate, "dd/MM/yyyy HH:mm"),
      c.status,
      c.completedAt ? formatDate(c.completedAt, "dd/MM/yyyy HH:mm") : "-",
    ].join(";"));
  });
  lines.push("");

  // Vendors section
  lines.push("FORNECEDORES & CUSTOS CONTRATADOS");
  lines.push("Fornecedor;Categoria;Contato;Custo Estimado (R$);Custo Real (R$);Saldo (R$)");
  event.vendors.forEach((v) => {
    const est = v.costEstimated || 0;
    const real = v.costReal || 0;
    const diff = est - real;
    lines.push([
      `"${v.vendor.name.replace(/"/g, '""')}"`,
      `"${v.vendor.category.replace(/"/g, '""')}"`,
      `"${(v.vendor.contact || "").replace(/"/g, '""')}"`,
      formatExcelNumber(v.costEstimated),
      formatExcelNumber(v.costReal),
      formatExcelNumber(diff),
    ].join(";"));
  });
  lines.push("");

  // Proofs section
  lines.push("COMPROVAÇÃO DE EXECUÇÃO / AUDITORIA DE ATIVAÇÃO");
  lines.push("ID;Status;Data de Envio;Data de Validação;Link / Arquivo");
  event.proofs.forEach((p) => {
    lines.push([
      p.id,
      p.status,
      p.submittedAt ? formatDate(p.submittedAt, "dd/MM/yyyy HH:mm") : "-",
      p.validatedAt ? formatDate(p.validatedAt, "dd/MM/yyyy HH:mm") : "-",
      `"${p.fileUrl.replace(/"/g, '""')}"`,
    ].join(";"));
  });

  const csvContent = lines.join("\r\n");
  const sanitizedName = event.name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
  const filename = `EventFlow_${sanitizedName}_${new Date().toISOString().slice(0, 10)}.csv`;
  triggerDownload(csvContent, filename);
}
