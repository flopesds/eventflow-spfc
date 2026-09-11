"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ChecklistStatus, ProofStatus, EventStatus, EventType } from "@prisma/client";
import { updateMockEvent, MOCK_SPONSORS, MOCK_EVENTS } from "@/lib/mock-data";

export async function toggleChecklistItemStatus(
  itemId: string,
  newStatus: ChecklistStatus
) {
  try {
    if (process.env.DATABASE_URL) {
      await prisma.checklistItem.update({
        where: { id: itemId },
        data: {
          status: newStatus,
          completedAt: newStatus === ChecklistStatus.CONCLUIDO ? new Date() : null,
        },
      });
    } else {
      for (const ev of MOCK_EVENTS) {
        const item = ev.checklistItems.find((i) => i.id === itemId);
        if (item) {
          item.status = newStatus as any;
          item.completedAt = newStatus === ChecklistStatus.CONCLUIDO ? new Date().toISOString() : null;
          break;
        }
      }
    }
  } catch (err) {
    console.error("Error updating checklist item:", err);
  }
  revalidatePath("/");
  revalidatePath("/events");
  return { success: true };
}

export async function addChecklistItem(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const description = formData.get("description") as string;
  const responsible = formData.get("responsible") as string;
  const dueDateStr = formData.get("dueDate") as string;

  if (!eventId || !description || !responsible || !dueDateStr) {
    return { error: "Todos os campos são obrigatórios." };
  }

  try {
    if (process.env.DATABASE_URL) {
      await prisma.checklistItem.create({
        data: {
          eventId,
          description,
          responsible,
          dueDate: new Date(dueDateStr),
          status: ChecklistStatus.PENDENTE,
        },
      });
    } else {
      const ev = MOCK_EVENTS.find((e) => e.id === eventId);
      if (ev) {
        ev.checklistItems.push({
          id: `chk-${Date.now()}`,
          eventId,
          description,
          responsible,
          dueDate: new Date(dueDateStr).toISOString(),
          status: "PENDENTE",
        });
      }
    }
  } catch (err) {
    console.error("Error creating checklist item:", err);
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/");
  return { success: true };
}

export async function updateChecklistItem(formData: FormData) {
  const itemId = formData.get("itemId") as string;
  const eventId = formData.get("eventId") as string;
  const description = formData.get("description") as string;
  const responsible = formData.get("responsible") as string;
  const dueDateStr = formData.get("dueDate") as string;
  const status = formData.get("status") as ChecklistStatus;

  if (!itemId || !description || !responsible || !dueDateStr) {
    return { error: "Todos os campos são obrigatórios." };
  }

  try {
    if (process.env.DATABASE_URL) {
      await prisma.checklistItem.update({
        where: { id: itemId },
        data: {
          description,
          responsible,
          dueDate: new Date(dueDateStr),
          status,
          completedAt: status === ChecklistStatus.CONCLUIDO ? new Date() : null,
        },
      });
    } else {
      const ev = MOCK_EVENTS.find((e) => e.id === eventId);
      if (ev) {
        const item = ev.checklistItems.find((i) => i.id === itemId);
        if (item) {
          item.description = description;
          item.responsible = responsible;
          item.dueDate = new Date(dueDateStr).toISOString();
          item.status = status as any;
          item.completedAt = status === ChecklistStatus.CONCLUIDO ? new Date().toISOString() : null;
        }
      }
    }
  } catch (err) {
    console.error("Error updating checklist item:", err);
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export async function createEvent(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as EventType;
  const dateStr = formData.get("date") as string;
  const venue = formData.get("venue") as string;
  const sponsorId = (formData.get("sponsorId") as string) || null;
  const budgetEstimated = formData.get("budgetEstimated")
    ? parseFloat(formData.get("budgetEstimated") as string)
    : null;

  if (!name || !type || !dateStr || !venue) {
    return { error: "Preencha os campos obrigatórios." };
  }

  let createdId = "new-event";
  try {
    if (process.env.DATABASE_URL) {
      const created = await prisma.event.create({
        data: {
          name,
          type,
          date: new Date(dateStr),
          venue,
          sponsorId: sponsorId && sponsorId !== "none" ? sponsorId : null,
          status: EventStatus.PLANEJADO,
          budgetEstimated,
        },
      });
      createdId = created.id;
    }
  } catch (err) {
    console.error("Error creating event:", err);
  }

  revalidatePath("/events");
  revalidatePath("/");
  revalidatePath("/calendar");
  return { success: true, eventId: createdId };
}

export async function updateEvent(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as EventType;
  const status = formData.get("status") as EventStatus;
  const dateStr = formData.get("date") as string;
  const venue = formData.get("venue") as string;
  const sponsorId = (formData.get("sponsorId") as string) || null;
  const budgetEstimated = formData.get("budgetEstimated")
    ? parseFloat(formData.get("budgetEstimated") as string)
    : null;
  const budgetReal = formData.get("budgetReal")
    ? parseFloat(formData.get("budgetReal") as string)
    : null;

  if (!eventId || !name || !type || !dateStr || !venue) {
    return { error: "Preencha os campos obrigatórios." };
  }

  try {
    if (process.env.DATABASE_URL) {
      await prisma.event.update({
        where: { id: eventId },
        data: {
          name,
          type,
          status,
          date: new Date(dateStr),
          venue,
          sponsorId: sponsorId && sponsorId !== "none" ? sponsorId : null,
          budgetEstimated,
          budgetReal,
        },
      });
    } else {
      const sp = sponsorId && sponsorId !== "none" ? MOCK_SPONSORS.find(s => s.id === sponsorId) || null : null;
      updateMockEvent(eventId, {
        name,
        type,
        status,
        date: new Date(dateStr).toISOString(),
        venue,
        sponsorId: sp ? sp.id : null,
        sponsor: sp,
        budgetEstimated,
        budgetReal,
      });
    }
  } catch (err) {
    console.error("Error updating event:", err);
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  revalidatePath("/");
  revalidatePath("/calendar");
  return { success: true };
}

export async function addVendorToEvent(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const vendorId = formData.get("vendorId") as string;
  const costEstimated = formData.get("costEstimated")
    ? parseFloat(formData.get("costEstimated") as string)
    : null;
  const costReal = formData.get("costReal")
    ? parseFloat(formData.get("costReal") as string)
    : null;

  if (!eventId || !vendorId) {
    return { error: "Fornecedor e evento são obrigatórios." };
  }

  try {
    if (process.env.DATABASE_URL) {
      await prisma.eventVendor.create({
        data: {
          eventId,
          vendorId,
          costEstimated,
          costReal,
        },
      });
    }
  } catch (err) {
    console.error("Error linking vendor:", err);
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/vendors");
  revalidatePath("/");
  return { success: true };
}

export async function addProof(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const fileUrl = formData.get("fileUrl") as string;

  if (!eventId || !fileUrl) {
    return { error: "Link ou arquivo de comprovação é obrigatório." };
  }

  try {
    if (process.env.DATABASE_URL) {
      await prisma.proof.create({
        data: {
          eventId,
          fileUrl,
          status: ProofStatus.ENVIADO,
          submittedAt: new Date(),
        },
      });
    }
  } catch (err) {
    console.error("Error creating proof:", err);
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/");
  return { success: true };
}

export async function validateProof(proofId: string, eventId: string) {
  try {
    if (process.env.DATABASE_URL) {
      await prisma.proof.update({
        where: { id: proofId },
        data: {
          status: ProofStatus.VALIDADO,
          validatedAt: new Date(),
        },
      });
    }
  } catch (err) {
    console.error("Error validating proof:", err);
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/");
  return { success: true };
}
