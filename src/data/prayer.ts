import type { Prayer, Zone } from "./types";

function addMinutes(time: string, minutes: number): string {
  const [h = 0, m = 0] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export const iqamahOffsets = { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 };

export const prayerTimes: Prayer[] = [
  {
    key: "fajr",
    name_en: "Fajr",
    name_ar: "الفجر",
    adhan: "04:42",
    iqamah: addMinutes("04:42", 20),
    iqamah_offset: 20,
  },
  { key: "shuruq", name_en: "Shuruq", name_ar: "الشروق", adhan: "05:59" },
  {
    key: "dhuhr",
    name_en: "Dhuhr",
    name_ar: "الظهر",
    adhan: "12:27",
    iqamah: addMinutes("12:27", 15),
    iqamah_offset: 15,
  },
  {
    key: "asr",
    name_en: "Asr",
    name_ar: "العصر",
    adhan: "15:55",
    iqamah: addMinutes("15:55", 15),
    iqamah_offset: 15,
  },
  {
    key: "maghrib",
    name_en: "Maghrib",
    name_ar: "المغرب",
    adhan: "18:49",
    iqamah: addMinutes("18:49", 10),
    iqamah_offset: 10,
  },
  {
    key: "isha",
    name_en: "Isha",
    name_ar: "العشاء",
    adhan: "20:05",
    iqamah: addMinutes("20:05", 15),
    iqamah_offset: 15,
  },
];

/** Fixed "now" so every surface tells the same story. */
export const NOW_HHMM = "14:20";

export function nextPrayer(now: string = NOW_HHMM): Prayer {
  const toMin = (t: string) => {
    const [h = 0, m = 0] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const upcoming = prayerTimes.find((p) => toMin(p.adhan) > toMin(now));
  return upcoming ?? (prayerTimes[0] as Prayer);
}

export const dates = {
  gregorian_en: "Thursday, 27 August 2026",
  gregorian_ar: "الخميس، ٢٧ أغسطس ٢٠٢٦",
  hijri_en: "14 Rabi I 1448 AH",
  hijri_ar: "١٤ ربيع الأول ١٤٤٨ هـ",
};

export const zones: Zone[] = [
  { id: "main_hall", name_en: "Main hall", name_ar: "المصلى الرئيسي" },
  { id: "women_hall", name_en: "Women's hall", name_ar: "مصلى النساء" },
  { id: "wudu", name_en: "Ablution", name_ar: "الوضوء" },
  { id: "courtyard", name_en: "Courtyard", name_ar: "الساحة" },
  { id: "minaret", name_en: "Minaret", name_ar: "المئذنة" },
  { id: "stores", name_en: "Stores", name_ar: "المخازن" },
];
