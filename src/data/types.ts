export type Region = "Abu Dhabi City" | "Al Dhafra" | "Al Ain";
export type MosqueClass = "Jame'e (Friday)" | "Jame'e" | "Daily";
export type HvacMode = "plan" | "manual";
export type ZoneId = "main_hall" | "women_hall" | "wudu" | "courtyard" | "minaret" | "stores";

export type Bilingual = { en: string; ar: string };

export type MonthlyUtility = {
  /** Short month label, e.g. "Sep 25". */
  month: string;
  month_ar: string;
  electricity_kwh: number;
  electricity_aed: number;
  water_m3: number;
  water_aed: number;
};

export type Mosque = {
  id: string;
  name_en: string;
  name_ar: string;
  region: Region;
  district: string;
  district_ar: string;
  class: MosqueClass;
  class_ar: string;
  capacity: number;
  area_m2: number;
  hvac: HvacMode;
  contractor: string;
  contractor_ar: string;
  compliance: number;
  comfort: number;
  lat: number;
  lng: number;
  footfall_today: number;
  saving_kwh_day: number;
  saving_pct: number;
  saving_aed_year: number;
  utilities: MonthlyUtility[];
};

export type RoleId =
  | "hq_admin"
  | "regional_supervisor"
  | "imam"
  | "muezzin"
  | "caretaker"
  | "fm_technician"
  | "fm_supervisor";

export type DeviceClass = "phone" | "ipad" | "laptop";

export type Person = {
  id: string;
  name_en: string;
  name_ar: string;
  role: RoleId;
  role_en: string;
  role_ar: string;
  scope_en: string;
  scope_ar: string;
  /** One line on what they actually do. */
  does_en: string;
  does_ar: string;
  device: DeviceClass;
  mosques: string[];
  contractor?: string;
  permission_count: number;
  initials: string;
};

export type Severity = "critical" | "high" | "medium" | "low";
export type TicketStatus =
  | "reported"
  | "assigned"
  | "in_progress"
  | "escalated"
  | "emergency_dispatched"
  | "closed";
export type Band = "do_now" | "escalate" | "batch" | "plan";

export type RankFactor = {
  name_en: string;
  name_ar: string;
  points: number;
  max: number;
  note_en: string;
  note_ar: string;
};

export type TimelineEntry = {
  actor_en: string;
  actor_ar: string;
  role_en: string;
  role_ar: string;
  change_en: string;
  change_ar: string;
  timestamp: string;
};

export type WorkOrder = {
  id: string;
  mosque_id: string;
  zone: ZoneId;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  category: "hvac" | "plumbing" | "lighting" | "cleaning" | "safety" | "other";
  category_en: string;
  category_ar: string;
  severity: Severity;
  status: TicketStatus;
  sla_hours: number;
  /** Negative means breached by that many hours. */
  sla_remaining: number;
  assignee_en?: string;
  assignee_ar?: string;
  raised_by_en: string;
  raised_by_ar: string;
  impact: number;
  feasibility: number;
  band: Band;
  score: number;
  impact_factors: RankFactor[];
  feasibility_factors: RankFactor[];
  band_headline_en: string;
  band_headline_ar: string;
  schedule_en: string;
  schedule_ar: string;
  flags_en: string[];
  flags_ar: string[];
  photo_hint_en: string;
  photo_hint_ar: string;
  created: string;
  timeline: TimelineEntry[];
};

export type Prayer = {
  key: "fajr" | "shuruq" | "dhuhr" | "asr" | "maghrib" | "isha";
  name_en: string;
  name_ar: string;
  adhan: string;
  iqamah?: string;
  iqamah_offset?: number;
};

export type Zone = {
  id: ZoneId;
  name_en: string;
  name_ar: string;
};
