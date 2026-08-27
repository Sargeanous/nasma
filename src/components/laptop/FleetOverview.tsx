import {
  AlertTriangle,
  CalendarClock,
  ChevronRight,
  Droplets,
  Flag,
  Gauge,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { useDirection } from "@/lib/direction";
import { BidiText } from "@/lib/bidi";
import { Card, CardHeader, Chip, Dot, Meter, StatTile } from "@/components/nasma/primitives";
import {
  complianceRank,
  fleetStats,
  formatAED,
  formatNumber,
  mosque,
  mosques,
  mosqueUrgency,
  ppm,
  rankedOrders,
  regionLabels,
  regions,
  zoneName,
} from "@/data";
import type { Mosque } from "@/data/types";

export function FleetOverview({ onOpenMosque }: { onOpenMosque: (id: string) => void }) {
  const { t } = useDirection();
  const urgent = rankedOrders.filter((w) => w.status !== "closed").slice(0, 4);
  const due = ppm.filter((p) => p.state !== "scheduled");
  const best = complianceRank[0] as Mosque;
  const weakest = complianceRank[complianceRank.length - 1] as Mosque;

  return (
    <div className="space-y-5">
      <section aria-label={t("Fleet figures", "أرقام الأسطول")}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatTile
            label={t("AVERAGE COMPLIANCE", "متوسط الالتزام")}
            value={`${fleetStats.avg_compliance}%`}
            sub={t("12 mosques inspected", "١٢ مسجدا تم تفتيشها")}
            tone="green"
            icon={<Gauge className="size-4 stroke-[1.5]" aria-hidden="true" />}
          />
          <StatTile
            label={t("OPEN FAULTS", "الأعطال المفتوحة")}
            value={fleetStats.open_faults}
            sub={t(
              `${fleetStats.breaching} breaching SLA`,
              `${fleetStats.breaching} تجاوز مستوى الخدمة`,
            )}
            tone="alert"
            icon={<Wrench className="size-4 stroke-[1.5]" aria-hidden="true" />}
          />
          <StatTile
            label={t("ELECTRICITY, MONTH", "الكهرباء، الشهر")}
            value={formatAED(fleetStats.electricity_aed)}
            sub={t("Across all 12 mosques", "عبر المساجد الاثني عشر")}
            tone="gold"
            icon={<Zap className="size-4 stroke-[1.5]" aria-hidden="true" />}
          />
          <StatTile
            label={t("WATER, MONTH", "المياه، الشهر")}
            value={formatAED(fleetStats.water_aed)}
            sub={t("Ablution and grounds", "الوضوء والمرافق")}
            tone="green"
            icon={<Droplets className="size-4 stroke-[1.5]" aria-hidden="true" />}
          />
          <StatTile
            label={t("FOOTFALL TODAY", "الحضور اليوم")}
            value={formatNumber(fleetStats.footfall)}
            sub={t("Counts only, no identities", "أعداد فقط دون هويات")}
            tone="neutral"
            icon={<Users className="size-4 stroke-[1.5]" aria-hidden="true" />}
          />
          <StatTile
            label={t("VARIANCE FLAGS", "تنبيهات الانحراف")}
            value={fleetStats.variance_flags}
            sub={t("Water at Al Mirfa, 22% up", "مياه المرفأ بزيادة ٢٢٪")}
            tone="warning"
            icon={<Flag className="size-4 stroke-[1.5]" aria-hidden="true" />}
          />
        </div>
      </section>

      <section
        className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[12px] border border-hairline bg-sand-2 px-4 py-3"
        aria-label={t("Inspections due", "التفتيش المستحق")}
      >
        <span className="inline-flex items-center gap-2 t-caption text-muted-ink">
          <CalendarClock className="size-4 stroke-[1.5]" aria-hidden="true" />
          {t("Inspections due", "التفتيش المستحق")}
        </span>
        {due.map((item) => (
          <span key={item.id} className="inline-flex items-center gap-2 t-body-sm text-ink">
            <Dot
              tone={item.state === "overdue" ? "alert" : "warning"}
              label={
                item.state === "overdue" ? t("Overdue", "متأخر") : t("This week", "هذا الأسبوع")
              }
            />
            {t(item.title_en, item.title_ar)}
            <span className="t-caption text-muted-ink">
              {t(mosque(item.mosque_id).name_en, mosque(item.mosque_id).name_ar)}
            </span>
          </span>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader
            title={t("Needs attention now", "يحتاج انتباها الآن")}
            sub={t(
              "Ranked by impact against the time left in the service level.",
              "مرتبة حسب الأثر مقابل الوقت المتبقي في مستوى الخدمة.",
            )}
          />
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {urgent.map((order) => {
              const m = mosque(order.mosque_id);
              const breached = order.sla_remaining < 0;
              return (
                <li key={order.id}>
                  <button
                    type="button"
                    onClick={() => onOpenMosque(order.mosque_id)}
                    className="flex w-full items-start gap-3 rounded-[12px] border border-hairline bg-sand-2/60 p-3 text-start transition-calm hover:bg-sand-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                  >
                    <AlertTriangle
                      className={
                        order.severity === "critical" || breached
                          ? "mt-0.5 size-4 shrink-0 stroke-[1.5] text-alert"
                          : "mt-0.5 size-4 shrink-0 stroke-[1.5] text-warning"
                      }
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <BidiText className="t-caption text-muted-ink">{order.id}</BidiText>
                        <Chip tone={breached ? "alert" : "neutral"} size="sm">
                          {breached
                            ? t(
                                `Breached by ${Math.abs(order.sla_remaining)}h`,
                                `تجاوز بـ ${Math.abs(order.sla_remaining)} ساعة`,
                              )
                            : t(
                                `${order.sla_remaining}h of ${order.sla_hours}h`,
                                `${order.sla_remaining} من ${order.sla_hours} ساعة`,
                              )}
                        </Chip>
                      </span>
                      <span className="mt-1 block truncate t-body-sm font-medium text-ink">
                        {t(order.title_en, order.title_ar)}
                      </span>
                      <span className="mt-0.5 block truncate t-caption text-muted-ink">
                        {t(m.name_en, m.name_ar)}
                        {" | "}
                        {t(zoneName(order.zone).name_en, zoneName(order.zone).name_ar)}
                      </span>
                    </span>
                    <ChevronRight
                      className="icon-directional mt-1 size-4 shrink-0 stroke-[1.5] text-muted-ink"
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title={t("Compliance pulse", "نبض الالتزام")}
            sub={t(
              "Inspection score, weighted by class and capacity.",
              "درجة التفتيش موزونة حسب الفئة والسعة.",
            )}
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <PulseCard
              label={t("Strongest", "الأعلى")}
              m={best}
              tone="success"
              onOpen={onOpenMosque}
            />
            <PulseCard
              label={t("Weakest", "الأدنى")}
              m={weakest}
              tone="warning"
              onOpen={onOpenMosque}
            />
          </div>
          <ul className="mt-4 space-y-2.5">
            {complianceRank.slice(0, 6).map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <span className="w-[46%] truncate t-body-sm text-ink">
                  {t(m.name_en, m.name_ar)}
                </span>
                <Meter
                  value={m.compliance}
                  tone={m.compliance >= 90 ? "success" : m.compliance >= 85 ? "green" : "warning"}
                  className="flex-1"
                  label={t(`Compliance ${m.compliance}%`, `الالتزام ${m.compliance}٪`)}
                />
                <BidiText className="w-10 text-end t-caption text-muted-ink">
                  {m.compliance}%
                </BidiText>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader
          title={t("Mosque registry", "سجل المساجد")}
          sub={t(
            "All 12 mosques under the custody of Awqaf Abu Dhabi.",
            "جميع المساجد الاثني عشر تحت عهدة أوقاف أبوظبي.",
          )}
        />
        <div className="mt-3 grid gap-4 lg:grid-cols-3">
          {regions.map((region) => (
            <section key={region} aria-label={t(region, regionLabels[region]?.ar ?? region)}>
              <h4 className="mb-2 t-micro text-muted-ink">
                {t(region, regionLabels[region]?.ar ?? region)}
              </h4>
              <ul className="space-y-2">
                {mosques
                  .filter((m) => m.region === region)
                  .map((m) => {
                    const urgency = mosqueUrgency(m.id);
                    return (
                      <li key={m.id}>
                        <button
                          type="button"
                          onClick={() => onOpenMosque(m.id)}
                          className="flex w-full items-center gap-3 rounded-[9px] border border-hairline bg-sand-2/50 px-3 py-2 text-start transition-calm hover:bg-sand-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                        >
                          <Dot
                            tone={
                              urgency === "alert"
                                ? "alert"
                                : urgency === "warning"
                                  ? "warning"
                                  : "success"
                            }
                            label={
                              urgency === "alert"
                                ? t("Needs attention", "يحتاج انتباها")
                                : urgency === "warning"
                                  ? t("Open work", "عمل مفتوح")
                                  : t("Clear", "سليم")
                            }
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate t-body-sm text-ink">
                              {t(m.name_en, m.name_ar)}
                            </span>
                            <span className="block truncate t-caption text-muted-ink">
                              {t(m.district, m.district_ar)}
                              {" | "}
                              {t(m.class, m.class_ar)}
                            </span>
                          </span>
                          <BidiText className="t-caption text-muted-ink">{m.compliance}%</BidiText>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader
          title={t("Attendance highlights", "أبرز أرقام الحضور")}
          sub={t("Today, across the fleet.", "اليوم، عبر الأسطول.")}
        />
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[...mosques]
            .sort((a, b) => b.footfall_today - a.footfall_today)
            .slice(0, 4)
            .map((m) => (
              <li
                key={m.id}
                className="rounded-[12px] border border-hairline bg-sand-2/60 px-3 py-2.5"
              >
                <p className="truncate t-caption text-muted-ink">{t(m.name_en, m.name_ar)}</p>
                <p className="t-numeral-sm text-ink">
                  <BidiText>{formatNumber(m.footfall_today)}</BidiText>
                </p>
                <p className="t-caption text-muted-ink">
                  {t(
                    `${Math.round((m.footfall_today / m.capacity) * 100)}% of capacity`,
                    `${Math.round((m.footfall_today / m.capacity) * 100)}٪ من السعة`,
                  )}
                </p>
              </li>
            ))}
        </ul>
        <p className="mt-3 t-caption text-muted-ink">
          {t(
            "Attendance is counted at the door as numbers only. No identities are recorded, stored or shared.",
            "يُحتسب الحضور عند الباب كأعداد فقط. لا تُسجل أي هويات ولا تُحفظ ولا تُشارك.",
          )}
        </p>
      </Card>
    </div>
  );
}

function PulseCard({
  label,
  m,
  tone,
  onOpen,
}: {
  label: string;
  m: Mosque;
  tone: "success" | "warning";
  onOpen: (id: string) => void;
}) {
  const { t } = useDirection();
  return (
    <button
      type="button"
      onClick={() => onOpen(m.id)}
      className="rounded-[12px] border border-hairline bg-sand-2/60 p-3 text-start transition-calm hover:bg-sand-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
    >
      <span className="t-micro text-muted-ink">{label}</span>
      <span className="mt-1 block truncate t-body-sm font-medium text-ink">
        {t(m.name_en, m.name_ar)}
      </span>
      <span className="mt-1 flex items-center gap-2">
        <Dot tone={tone} label={label} />
        <BidiText className="t-numeral-sm text-ink">{m.compliance}%</BidiText>
      </span>
    </button>
  );
}
