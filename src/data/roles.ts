import type { DeviceClass, RoleId } from "./types";

export type RoleCard = {
  id: RoleId;
  name_en: string;
  name_ar: string;
  does_en: string;
  does_ar: string;
  scope_en: string;
  scope_ar: string;
  device: DeviceClass;
  /** Icon key resolved in the UI layer. */
  icon:
    | "building"
    | "map"
    | "clipboard"
    | "book"
    | "megaphone"
    | "broom"
    | "wrench";
  /** The person the demo signs in as for this role. */
  person_id: string;
};

export const roleCards: RoleCard[] = [
  {
    id: "hq_admin",
    name_en: "Awqaf HQ Administrator",
    name_ar: "مدير المقر",
    does_en: "Reads the whole fleet and answers for it.",
    does_ar: "يتابع الأسطول كاملا ويتحمل مسؤوليته.",
    scope_en: "All 12 mosques",
    scope_ar: "جميع المساجد الاثني عشر",
    device: "laptop",
    icon: "building",
    person_id: "p-001",
  },
  {
    id: "regional_supervisor",
    name_en: "Regional supervisor",
    name_ar: "مشرف إقليمي",
    does_en: "Clears what a single mosque cannot clear alone.",
    does_ar: "يعالج ما يتعذر على المسجد الواحد حله.",
    scope_en: "One region",
    scope_ar: "منطقة واحدة",
    device: "laptop",
    icon: "map",
    person_id: "p-002",
  },
  {
    id: "fm_supervisor",
    name_en: "FM contract supervisor",
    name_ar: "مشرف عقد",
    does_en: "Assigns the crew and guards the service level.",
    does_ar: "يوزع الفرق ويحمي مستوى الخدمة.",
    scope_en: "One contract portfolio",
    scope_ar: "محفظة عقد واحدة",
    device: "ipad",
    icon: "clipboard",
    person_id: "p-007",
  },
  {
    id: "imam",
    name_en: "Imam",
    name_ar: "إمام",
    does_en: "Leads the prayers and reports what the hall shows.",
    does_ar: "يؤم الصلوات ويبلغ عن حال المصلى.",
    scope_en: "His own mosque",
    scope_ar: "مسجده",
    device: "phone",
    icon: "book",
    person_id: "p-003",
  },
  {
    id: "muezzin",
    name_en: "Muezzin",
    name_ar: "مؤذن",
    does_en: "Calls the adhan and opens the mosque before prayer.",
    does_ar: "يرفع الأذان ويفتح المسجد قبل الصلاة.",
    scope_en: "His own mosque",
    scope_ar: "مسجده",
    device: "phone",
    icon: "megaphone",
    person_id: "p-004",
  },
  {
    id: "caretaker",
    name_en: "Caretaker",
    name_ar: "قيّم",
    does_en: "Keeps the mosque clean and logs its daily condition.",
    does_ar: "يحافظ على نظافة المسجد ويسجل حالته اليومية.",
    scope_en: "His own mosque",
    scope_ar: "مسجده",
    device: "phone",
    icon: "broom",
    person_id: "p-005",
  },
  {
    id: "fm_technician",
    name_en: "FM technician",
    name_ar: "فني صيانة",
    does_en: "Does the work, attaches the evidence, closes the job.",
    does_ar: "ينفذ العمل ويرفق الدليل ويغلق أمر العمل.",
    scope_en: "Up to 5 assigned mosques",
    scope_ar: "حتى خمسة مساجد مسندة",
    device: "phone",
    icon: "wrench",
    person_id: "p-006",
  },
];

export const deviceLabels: Record<DeviceClass, { en: string; ar: string }> = {
  laptop: { en: "Laptop", ar: "حاسوب محمول" },
  ipad: { en: "iPad", ar: "آيباد" },
  phone: { en: "Phone", ar: "هاتف" },
};

export const roleById = Object.fromEntries(roleCards.map((r) => [r.id, r])) as Record<
  RoleId,
  RoleCard
>;
