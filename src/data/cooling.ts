import { prayerTimes } from "./prayer";

export type DaySample = {
  /** Minutes from midnight. */
  t: number;
  indoor: number;
  setpoint: number;
  outdoor: number;
  draw_kw: number;
};

export type PrayerBlock = {
  name_en: string;
  name_ar: string;
  precool_start: number;
  iqamah: number;
  end: number;
};

const toMin = (t: string) => {
  const [h = 0, m = 0] = t.split(":").map(Number);
  return h * 60 + m;
};

export const prayerBlocks: PrayerBlock[] = prayerTimes
  .filter((p) => p.iqamah)
  .map((p) => {
    const iq = toMin(p.iqamah as string);
    const lead = p.key === "fajr" ? 35 : 45;
    return {
      name_en: p.name_en,
      name_ar: p.name_ar,
      precool_start: iq - lead,
      iqamah: iq,
      end: iq + 35,
    };
  });

function inBlock(t: number) {
  return prayerBlocks.find((b) => t >= b.precool_start && t <= b.end);
}

/** Deterministic day trace at 15 minute resolution. */
export const daySeries: DaySample[] = Array.from({ length: 97 }, (_, i) => {
  const t = i * 15;
  const hour = t / 60;
  const outdoor = 33 + 8 * Math.sin(((hour - 9) / 24) * Math.PI * 2);
  const block = inBlock(t);
  const setpoint = block ? 23 : 28;
  const occupancy = block && t >= block.iqamah - 10 && t <= block.end ? 1 : 0;
  const drift = block ? Math.max(0, (block.iqamah - t) / 60) * 1.6 : 1.2;
  const indoor = Math.round((setpoint + drift + occupancy * 0.6) * 10) / 10;
  const draw = block ? 42 + (occupancy ? 18 : 26) : 14 + Math.max(0, outdoor - 33) * 1.4;
  return {
    t,
    indoor,
    setpoint,
    outdoor: Math.round(outdoor * 10) / 10,
    draw_kw: Math.round(draw * 10) / 10,
  };
});

export type ScheduleRow = {
  name_en: string;
  name_ar: string;
  start: string;
  lead_min: number;
  target: number;
  hold: number;
  humidity_guard: boolean;
};

const fmt = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export const coolingSchedule: ScheduleRow[] = prayerBlocks.map((b, i) => ({
  name_en: b.name_en,
  name_ar: b.name_ar,
  start: fmt(b.precool_start),
  lead_min: b.iqamah - b.precool_start,
  target: 23,
  hold: 28,
  humidity_guard: i === 3 || i === 4,
}));

export type ComfortCard = {
  name_en: string;
  name_ar: string;
  at_iqamah: number;
  target: number;
  met: boolean;
};

export const comfortDelivered: ComfortCard[] = [
  { name_en: "Fajr", name_ar: "الفجر", at_iqamah: 22.8, target: 23, met: true },
  { name_en: "Dhuhr", name_ar: "الظهر", at_iqamah: 23.1, target: 23, met: true },
  { name_en: "Asr", name_ar: "العصر", at_iqamah: 24.6, target: 23, met: false },
  { name_en: "Maghrib", name_ar: "المغرب", at_iqamah: 23.0, target: 23, met: true },
  { name_en: "Isha", name_ar: "العشاء", at_iqamah: 22.9, target: 23, met: true },
];

export type Anomaly = {
  title_en: string;
  title_ar: string;
  detail_en: string;
  detail_ar: string;
  resolution: "plan" | "technician";
  ticket?: string;
};

export const anomalies: Anomaly[] = [
  {
    title_en: "Asr pre-cool starts too late",
    title_ar: "بدء التبريد المسبق للعصر متأخر",
    detail_en: "Lead time of 45 min is short on days above 41 degrees. Plan adds 15 min.",
    detail_ar: "مهلة ٤٥ دقيقة قصيرة في الأيام فوق ٤١ درجة. الخطة تضيف ١٥ دقيقة.",
    resolution: "plan",
  },
  {
    title_en: "Night hold drifting to 31 degrees",
    title_ar: "حرارة الليل ترتفع إلى ٣١ درجة",
    detail_en: "Hold setpoint is being overridden locally. Plan restores the 28 degree hold.",
    detail_ar: "يتم تجاوز نقطة الضبط محليا. الخطة تعيد الحد إلى ٢٨ درجة.",
    resolution: "plan",
  },
  {
    title_en: "Women's hall return air 4 degrees high",
    title_ar: "هواء الراجع في مصلى النساء أعلى بأربع درجات",
    detail_en: "Airflow restriction consistent with a loaded filter. Work order raised.",
    detail_ar: "انخفاض التدفق يوافق فلترا محملا. تم فتح أمر عمل.",
    resolution: "technician",
    ticket: "t-1001",
  },
];
