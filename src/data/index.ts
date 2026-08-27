export * from "./types";
export * from "./mosques";
export * from "./people";
export * from "./workOrders";
export * from "./prayer";
export * from "./fleet";
export * from "./cooling";

import { mosques } from "./mosques";
import { workOrders } from "./workOrders";
import { zones } from "./prayer";
import type { Band, Mosque, Severity, WorkOrder, ZoneId } from "./types";

export const mosquesById = Object.fromEntries(mosques.map((m) => [m.id, m])) as Record<
  string,
  Mosque
>;

export function mosque(id: string): Mosque {
  return mosquesById[id] as Mosque;
}

export function zoneName(id: ZoneId) {
  return zones.find((z) => z.id === id) ?? zones[0]!;
}

export function ordersForMosque(id: string): WorkOrder[] {
  return workOrders.filter((w) => w.mosque_id === id);
}

export function ordersForPerson(mosqueIds: string[]): WorkOrder[] {
  return workOrders.filter((w) => mosqueIds.includes(w.mosque_id));
}

const bandOrder: Record<Band, number> = { do_now: 0, escalate: 1, batch: 2, plan: 3 };

export const rankedOrders = [...workOrders].sort(
  (a, b) => bandOrder[a.band] - bandOrder[b.band] || b.score - a.score,
);

export const bandMeta: Record<Band, { en: string; ar: string }> = {
  do_now: { en: "Do now", ar: "تنفيذ فوري" },
  escalate: { en: "Escalate", ar: "تصعيد" },
  batch: { en: "Batch", ar: "تجميع" },
  plan: { en: "Plan", ar: "تخطيط" },
};

export const severityMeta: Record<Severity, { en: string; ar: string }> = {
  critical: { en: "Critical", ar: "حرج" },
  high: { en: "High", ar: "مرتفع" },
  medium: { en: "Medium", ar: "متوسط" },
  low: { en: "Low", ar: "منخفض" },
};

export const statusMeta = {
  reported: { en: "Reported", ar: "مُبلغ" },
  assigned: { en: "Assigned", ar: "مُسند" },
  in_progress: { en: "In progress", ar: "قيد التنفيذ" },
  escalated: { en: "Escalated", ar: "مُصعّد" },
  emergency_dispatched: { en: "Emergency dispatched", ar: "إرسال طوارئ" },
  closed: { en: "Closed", ar: "مغلق" },
} as const;

export function bandCounts() {
  return (Object.keys(bandMeta) as Band[]).map((b) => ({
    band: b,
    count: workOrders.filter((w) => w.band === b).length,
  }));
}

export function mosqueUrgency(id: string): "alert" | "warning" | "clear" {
  const open = ordersForMosque(id).filter((w) => w.status !== "closed");
  if (open.some((w) => w.severity === "critical" || w.sla_remaining < 0)) return "alert";
  if (open.length > 0) return "warning";
  return "clear";
}

export const regions = ["Abu Dhabi City", "Al Dhafra", "Al Ain"] as const;

export const regionLabels: Record<string, { en: string; ar: string }> = {
  "Abu Dhabi City": { en: "Abu Dhabi City", ar: "مدينة أبوظبي" },
  "Al Dhafra": { en: "Al Dhafra", ar: "الظفرة" },
  "Al Ain": { en: "Al Ain", ar: "العين" },
};

export function formatAED(value: number): string {
  return `AED ${value.toLocaleString("en-US")}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}
