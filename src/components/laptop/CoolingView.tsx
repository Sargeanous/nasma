import { useState } from "react";
import { AlertTriangle, Snowflake, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/lib/direction";
import { BidiText } from "@/lib/bidi";
import {
  Card,
  CardHeader,
  Chip,
  DataTable,
  StatTile,
  type Column,
} from "@/components/nasma/primitives";
import {
  anomalies,
  comfortDelivered,
  coolingSchedule,
  daySeries,
  formatAED,
  mosque,
  mosques,
  prayerBlocks,
  type ScheduleRow,
} from "@/data";

export function CoolingView() {
  const { t } = useDirection();
  const [mosqueId, setMosqueId] = useState("m-001");
  const m = mosque(mosqueId);

  const columns: Column<ScheduleRow>[] = [
    {
      key: "prayer",
      header: t("Prayer", "الصلاة"),
      render: (r) => <span className="t-body-sm text-ink">{t(r.name_en, r.name_ar)}</span>,
    },
    {
      key: "start",
      header: t("Pre-cool starts", "يبدأ التبريد"),
      numeric: true,
      render: (r) => <BidiText className="tnum">{r.start}</BidiText>,
    },
    {
      key: "lead",
      header: t("Lead", "المهلة"),
      numeric: true,
      render: (r) => (
        <BidiText className="tnum">{t(`${r.lead_min} min`, `${r.lead_min} دقيقة`)}</BidiText>
      ),
    },
    {
      key: "target",
      header: t("Target", "المستهدف"),
      numeric: true,
      render: (r) => <BidiText className="tnum">{r.target}&deg;</BidiText>,
    },
    {
      key: "hold",
      header: t("Hold between", "بين الصلوات"),
      numeric: true,
      render: (r) => <BidiText className="tnum">{r.hold}&deg;</BidiText>,
    },
    {
      key: "guard",
      header: t("Humidity guard", "حارس الرطوبة"),
      render: (r) =>
        r.humidity_guard ? (
          <Chip tone="gold" size="sm">
            {t("On", "مفعل")}
          </Chip>
        ) : (
          <span className="t-caption text-muted-ink">{t("Off", "غير مفعل")}</span>
        ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="cooling-mosque" className="t-micro text-muted-ink">
          {t("MOSQUE", "المسجد")}
        </label>
        <select
          id="cooling-mosque"
          value={mosqueId}
          onChange={(e) => setMosqueId(e.target.value)}
          className="min-h-10 rounded-[9px] border border-hairline bg-card px-3 t-body-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
        >
          {mosques.map((x) => (
            <option key={x.id} value={x.id}>
              {t(x.name_en, x.name_ar)}
            </option>
          ))}
        </select>
        <Chip tone={m.hvac === "manual" ? "warning" : "green"}>
          {m.hvac === "manual"
            ? t("Runs manually today", "يعمل يدويا اليوم")
            : t("Runs on the prayer plan", "يعمل وفق خطة الصلاة")}
        </Chip>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label={t("Saving today", "التوفير اليوم")}
          value={`${m.saving_kwh_day} ${t("kWh", "ك.و.س")}`}
          tone="green"
        />
        <StatTile
          label={t("Against baseline", "مقابل خط الأساس")}
          value={`${m.saving_pct}%`}
          tone="green"
        />
        <StatTile
          label={t("Yearly at this rate", "سنويا بهذا المعدل")}
          value={formatAED(m.saving_aed_year)}
        />
        <StatTile
          label={t("Comfort at iqamah", "الراحة عند الإقامة")}
          value={`${m.comfort}%`}
          tone={m.comfort >= 90 ? "green" : "warning"}
        />
      </div>

      <Card>
        <CardHeader
          title={t("The cooling day", "يوم التبريد")}
          sub={t(
            "Indoor against setpoint, in fifteen minute steps. Shaded bands are the pre-cool windows before each iqamah.",
            "الحرارة الداخلية مقابل نقطة الضبط كل خمس عشرة دقيقة. المناطق المظللة هي نوافذ التبريد المسبق قبل كل إقامة.",
          )}
        />
        <DayTrace />
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader
            title={t("The plan", "الخطة")}
            sub={t("What the system will do tomorrow.", "ما سينفذه النظام غدا.")}
          />
          <div className="mt-3">
            <DataTable columns={columns} rows={coolingSchedule} rowKey={(r) => r.name_en} />
          </div>
          <p className="mt-3 t-caption text-muted-ink">
            {t(
              "Comfort is judged at iqamah, not at the average of the day.",
              "تقاس الراحة عند الإقامة، لا بمتوسط اليوم.",
            )}
          </p>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title={t("Comfort delivered", "الراحة المحققة")} />
            <ul className="mt-3 space-y-2">
              {comfortDelivered.map((c) => (
                <li
                  key={c.name_en}
                  className="flex items-center justify-between gap-3 rounded-[9px] border border-hairline bg-sand-2/50 px-3 py-2"
                >
                  <span className="t-body-sm text-ink">{t(c.name_en, c.name_ar)}</span>
                  <span className="flex items-center gap-2">
                    <BidiText
                      className={cn("t-numeral-sm", c.met ? "text-green" : "text-warning")}
                    >
                      {c.at_iqamah.toFixed(1)}&deg;
                    </BidiText>
                    <Chip tone={c.met ? "green" : "warning"} size="sm">
                      {c.met ? t("Met", "تحقق") : t("Over", "تجاوز")}
                    </Chip>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title={t("What went wrong", "ما الذي اختل")} />
            <ul className="mt-3 space-y-3">
              {anomalies.map((a) => (
                <li key={a.title_en} className="border-t border-hairline pt-3 first:border-t-0 first:pt-0">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle
                      className="mt-0.5 size-4 shrink-0 stroke-[1.5] text-warning"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="t-body-sm font-medium text-ink">{t(a.title_en, a.title_ar)}</p>
                      <p className="mt-0.5 t-caption text-muted-ink">
                        {t(a.detail_en, a.detail_ar)}
                      </p>
                      <span className="mt-1.5 inline-flex items-center gap-1.5 t-caption text-green">
                        {a.resolution === "plan" ? (
                          <Snowflake className="size-3.5 stroke-[1.5]" aria-hidden="true" />
                        ) : (
                          <Wrench className="size-3.5 stroke-[1.5]" aria-hidden="true" />
                        )}
                        {a.resolution === "plan"
                          ? t("The plan fixes it", "الخطة تعالجها")
                          : t("A technician is needed", "يحتاج فنيا")}
                        {a.ticket ? <BidiText>{` (${a.ticket})`}</BidiText> : null}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DayTrace() {
  const { t } = useDirection();
  const W = 1000;
  const H = 300;
  const padL = 44;
  const padR = 20;
  const padT = 18;
  const padB = 34;
  const minTemp = 18;
  const maxTemp = 44;

  const x = (min: number) => padL + (min / 1440) * (W - padL - padR);
  const y = (temp: number) =>
    padT + (1 - (temp - minTemp) / (maxTemp - minTemp)) * (H - padT - padB);

  const line = (key: "indoor" | "setpoint" | "outdoor") =>
    daySeries.map((s, i) => `${i === 0 ? "M" : "L"}${x(s.t).toFixed(1)},${y(s[key]).toFixed(1)}`).join(" ");

  return (
    <figure className="mt-3">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={t(
          "Indoor temperature tracks the setpoint through the day, with pre-cool windows before each prayer.",
          "الحرارة الداخلية تتبع نقطة الضبط خلال اليوم مع نوافذ تبريد مسبق قبل كل صلاة.",
        )}
      >
        {prayerBlocks.map((b) => (
          <g key={b.name_en}>
            <rect
              x={x(b.precool_start)}
              y={padT}
              width={x(b.end) - x(b.precool_start)}
              height={H - padT - padB}
              fill="var(--color-green)"
              opacity={0.07}
            />
            <line
              x1={x(b.iqamah)}
              y1={padT}
              x2={x(b.iqamah)}
              y2={H - padB}
              stroke="var(--color-gold)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={x(b.iqamah)}
              y={padT - 5}
              textAnchor="middle"
              fontSize={9}
              fill="var(--color-muted-ink)"
            >
              {t(b.name_en, b.name_ar)}
            </text>
          </g>
        ))}

        {[20, 25, 30, 35, 40].map((temp) => (
          <g key={temp}>
            <line
              x1={padL}
              y1={y(temp)}
              x2={W - padR}
              y2={y(temp)}
              stroke="var(--color-hairline)"
            />
            <text x={padL - 8} y={y(temp) + 3} textAnchor="end" fontSize={9} fill="var(--color-muted-ink)">
              {temp}&deg;
            </text>
          </g>
        ))}

        {[0, 6, 12, 18, 24].map((h) => (
          <text
            key={h}
            x={x(h * 60)}
            y={H - padB + 16}
            textAnchor="middle"
            fontSize={9}
            fill="var(--color-muted-ink)"
          >
            {String(h).padStart(2, "0")}:00
          </text>
        ))}

        <path d={line("outdoor")} fill="none" stroke="var(--color-muted-ink)" strokeWidth={1.2} opacity={0.5} />
        <path
          d={line("setpoint")}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth={1.4}
          strokeDasharray="5 4"
        />
        <path d={line("indoor")} fill="none" stroke="var(--color-green)" strokeWidth={2.2} />
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 t-caption text-muted-ink">
        <LegendKey colour="var(--color-green)" label={t("Indoor", "الداخلية")} />
        <LegendKey colour="var(--color-gold)" label={t("Setpoint", "نقطة الضبط")} dashed />
        <LegendKey colour="var(--color-muted-ink)" label={t("Outdoor", "الخارجية")} />
        <span>{t("Shaded, pre-cool window", "المظلل، نافذة التبريد المسبق")}</span>
      </figcaption>
    </figure>
  );
}

function LegendKey({ colour, label, dashed }: { colour: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block h-0 w-6 border-t-2"
        style={{ borderColor: colour, borderStyle: dashed ? "dashed" : "solid" }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
