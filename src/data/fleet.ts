import { mosques } from "./mosques";
import { workOrders } from "./workOrders";
import type { RoleId } from "./types";

export const contractors = [
  { name: "Al Diyar FM Services", name_ar: "الديار لخدمات المرافق", mosques: 7 },
  { name: "Gulf Crescent Maintenance", name_ar: "هلال الخليج للصيانة", mosques: 2 },
  { name: "Oasis Facilities Co.", name_ar: "شركة الواحة للمرافق", mosques: 3 },
];

const latest = <T,>(arr: T[]) => arr[arr.length - 1] as T;

export const fleetStats = {
  avg_compliance: Math.round(mosques.reduce((s, m) => s + m.compliance, 0) / mosques.length),
  open_faults: workOrders.filter((w) => w.status !== "closed").length,
  breaching: workOrders.filter((w) => w.sla_remaining < 0).length,
  electricity_aed: mosques.reduce((s, m) => s + latest(m.utilities).electricity_aed, 0),
  water_aed: mosques.reduce((s, m) => s + latest(m.utilities).water_aed, 0),
  footfall: mosques.reduce((s, m) => s + m.footfall_today, 0),
  variance_flags: 1,
  saving_kwh_day: mosques.reduce((s, m) => s + m.saving_kwh_day, 0),
  saving_aed_year: mosques.reduce((s, m) => s + m.saving_aed_year, 0),
  manual_mosques: mosques.filter((m) => m.hvac === "manual").length,
  cdd: 18.4,
};

export const complianceRank = [...mosques].sort((a, b) => b.compliance - a.compliance);

export type PpmItem = {
  id: string;
  mosque_id: string;
  title_en: string;
  title_ar: string;
  due_en: string;
  due_ar: string;
  state: "overdue" | "this_week" | "scheduled";
};

export const ppm: PpmItem[] = [
  {
    id: "ppm-01",
    mosque_id: "m-005",
    title_en: "Quarterly AC coil clean",
    title_ar: "تنظيف ملفات التكييف الربع سنوي",
    due_en: "Overdue by 4 days",
    due_ar: "متأخر أربعة أيام",
    state: "overdue",
  },
  {
    id: "ppm-02",
    mosque_id: "m-002",
    title_en: "Fire extinguisher check",
    title_ar: "فحص طفايات الحريق",
    due_en: "Due Saturday, 29 August",
    due_ar: "السبت ٢٩ أغسطس",
    state: "this_week",
  },
  {
    id: "ppm-03",
    mosque_id: "m-001",
    title_en: "Pre-Ramadan AC inspection",
    title_ar: "فحص التكييف قبل رمضان",
    due_en: "Due Sunday, 30 August",
    due_ar: "الأحد ٣٠ أغسطس",
    state: "this_week",
  },
  {
    id: "ppm-04",
    mosque_id: "m-004",
    title_en: "Wudu drainage flush",
    title_ar: "تنظيف تصريف الوضوء",
    due_en: "Due 3 September",
    due_ar: "٣ سبتمبر",
    state: "scheduled",
  },
  {
    id: "ppm-05",
    mosque_id: "m-003",
    title_en: "Carpet deep clean",
    title_ar: "تنظيف عميق للسجاد",
    due_en: "Due 7 September",
    due_ar: "٧ سبتمبر",
    state: "scheduled",
  },
  {
    id: "ppm-06",
    mosque_id: "m-006",
    title_en: "PA system test",
    title_ar: "اختبار نظام الصوت",
    due_en: "Due 9 September",
    due_ar: "٩ سبتمبر",
    state: "scheduled",
  },
];

export const roleColumns: { id: RoleId; label_en: string; label_ar: string }[] = [
  { id: "hq_admin", label_en: "HQ admin", label_ar: "مسؤول المقر" },
  { id: "regional_supervisor", label_en: "Regional sup.", label_ar: "مشرف إقليمي" },
  { id: "imam", label_en: "Imam", label_ar: "إمام" },
  { id: "muezzin", label_en: "Muezzin", label_ar: "مؤذن" },
  { id: "caretaker", label_en: "Caretaker", label_ar: "خادم المسجد" },
  { id: "fm_technician", label_en: "FM technician", label_ar: "فني صيانة" },
  { id: "fm_supervisor", label_en: "FM supervisor", label_ar: "مشرف صيانة" },
];

export type PermissionRow = {
  group: "maintenance" | "cooling" | "oversight";
  label_en: string;
  label_ar: string;
  granted: RoleId[];
};

export const permissionMatrix: PermissionRow[] = [
  {
    group: "maintenance",
    label_en: "Raise a work order",
    label_ar: "فتح أمر عمل",
    granted: ["regional_supervisor", "imam", "muezzin", "caretaker", "fm_supervisor"],
  },
  {
    group: "maintenance",
    label_en: "Assign a technician",
    label_ar: "إسناد فني",
    granted: ["regional_supervisor", "fm_supervisor"],
  },
  {
    group: "maintenance",
    label_en: "Start and close a job",
    label_ar: "بدء أمر العمل وإغلاقه",
    granted: ["fm_technician"],
  },
  {
    group: "maintenance",
    label_en: "Verify a completed fix",
    label_ar: "التحقق من الإصلاح",
    granted: ["imam", "caretaker", "regional_supervisor"],
  },
  {
    group: "maintenance",
    label_en: "Escalate past SLA",
    label_ar: "التصعيد بعد تجاوز الخدمة",
    granted: ["regional_supervisor", "fm_supervisor", "hq_admin"],
  },
  {
    group: "cooling",
    label_en: "View the cooling plan",
    label_ar: "عرض خطة التبريد",
    granted: ["hq_admin", "regional_supervisor", "fm_supervisor", "imam"],
  },
  {
    group: "cooling",
    label_en: "Accept or reject a plan",
    label_ar: "قبول الخطة أو رفضها",
    granted: ["hq_admin", "regional_supervisor"],
  },
  {
    group: "cooling",
    label_en: "Record a meter reading",
    label_ar: "تسجيل قراءة العداد",
    granted: ["fm_technician", "caretaker"],
  },
  {
    group: "oversight",
    label_en: "See the whole fleet",
    label_ar: "عرض الأسطول كاملا",
    granted: ["hq_admin"],
  },
  {
    group: "oversight",
    label_en: "Export KPI evidence",
    label_ar: "تصدير أدلة المؤشرات",
    granted: ["hq_admin", "regional_supervisor", "fm_supervisor"],
  },
  {
    group: "oversight",
    label_en: "Manage users and scope",
    label_ar: "إدارة المستخدمين والنطاق",
    granted: ["hq_admin"],
  },
  {
    group: "oversight",
    label_en: "Read the audit trail",
    label_ar: "قراءة سجل التدقيق",
    granted: ["hq_admin", "regional_supervisor"],
  },
];

export type AuditEntry = {
  timestamp: string;
  actor_en: string;
  actor_ar: string;
  role_en: string;
  role_ar: string;
  action_en: string;
  action_ar: string;
  object: string;
};

export const auditTrail: AuditEntry[] = [
  {
    timestamp: "27 Aug 2026 09:31:04",
    actor_en: "Joseph Mathew",
    actor_ar: "جوزيف ماثيو",
    role_en: "FM supervisor",
    role_ar: "مشرف صيانة",
    action_en: "Dispatched emergency crew",
    action_ar: "إرسال فريق طوارئ",
    object: "t-1004",
  },
  {
    timestamp: "27 Aug 2026 09:12:47",
    actor_en: "Fire panel",
    actor_ar: "لوحة الإنذار",
    role_en: "Automatic",
    role_ar: "تلقائي",
    action_en: "Raised critical work order",
    action_ar: "فتح أمر عمل حرج",
    object: "t-1004",
  },
  {
    timestamp: "27 Aug 2026 08:15:22",
    actor_en: "Saif Al Mazrouei",
    actor_ar: "سيف المزروعي",
    role_en: "Regional supervisor",
    role_ar: "مشرف إقليمي",
    action_en: "Accepted escalation",
    action_ar: "قبول التصعيد",
    object: "t-1003",
  },
  {
    timestamp: "27 Aug 2026 07:05:10",
    actor_en: "Joseph Mathew",
    actor_ar: "جوزيف ماثيو",
    role_en: "FM supervisor",
    role_ar: "مشرف صيانة",
    action_en: "Assigned technician Ramesh Kumar",
    action_ar: "إسناد الفني راميش كومار",
    object: "t-1001",
  },
  {
    timestamp: "27 Aug 2026 06:49:33",
    actor_en: "Sheikh Yousef Al Marzooqi",
    actor_ar: "الشيخ يوسف المرزوقي",
    role_en: "Imam",
    role_ar: "إمام",
    action_en: "Accepted suggested category",
    action_ar: "قبول التصنيف المقترح",
    object: "t-1001",
  },
  {
    timestamp: "27 Aug 2026 06:48:51",
    actor_en: "Sheikh Yousef Al Marzooqi",
    actor_ar: "الشيخ يوسف المرزوقي",
    role_en: "Imam",
    role_ar: "إمام",
    action_en: "Raised work order",
    action_ar: "فتح أمر عمل",
    object: "t-1001",
  },
  {
    timestamp: "27 Aug 2026 06:02:00",
    actor_en: "Nasma",
    actor_ar: "نسمة",
    role_en: "System",
    role_ar: "النظام",
    action_en: "SLA breach recorded",
    action_ar: "تسجيل تجاوز مستوى الخدمة",
    object: "t-1003",
  },
  {
    timestamp: "27 Aug 2026 05:40:19",
    actor_en: "Ahmed Al Mansoori",
    actor_ar: "أحمد المنصوري",
    role_en: "HQ admin",
    role_ar: "مسؤول المقر",
    action_en: "Accepted cooling plan",
    action_ar: "قبول خطة التبريد",
    object: "m-004",
  },
  {
    timestamp: "26 Aug 2026 17:31:08",
    actor_en: "Noor Alam",
    actor_ar: "نور عالم",
    role_en: "Caretaker",
    role_ar: "خادم المسجد",
    action_en: "Raised work order",
    action_ar: "فتح أمر عمل",
    object: "t-1002",
  },
  {
    timestamp: "26 Aug 2026 13:21:02",
    actor_en: "Nasma",
    actor_ar: "نسمة",
    role_en: "System",
    role_ar: "النظام",
    action_en: "Banded work order as batch",
    action_ar: "تصنيف أمر العمل كعمل مجمّع",
    object: "t-1005",
  },
];
