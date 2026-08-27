import { useMemo, useState } from "react";
import { CalendarClock, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/lib/direction";
import { BidiText } from "@/lib/bidi";
import {
  BandChip,
  Card,
  CardHeader,
  Chip,
  Meter,
  SeverityChip,
  StatusChip,
  Timeline,
} from "@/components/nasma/primitives";
import { Button } from "@/components/nasma/Button";
import { bandMeta, mosque, rankedOrders, zoneName } from "@/data";
import type { Band, RankFactor, WorkOrder } from "@/data/types";

const bandColour: Record<Band, string> = {
  do_now: "var(--color-alert)",
  escalate: "var(--color-warning)",
  batch: "var(--color-green)",
  plan: "var(--color-muted-ink)",
};

export function MaintenanceView() {
  const { t, isRtl } = useDirection();
  const open = useMemo(() => rankedOrders.filter((w) => w.status !== "closed"), []);
  const [selectedId, setSelectedId] = useState<string>(open[0]?.id ?? "");
  const [band, setBand] = useState<Band | "all">("all");
  const selected = (open.find((w) => w.id === selectedId) ?? open[0]) as WorkOrder;
  const list = band === "all" ? open : open.filter((w) => w.band === band);

  const counts = (Object.keys(bandMeta) as Band[]).map((b) => ({
    band: b,
    count: open.filter((w) => w.band === b).length,
  }));

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <div className="space-y-4">
        <Card>
          <CardHeader
            title={t("Impact against feasibility", "الأثر مقابل قابلية التنفيذ")}
            sub={t("Every open ticket, plotted.", "كل أمر عمل مفتوح، مرسوم.")}
          />
          <QuadrantChart
            orders={open}
            selectedId={selected.id}
            onSelect={setSelectedId}
            isRtl={isRtl}
          />
        </Card>

        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={band === "all"}
            onClick={() => setBand("all")}
            label={t("All", "الكل")}
            count={open.length}
          />
          {counts.map((c) => (
            <FilterPill
              key={c.band}
              active={band === c.band}
              onClick={() => setBand(c.band)}
              label={t(bandMeta[c.band].en, bandMeta[c.band].ar)}
              count={c.count}
              colour={bandColour[c.band]}
            />
          ))}
        </div>

        <ul className="space-y-2">
          {list.map((order) => {
            const m = mosque(order.mosque_id);
            const active = order.id === selected.id;
            return (
              <li key={order.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(order.id)}
                  aria-pressed={active}
                  className={cn(
                    "w-full rounded-[12px] border p-3 text-start transition-calm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green",
                    active
                      ? "border-green bg-card shadow-soft"
                      : "border-hairline bg-card/70 hover:bg-sand-2",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <BidiText className="t-caption text-muted-ink">{order.id}</BidiText>
                    <BandChip band={order.band} />
                  </span>
                  <span className="mt-1.5 block truncate t-body-sm font-medium text-ink">
                    {t(order.title_en, order.title_ar)}
                  </span>
                  <span className="mt-0.5 block truncate t-caption text-muted-ink">
                    {t(m.name_en, m.name_ar)}
                    {" | "}
                    {t(zoneName(order.zone).name_en, zoneName(order.zone).name_ar)}
                  </span>
                  <span className="mt-2 flex items-center gap-2">
                    <Meter
                      value={Math.max(0, order.sla_remaining)}
                      max={order.sla_hours}
                      tone={order.sla_remaining < 0 ? "alert" : "green"}
                      className="flex-1"
                      label={t("Service level", "مستوى الخدمة")}
                    />
                    <BidiText className="t-caption text-muted-ink">
                      {t(`Score ${order.score}`, `النقاط ${order.score}`)}
                    </BidiText>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <TicketDetail order={selected} />
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  colour,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  colour?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-[9px] border px-3 py-1.5 t-caption transition-calm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green",
        active ? "border-green bg-green/8 text-ink" : "border-hairline bg-card text-muted-ink",
      )}
    >
      {colour ? (
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: colour }}
          aria-hidden="true"
        />
      ) : null}
      {label}
      <BidiText className="tnum">{count}</BidiText>
    </button>
  );
}

function QuadrantChart({
  orders,
  selectedId,
  onSelect,
  isRtl,
}: {
  orders: WorkOrder[];
  selectedId: string;
  onSelect: (id: string) => void;
  isRtl: boolean;
}) {
  const { t } = useDirection();
  const W = 300;
  const H = 230;
  const pad = 26;
  const x = (feas: number) => pad + (feas / 100) * (W - pad * 2);
  const y = (impact: number) => H - pad - (impact / 100) * (H - pad * 2);

  const quadrants = [
    { label: t("DO NOW", "تنفيذ فوري"), fill: "var(--color-alert)", qx: 0.5, qy: 0 },
    { label: t("ESCALATE", "تصعيد"), fill: "var(--color-warning)", qx: 0, qy: 0 },
    { label: t("BATCH", "تجميع"), fill: "var(--color-green)", qx: 0.5, qy: 0.5 },
    { label: t("PLAN", "تخطيط"), fill: "var(--color-muted-ink)", qx: 0, qy: 0.5 },
  ];

  return (
    <figure className="mt-3">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ direction: "ltr" }}
        role="img"
        aria-label={t(
          "Open tickets plotted by feasibility and impact.",
          "أوامر العمل المفتوحة مرسومة حسب قابلية التنفيذ والأثر.",
        )}
      >
        {quadrants.map((q) => (
          <g key={q.label}>
            <rect
              x={pad + q.qx * (W - pad * 2)}
              y={pad + q.qy * (H - pad * 2)}
              width={(W - pad * 2) / 2}
              height={(H - pad * 2) / 2}
              fill={q.fill}
              opacity={0.06}
            />
            <text
              x={pad + q.qx * (W - pad * 2) + 6}
              y={pad + q.qy * (H - pad * 2) + 14}
              className="t-micro"
              fill="var(--color-muted-ink)"
              fontSize={7.5}
              letterSpacing="0.08em"
            >
              {q.label}
            </text>
          </g>
        ))}
        <rect
          x={pad}
          y={pad}
          width={W - pad * 2}
          height={H - pad * 2}
          fill="none"
          stroke="var(--color-hairline)"
        />
        <line
          x1={W / 2}
          y1={pad}
          x2={W / 2}
          y2={H - pad}
          stroke="var(--color-hairline)"
          strokeDasharray="3 3"
        />
        <line
          x1={pad}
          y1={H / 2}
          x2={W - pad}
          y2={H / 2}
          stroke="var(--color-hairline)"
          strokeDasharray="3 3"
        />
        {orders.map((o) => {
          const active = o.id === selectedId;
          return (
            <g key={o.id}>
              <circle
                cx={x(o.feasibility)}
                cy={y(o.impact)}
                r={active ? 7 : 5}
                fill={bandColour[o.band]}
                opacity={active ? 1 : 0.75}
                stroke="var(--color-card)"
                strokeWidth={active ? 2.5 : 1.5}
                className="cursor-pointer"
                onClick={() => onSelect(o.id)}
              />
              <title>{`${o.id} ${t(o.title_en, o.title_ar)}`}</title>
            </g>
          );
        })}
        <text
          x={W / 2}
          y={H - 6}
          textAnchor="middle"
          fill="var(--color-muted-ink)"
          fontSize={8}
          letterSpacing="0.08em"
        >
          {t("FEASIBILITY, CAN IT BE DONE", "قابلية التنفيذ")}
        </text>
        <text
          x={10}
          y={H / 2}
          textAnchor="middle"
          fill="var(--color-muted-ink)"
          fontSize={8}
          letterSpacing="0.08em"
          transform={`rotate(-90 10 ${H / 2})`}
        >
          {t("IMPACT", "الأثر")}
        </text>
      </svg>
      <figcaption className="sr-only">
        {isRtl ? "الرسم يُقرأ من اليسار لليمين لأن المحاور رقمية." : ""}
      </figcaption>
    </figure>
  );
}

function TicketDetail({ order }: { order: WorkOrder }) {
  const { t } = useDirection();
  const m = mosque(order.mosque_id);
  const breached = order.sla_remaining < 0;

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <BidiText className="t-caption text-muted-ink">{order.id}</BidiText>
        <BandChip band={order.band} />
        <SeverityChip severity={order.severity} />
        <StatusChip status={order.status} />
        <span className="ms-auto t-caption text-muted-ink">
          {t(m.name_en, m.name_ar)}
          {" | "}
          {t(zoneName(order.zone).name_en, zoneName(order.zone).name_ar)}
        </span>
      </div>

      <div>
        <h2 className="t-heading text-ink">{t(order.title_en, order.title_ar)}</h2>
        <p dir={t("rtl", "ltr")} className="mt-1 t-body-sm text-muted-ink">
          {t(order.title_ar, order.title_en)}
        </p>
        <p className="mt-2 max-w-[70ch] t-body-sm text-ink">
          {t(order.description_en, order.description_ar)}
        </p>
      </div>

      <div className="rounded-[12px] border border-hairline bg-sand-2/60 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="t-micro text-muted-ink">{t("SERVICE LEVEL", "مستوى الخدمة")}</span>
          <BidiText
            className={cn("t-body-sm font-medium", breached ? "text-alert" : "text-ink")}
          >
            {breached
              ? t(
                  `Breached by ${Math.abs(order.sla_remaining)}h`,
                  `تجاوز بـ ${Math.abs(order.sla_remaining)} ساعة`,
                )
              : t(
                  `${order.sla_remaining}h remaining of ${order.sla_hours}h`,
                  `${order.sla_remaining} ساعة متبقية من ${order.sla_hours}`,
                )}
          </BidiText>
        </div>
        <Meter
          value={breached ? order.sla_hours : order.sla_remaining}
          max={order.sla_hours}
          tone={breached ? "alert" : order.sla_remaining <= 6 ? "warning" : "green"}
          className="mt-2"
          height={8}
          label={t("Service level", "مستوى الخدمة")}
        />
      </div>

      <section aria-label={t("Why it is ranked here", "سبب هذا الترتيب")}>
        <h3 className="t-title text-ink">{t("Why it is ranked here", "سبب هذا الترتيب")}</h3>
        <p className="mt-1 max-w-[80ch] t-body-sm text-muted-ink">
          {t(order.band_headline_en, order.band_headline_ar)}
        </p>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <FactorColumn
            title={t("Impact", "الأثر")}
            total={order.impact}
            factors={order.impact_factors}
            tone="alert"
          />
          <FactorColumn
            title={t("Feasibility, can it be done", "قابلية التنفيذ")}
            total={order.feasibility}
            factors={order.feasibility_factors}
            tone="green"
          />
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-[12px] border border-gold/40 bg-gold/8 p-3.5">
        <CalendarClock className="mt-0.5 size-4 shrink-0 stroke-[1.5] text-gold" aria-hidden="true" />
        <p className="t-body-sm text-ink">{t(order.schedule_en, order.schedule_ar)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 t-micro text-muted-ink">
          <Flag className="size-3.5 stroke-[1.5]" aria-hidden="true" />
          {t("FLAGS", "إشارات")}
        </span>
        {(t("en", "ar") === "ar" ? order.flags_ar : order.flags_en).map((f) => (
          <Chip key={f} tone="neutral" size="sm">
            {f}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="primary">{t("Assign a technician", "إسناد فني")}</Button>
        <Button variant="secondary">{t("Escalate to region", "التصعيد للمنطقة")}</Button>
        <Button variant="quiet">{t("Schedule for tomorrow", "جدولة للغد")}</Button>
      </div>

      <section aria-label={t("History", "السجل")}>
        <h3 className="mb-3 t-title text-ink">{t("History", "السجل")}</h3>
        <Timeline
          items={order.timeline.map((e) => ({
            actor: t(e.actor_en, e.actor_ar),
            role: t(e.role_en, e.role_ar),
            change: t(e.change_en, e.change_ar),
            timestamp: e.timestamp,
          }))}
        />
      </section>
    </Card>
  );
}

function FactorColumn({
  title,
  total,
  factors,
  tone,
}: {
  title: string;
  total: number;
  factors: RankFactor[];
  tone: "alert" | "green";
}) {
  const { t } = useDirection();
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h4 className="t-micro text-muted-ink">{title}</h4>
        <BidiText className="t-numeral-sm text-ink">{total}</BidiText>
      </div>
      <ul className="mt-2 space-y-3">
        {factors.map((f) => (
          <li key={f.name_en} className="border-t border-hairline pt-2.5 first:border-t-0">
            <div className="flex items-baseline justify-between gap-3">
              <span className="t-body-sm font-medium text-ink">{t(f.name_en, f.name_ar)}</span>
              <BidiText className="t-caption text-muted-ink">
                {f.points} / {f.max}
              </BidiText>
            </div>
            <Meter
              value={f.points}
              max={f.max}
              tone={tone}
              height={4}
              className="mt-1.5"
              label={t(f.name_en, f.name_ar)}
            />
            <p className="mt-1 t-caption text-muted-ink">{t(f.note_en, f.note_ar)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
