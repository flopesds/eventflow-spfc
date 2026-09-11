import prisma from "./prisma";
import { MOCK_EVENTS, MOCK_SPONSORS, MOCK_VENDORS, MockEvent } from "./mock-data";

export async function getEvents(): Promise<MockEvent[]> {
  try {
    if (!process.env.DATABASE_URL) {
      return MOCK_EVENTS;
    }
    const events = await prisma.event.findMany({
      include: {
        sponsor: true,
        checklistItems: true,
        vendors: {
          include: {
            vendor: true,
          },
        },
        proofs: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    if (!events || events.length === 0) {
      return MOCK_EVENTS;
    }

    // Map Prisma models to unified MockEvent shape
    return events.map((ev) => ({
      id: ev.id,
      name: ev.name,
      type: ev.type as MockEvent["type"],
      date: ev.date.toISOString(),
      venue: ev.venue,
      sponsorId: ev.sponsorId,
      sponsor: ev.sponsor ? { id: ev.sponsor.id, name: ev.sponsor.name } : null,
      status: ev.status as MockEvent["status"],
      budgetEstimated: ev.budgetEstimated ? Number(ev.budgetEstimated) : null,
      budgetReal: ev.budgetReal ? Number(ev.budgetReal) : null,
      checklistItems: ev.checklistItems.map((c) => ({
        id: c.id,
        eventId: c.eventId,
        description: c.description,
        responsible: c.responsible,
        dueDate: c.dueDate.toISOString(),
        status: c.status as any,
        completedAt: c.completedAt ? c.completedAt.toISOString() : null,
      })),
      vendors: ev.vendors.map((v) => ({
        id: v.id,
        eventId: v.eventId,
        vendorId: v.vendorId,
        vendor: {
          id: v.vendor.id,
          name: v.vendor.name,
          category: v.vendor.category,
          contact: v.vendor.contact,
        },
        costEstimated: v.costEstimated ? Number(v.costEstimated) : null,
        costReal: v.costReal ? Number(v.costReal) : null,
      })),
      proofs: ev.proofs.map((p) => ({
        id: p.id,
        eventId: p.eventId,
        fileUrl: p.fileUrl,
        status: p.status as any,
        submittedAt: p.submittedAt ? p.submittedAt.toISOString() : null,
        validatedAt: p.validatedAt ? p.validatedAt.toISOString() : null,
      })),
    }));
  } catch (error) {
    console.warn("Using mock data due to DB error / offline mode:", error);
    return MOCK_EVENTS;
  }
}

export async function getEventById(id: string): Promise<MockEvent | null> {
  const events = await getEvents();
  return events.find((e) => e.id === id) ?? null;
}

export async function getSponsors() {
  try {
    if (process.env.DATABASE_URL) {
      const sp = await prisma.sponsor.findMany({ orderBy: { name: "asc" } });
      if (sp.length > 0) return sp;
    }
  } catch {
    // fallback
  }
  return MOCK_SPONSORS;
}

export async function getVendors() {
  try {
    if (process.env.DATABASE_URL) {
      const ven = await prisma.vendor.findMany({ orderBy: { name: "asc" } });
      if (ven.length > 0) return ven;
    }
  } catch {
    // fallback
  }
  return MOCK_VENDORS;
}
