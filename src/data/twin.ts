import { mosque, ordersForMosque } from "./index";
import type { WorkOrder, ZoneId } from "./types";

export type PartKind =
  | "cooling_main"
  | "cooling_women"
  | "fire_panel"
  | "pa"
  | "lighting"
  | "taps"
  | "carpet"
  | "doors";

export type PartHealth = "healthy" | "warning" | "faulty";

export type TwinPart = {
  id: PartKind;
  zone: ZoneId;
  name_en: string;
  name_ar: string;
  health: PartHealth;
  /** Local position inside the generated mosque, in unit-shell coordinates. */
  pos: [number, number, number];
  size: [number, number, number];
  detail_en: string;
  detail_ar: string;
  action_en: string;
  action_ar: string;
  ticket?: WorkOrder;
};

export type TwinModel = {
  /** Overall footprint scale factor from real area, kept within readable bounds. */
  scale: number;
  hall: [number, number, number];
  women: [number, number, number];
  minaretHeight: number;
  parts: TwinPart[];
};

const base: Omit<TwinPart, "health" | "ticket">[] = [
  {
    id: "cooling_main",
    zone: "main_hall",
    name_en: "Main hall cooling",
    name_ar: "تبريد المصلى الرئيسي",
    pos: [-0.35, 0.62, 0.3],
    size: [0.34, 0.16, 0.22],
    detail_en: "Two air handling units serve the main hall from the roof plant.",
    detail_ar: "وحدتا مناولة هواء تخدمان المصلى الرئيسي من محطة السطح.",
    action_en: "Clean the coil and recheck supply temperature at iqamah.",
    action_ar: "تنظيف الملف وإعادة قياس حرارة التزويد عند الإقامة.",
  },
  {
    id: "cooling_women",
    zone: "women_hall",
    name_en: "Women's hall cooling",
    name_ar: "تبريد مصلى النساء",
    pos: [0.95, 0.44, -0.55],
    size: [0.24, 0.14, 0.18],
    detail_en: "A single unit serves the women's hall, with no standby capacity.",
    detail_ar: "وحدة واحدة تخدم مصلى النساء دون طاقة احتياطية.",
    action_en: "Recharge refrigerant, then verify comfort at the next two prayers.",
    action_ar: "إعادة شحن غاز التبريد ثم التحقق من الراحة في الصلاتين التاليتين.",
  },
  {
    id: "fire_panel",
    zone: "main_hall",
    name_en: "Fire alarm panel",
    name_ar: "لوحة إنذار الحريق",
    pos: [-0.85, 0.28, 0.85],
    size: [0.14, 0.24, 0.1],
    detail_en: "Addressable panel covering all six zones and the minaret riser.",
    detail_ar: "لوحة عنونة تغطي المناطق الست ومنور المئذنة.",
    action_en: "Clear the zone fault, then run a full detection test with the Imam present.",
    action_ar: "معالجة عطل الدائرة ثم اختبار كشف كامل بحضور الإمام.",
  },
  {
    id: "pa",
    zone: "minaret",
    name_en: "PA and adhan system",
    name_ar: "نظام الصوت والأذان",
    pos: [1.95, 1.45, 1.2],
    size: [0.16, 0.14, 0.16],
    detail_en: "Amplifier rack feeding the minaret horns and the internal speakers.",
    detail_ar: "مضخم صوت يغذي أبواق المئذنة والسماعات الداخلية.",
    action_en: "No action needed. Levels were verified at the last inspection.",
    action_ar: "لا إجراء مطلوب. تم التحقق من المستويات في آخر تفتيش.",
  },
  {
    id: "lighting",
    zone: "courtyard",
    name_en: "Courtyard lighting",
    name_ar: "إنارة الفناء",
    pos: [-1.35, 0.34, -0.75],
    size: [0.5, 0.08, 0.5],
    detail_en: "Twelve pole heads on one circuit around the courtyard perimeter.",
    detail_ar: "اثنا عشر رأس عمود على دائرة واحدة حول محيط الفناء.",
    action_en: "Replace the failing driver and test the circuit after Isha.",
    action_ar: "استبدال المشغّل المتعطل واختبار الدائرة بعد العشاء.",
  },
  {
    id: "taps",
    zone: "wudu",
    name_en: "Ablution taps",
    name_ar: "صنابير الوضوء",
    pos: [-1.4, 0.2, 0.7],
    size: [0.44, 0.12, 0.26],
    detail_en: "Sixteen sensor taps with a flow limiter fitted last quarter.",
    detail_ar: "ستة عشر صنبورا حساسا مع محدد تدفق رُكّب الربع الماضي.",
    action_en: "Keep on the quarterly descale schedule.",
    action_ar: "الإبقاء على جدول إزالة الترسبات الربع سنوي.",
  },
  {
    id: "carpet",
    zone: "main_hall",
    name_en: "Main hall carpet",
    name_ar: "سجاد المصلى الرئيسي",
    pos: [-0.35, 0.045, 0],
    size: [1.25, 0.02, 1.35],
    detail_en: "Rows aligned to the qibla wall, deep cleaned every eight weeks.",
    detail_ar: "الصفوف محاذية لجدار القبلة، تنظيف عميق كل ثمانية أسابيع.",
    action_en: "Dry the affected rows and inspect the screed beneath before relaying.",
    action_ar: "تجفيف الصفوف المتأثرة وفحص الأرضية قبل إعادة الفرش.",
  },
  {
    id: "doors",
    zone: "stores",
    name_en: "Entrance doors",
    name_ar: "أبواب المدخل",
    pos: [0.42, 0.26, 1.1],
    size: [0.36, 0.4, 0.08],
    detail_en: "Main entrance leaves with closers, checked on the monthly walk.",
    detail_ar: "مصاريع المدخل الرئيسي مع مغاليق، تُفحص في الجولة الشهرية.",
    action_en: "No action needed.",
    action_ar: "لا إجراء مطلوب.",
  },
];

const partForOrder = (o: WorkOrder): PartKind | null => {
  if (o.category === "safety") return "fire_panel";
  if (o.category === "lighting") return "lighting";
  if (o.category === "hvac") return o.zone === "women_hall" ? "cooling_women" : "cooling_main";
  if (o.category === "plumbing") return o.zone === "wudu" ? "taps" : "carpet";
  if (o.category === "cleaning") return "carpet";
  return null;
};

export function twinFor(mosqueId: string): TwinModel {
  const m = mosque(mosqueId);
  const open = ordersForMosque(mosqueId).filter((o) => o.status !== "closed");

  const parts: TwinPart[] = base.map((p) => {
    const ticket = open.find((o) => partForOrder(o) === p.id);
    const health: PartHealth = ticket
      ? ticket.severity === "critical" || ticket.severity === "high" || ticket.sla_remaining < 0
        ? "faulty"
        : "warning"
      : "healthy";
    return ticket ? { ...p, health, ticket } : { ...p, health };
  });

  // Scale from the real footprint so a grand mosque reads larger than a daily one.
  const scale = Math.min(1.85, Math.max(0.78, Math.sqrt(m.area_m2 / 900)));
  const cap = Math.min(1.5, Math.max(0.85, Math.sqrt(m.capacity / 420)));

  return {
    scale,
    hall: [2.2 * scale, 1.05 * cap, 2.4 * scale],
    women: [1.15 * scale, 0.8 * cap, 1.2 * scale],
    minaretHeight: 2.6 * cap * (m.class === "Daily" ? 0.85 : 1.15),
    parts,
  };
}

export const healthMeta: Record<PartHealth, { en: string; ar: string; hex: string }> = {
  healthy: { en: "Healthy", ar: "سليم", hex: "#1F7A4D" },
  warning: { en: "Warning", ar: "تحذير", hex: "#B4690E" },
  faulty: { en: "Faulty", ar: "عاطل", hex: "#B3372E" },
};
