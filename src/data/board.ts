import { mosques } from "./mosques";
import { workOrders } from "./workOrders";
import { peopleById } from "./people";

/** Mosques held under each FM contract. */
export const contractPortfolio: Record<string, string[]> = {
  "p-007": ["m-001", "m-002", "m-003", "m-004", "m-005", "m-006", "m-007"],
  "p-008": ["m-008", "m-009"],
};

export function portfolioFor(personId: string): string[] {
  return contractPortfolio[personId] ?? [];
}

export function portfolioOrders(personId: string) {
  const ids = portfolioFor(personId);
  return workOrders.filter((w) => ids.includes(w.mosque_id) && w.status !== "closed");
}

export function portfolioCompliance(personId: string): number {
  const ids = portfolioFor(personId);
  const scoped = mosques.filter((m) => ids.includes(m.id));
  if (scoped.length === 0) return 0;
  return Math.round(scoped.reduce((s, m) => s + m.compliance, 0) / scoped.length);
}

export type CrewMember = {
  id: string;
  name_en: string;
  name_ar: string;
  trade_en: string;
  trade_ar: string;
  initials: string;
  mosques: string[];
  load: number;
  capacity: number;
  on_site: string | null;
  radius_km: number;
  supervisor_id: string;
};

export const crew: CrewMember[] = [
  {
    id: "p-006",
    name_en: peopleById["p-006"]!.name_en,
    name_ar: peopleById["p-006"]!.name_ar,
    trade_en: "HVAC and electrical",
    trade_ar: "تكييف وكهرباء",
    initials: "RK",
    mosques: ["m-002", "m-003", "m-005"],
    load: 1,
    capacity: 5,
    on_site: "m-002",
    radius_km: 3.1,
    supervisor_id: "p-007",
  },
  {
    id: "c-002",
    name_en: "Imran Sheikh",
    name_ar: "عمران شيخ",
    trade_en: "Plumbing and civil",
    trade_ar: "سباكة وأعمال مدنية",
    initials: "IS",
    mosques: ["m-006", "m-007"],
    load: 1,
    capacity: 5,
    on_site: null,
    radius_km: 3.8,
    supervisor_id: "p-007",
  },
  {
    id: "c-003",
    name_en: "Anton Perera",
    name_ar: "أنطون بيريرا",
    trade_en: "Fire and safety systems",
    trade_ar: "أنظمة الحريق والسلامة",
    initials: "AP",
    mosques: ["m-001", "m-004"],
    load: 1,
    capacity: 5,
    on_site: "m-001",
    radius_km: 2.4,
    supervisor_id: "p-007",
  },
];

export function crewFor(supervisorId: string) {
  return crew.filter((c) => c.supervisor_id === supervisorId);
}

/** Rows carried into the printable KPI evidence sheet. */
export const kpiEvidence = [
  {
    label_en: "Work orders raised this month",
    label_ar: "أوامر العمل المفتوحة هذا الشهر",
    value: "18",
    note_en: "All logged with photo evidence",
    note_ar: "جميعها موثقة بالصور",
  },
  {
    label_en: "Closed within the service level",
    label_ar: "المغلقة ضمن مستوى الخدمة",
    value: "15 of 15",
    note_en: "No breach in the contract period",
    note_ar: "لا تجاوز خلال فترة العقد",
  },
  {
    label_en: "Average response, critical",
    label_ar: "متوسط الاستجابة للحالات الحرجة",
    value: "42 min",
    note_en: "Contract limit 60 min",
    note_ar: "الحد التعاقدي ٦٠ دقيقة",
  },
  {
    label_en: "Planned maintenance completed",
    label_ar: "الصيانة الوقائية المنجزة",
    value: "92%",
    note_en: "One quarterly coil clean overdue",
    note_ar: "تنظيف ملفات ربع سنوي متأخر",
  },
  {
    label_en: "Verified by the mosque",
    label_ar: "تم التحقق من المسجد",
    value: "15 of 15",
    note_en: "Each fix confirmed by the imam or caretaker",
    note_ar: "كل إصلاح مؤكد من الإمام أو خادم المسجد",
  },
];
