import type { RoleId } from "./types";

export type DailyTask = {
  id: string;
  /** OMS reference, the operations manual clause this task comes from. */
  oms: string;
  title_en: string;
  title_ar: string;
  window_en: string;
  window_ar: string;
  roles: RoleId[];
  done: boolean;
};

export const dailyTasks: DailyTask[] = [
  {
    id: "d-01",
    oms: "OMS 2.1.4",
    title_en: "Confirm the hall is ready before Dhuhr",
    title_ar: "تأكيد جاهزية المصلى قبل الظهر",
    window_en: "Before 12:42",
    window_ar: "قبل ١٢:٤٢",
    roles: ["imam", "muezzin", "caretaker"],
    done: true,
  },
  {
    id: "d-02",
    oms: "OMS 3.2.1",
    title_en: "Check the adhan system and microphone",
    title_ar: "فحص نظام الأذان والميكروفون",
    window_en: "Before 15:55",
    window_ar: "قبل ١٥:٥٥",
    roles: ["muezzin", "imam"],
    done: false,
  },
  {
    id: "d-03",
    oms: "OMS 4.1.2",
    title_en: "Carpet and ablution area cleaned",
    title_ar: "تنظيف السجاد ومنطقة الوضوء",
    window_en: "Between Asr and Maghrib",
    window_ar: "بين العصر والمغرب",
    roles: ["caretaker", "imam"],
    done: false,
  },
  {
    id: "d-04",
    oms: "OMS 5.3.0",
    title_en: "Record the Friday sermon topic",
    title_ar: "تسجيل موضوع خطبة الجمعة",
    window_en: "Before Isha",
    window_ar: "قبل العشاء",
    roles: ["imam"],
    done: false,
  },
];

export type Regulation = {
  id: string;
  ref: string;
  title_en: string;
  title_ar: string;
  note_en: string;
  note_ar: string;
};

export const regulations: Regulation[] = [
  {
    id: "r-01",
    ref: "Circular 14 of 2026",
    title_en: "Cooling setpoint during prayer",
    title_ar: "درجة التبريد أثناء الصلاة",
    note_en: "Halls are held at 23 C at iqamah, not colder.",
    note_ar: "تُضبط المصليات على ٢٣ درجة عند الإقامة، لا أبرد.",
  },
  {
    id: "r-02",
    ref: "Circular 9 of 2026",
    title_en: "Friday sermon duration",
    title_ar: "مدة خطبة الجمعة",
    note_en: "Twenty minutes, with the unified topic of the week.",
    note_ar: "عشرون دقيقة، مع الموضوع الموحد للأسبوع.",
  },
  {
    id: "r-03",
    ref: "Circular 2 of 2026",
    title_en: "Reporting a fault",
    title_ar: "الإبلاغ عن عطل",
    note_en: "A photo is required. Safety faults are reported at once.",
    note_ar: "الصورة مطلوبة. وتُبلغ أعطال السلامة فورا.",
  },
];

export type MonthlyItem = {
  id: string;
  title_en: string;
  title_ar: string;
  state: "done" | "pending";
};

export const monthlyMaintenance: MonthlyItem[] = [
  {
    id: "mm-01",
    title_en: "Air conditioning filters inspected",
    title_ar: "فحص مرشحات التكييف",
    state: "done",
  },
  {
    id: "mm-02",
    title_en: "Ablution taps and drainage checked",
    title_ar: "فحص صنابير الوضوء والتصريف",
    state: "done",
  },
  {
    id: "mm-03",
    title_en: "Emergency lighting tested",
    title_ar: "اختبار إنارة الطوارئ",
    state: "pending",
  },
  {
    id: "mm-04",
    title_en: "Carpet condition recorded",
    title_ar: "تسجيل حالة السجاد",
    state: "pending",
  },
  {
    id: "mm-05",
    title_en: "Minaret speakers checked",
    title_ar: "فحص مكبرات المئذنة",
    state: "pending",
  },
];

export type FaultCategory = {
  id: "hvac" | "plumbing" | "lighting" | "cleaning" | "other";
  label_ar: string;
  label_en: string;
};

export const faultCategories: FaultCategory[] = [
  { id: "hvac", label_ar: "تكييف", label_en: "Air conditioning" },
  { id: "plumbing", label_ar: "سباكة", label_en: "Plumbing" },
  { id: "lighting", label_ar: "إنارة", label_en: "Lighting" },
  { id: "cleaning", label_ar: "نظافة", label_en: "Cleaning" },
  { id: "other", label_ar: "أخرى", label_en: "Other" },
];

/** What the photo model proposes. The person keeps the final say. */
export const photoSuggestion = {
  category: "hvac" as const,
  confidence: 0.86,
  description_en: "Ceiling diffuser in the women's hall, weak airflow and visible dust build-up.",
  description_ar: "فتحة تكييف في مصلى النساء، تدفق ضعيف مع تراكم غبار ظاهر.",
};

export type InspectionItem = {
  id: string;
  title_en: string;
  title_ar: string;
  needsPhoto: boolean;
};

export const inspectionItems: InspectionItem[] = [
  {
    id: "i-01",
    title_en: "Filters clean and seated",
    title_ar: "المرشحات نظيفة ومركبة",
    needsPhoto: true,
  },
  {
    id: "i-02",
    title_en: "Condensate drain clear",
    title_ar: "تصريف المكثفات سالك",
    needsPhoto: false,
  },
  {
    id: "i-03",
    title_en: "Return air temperature within range",
    title_ar: "حرارة هواء العودة ضمن النطاق",
    needsPhoto: false,
  },
  {
    id: "i-04",
    title_en: "No unusual noise or vibration",
    title_ar: "لا ضجيج أو اهتزاز غير معتاد",
    needsPhoto: false,
  },
  {
    id: "i-05",
    title_en: "Electrical panel free of alarms",
    title_ar: "اللوحة الكهربائية خالية من الإنذارات",
    needsPhoto: true,
  },
];

export const meterReading = {
  value: 48312,
  unit_en: "kWh",
  unit_ar: "ك.و.س",
  confidence: 0.94,
  previous: 46980,
  meter_en: "Main incomer, DEWA meter 2214-88",
  meter_ar: "العداد الرئيسي، عداد ٢٢١٤-٨٨",
};

export const emergencyLine = {
  en: "Opens an emergency work order and calls the contractor duty phone.",
  ar: "يفتح أمر عمل طارئ ويتصل بهاتف مناوبة المقاول.",
};
