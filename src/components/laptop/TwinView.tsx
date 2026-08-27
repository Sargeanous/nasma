import { lazy, Suspense, useMemo, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { useDirection } from "@/lib/direction";
import { BidiText } from "@/lib/bidi";
import {
  Card,
  CardHeader,
  Chip,
  Dot,
  Meter,
  SeverityChip,
  Skeleton,
  SlaChip,
} from "@/components/nasma/primitives";
import { Button } from "@/components/nasma/Button";
import { formatNumber, mosque, mosques, zoneName } from "@/data";
import { healthMeta, twinFor, type PartKind } from "@/data/twin";
import { X } from "lucide-react";

const TwinCanvas = lazy(() => import("./TwinCanvas"));

export function TwinView({
  mosqueId,
  onMosque,
}: {
  mosqueId: string;
  onMosque: (id: string) => void;
}) {
  const { t, lang } = useDirection();
  const [selected, setSelected] = useState<PartKind | null>(null);
  const [roofOpen, setRoofOpen] = useState(0);
  const m = mosque(mosqueId);
  const model = useMemo(() => twinFor(mosqueId), [mosqueId]);
  const part = model.parts.find((p) => p.id === selected) ?? null;

  const faulty = model.parts.filter((p) => p.health === "faulty");
  const warning = model.parts.filter((p) => p.health === "warning");
  const issues = [...faulty, ...warning];

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card padded={false} className="relative overflow-hidden">
        <div className="absolute inset-inline-start-3 bottom-3 z-20 rounded-[9px] border border-hairline bg-card/95 px-3 py-2">
          <p className="mb-1.5 t-micro text-muted-ink">{t("LEGEND", "المفتاح")}</p>
          <ul className="space-y-1">
            {(["healthy", "warning", "faulty"] as const).map((h) => (
              <li key={h} className="flex items-center gap-2 t-caption text-ink">
                <Dot tone={h === "healthy" ? "success" : h === "warning" ? "warning" : "alert"} />
                {t(healthMeta[h].en, healthMeta[h].ar)}
              </li>
            ))}
            <li className="pt-1 t-caption text-muted-ink">
              {t(
                "Model is generated from area and capacity.",
                "النموذج مولّد من المساحة والسعة.",
              )}
            </li>
          </ul>
        </div>

        <div className="absolute inset-inline-end-3 top-3 z-20 flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-[9px] border border-hairline bg-card/95 px-3 py-2">
            <span className="t-caption text-muted-ink">{t("Open the roof", "فتح السقف")}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={roofOpen * 100}
              onChange={(e) => setRoofOpen(Number(e.target.value) / 100)}
              aria-label={t("Open the roof", "فتح السقف")}
              className="h-1 w-32 accent-[var(--color-gold)]"
            />
          </label>
        </div>

        <div className="h-[620px]">
          <ClientOnly fallback={<TwinFallback />}>
            <Suspense fallback={<TwinFallback />}>
              <TwinCanvas
                model={model}
                selected={selected}
                onSelect={setSelected}
                roofOpen={roofOpen}
                lang={lang}
              />
            </Suspense>
          </ClientOnly>
        </div>

        {part ? (
          <div className="absolute inset-inline-start-3 top-3 z-30 w-[340px] rounded-[16px] border border-hairline bg-card/97 p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="t-micro text-muted-ink">
                  {t(zoneName(part.zone).en, zoneName(part.zone).ar).toUpperCase()}
                </p>
                <h3 className="t-body font-medium text-ink">{t(part.name_en, part.name_ar)}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label={t("Close", "إغلاق")}
                className="rounded-[9px] p-1.5 text-muted-ink transition-calm hover:bg-sand-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <X className="size-4 stroke-[1.5]" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Chip
                tone={
                  part.health === "healthy"
                    ? "success"
                    : part.health === "warning"
                      ? "warning"
                      : "alert"
                }
              >
                {t(healthMeta[part.health].en, healthMeta[part.health].ar)}
              </Chip>
              {part.ticket ? <SeverityChip severity={part.ticket.severity} /> : null}
              {part.ticket ? (
                <BidiText className="t-caption text-muted-ink">{part.ticket.id}</BidiText>
              ) : null}
            </div>

            <p className="mt-3 t-body-sm text-ink">
              {part.ticket
                ? t(part.ticket.title_en, part.ticket.title_ar)
                : t(part.detail_en, part.detail_ar)}
            </p>

            {part.ticket ? (
              <>
                <div className="mt-3 rounded-[12px] border border-hairline bg-sand-2/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="t-micro text-muted-ink">{t("SLA", "زمن الاستجابة")}</span>
                    <SlaChip
                      remaining={part.ticket.sla_remaining}
                      hours={part.ticket.sla_hours}
                    />
                  </div>
                  <Meter
                    className="mt-2"
                    value={Math.max(0, part.ticket.sla_remaining)}
                    max={part.ticket.sla_hours}
                    tone={part.ticket.sla_remaining < 0 ? "alert" : "green"}
                    label={t("SLA remaining", "المتبقي من زمن الاستجابة")}
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Factor
                    label={t("IMPACT", "الأثر")}
                    value={part.ticket.impact}
                    tone="alert"
                  />
                  <Factor
                    label={t("FEASIBILITY", "الجدوى")}
                    value={part.ticket.feasibility}
                    tone="green"
                  />
                </div>

                <div className="mt-3 rounded-[12px] border border-hairline bg-sand-2/60 p-3">
                  <p className="t-micro text-muted-ink">
                    {t("NEXT PRAYER-SAFE WINDOW", "أقرب نافذة آمنة بين الصلوات")}
                  </p>
                  <p className="t-body-sm text-ink">
                    <BidiText>{t(part.ticket.schedule_en, part.ticket.schedule_ar)}</BidiText>
                  </p>
                </div>

                <div className="mt-3 rounded-[12px] border border-hairline bg-sand-2/60 p-3">
                  <p className="t-micro text-muted-ink">{t("REPORTED PHOTO", "الصورة المرفقة")}</p>
                  <div className="mt-2 flex h-24 items-center justify-center rounded-[9px] border border-hairline bg-sand-3 t-caption text-muted-ink">
                    {t(part.ticket.photo_hint_en, part.ticket.photo_hint_ar)}
                  </div>
                </div>
              </>
            ) : null}

            <div className="mt-3 rounded-[12px] border border-hairline bg-sand-2/60 p-3">
              <p className="t-micro text-muted-ink">
                {t("RECOMMENDED ACTION", "الإجراء الموصى به")}
              </p>
              <p className="t-body-sm text-ink">{t(part.action_en, part.action_ar)}</p>
            </div>
          </div>
        ) : null}
      </Card>

      <div className="space-y-5">
        <Card className="space-y-4">
          <CardHeader
            title={t(m.name_en, m.name_ar)}
            sub={`${t(m.district, m.district_ar)} | ${t(m.class, m.class_ar)}`}
          />
          <label className="block">
            <span className="t-micro text-muted-ink">{t("MOSQUE", "المسجد")}</span>
            <select
              value={mosqueId}
              onChange={(e) => onMosque(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-[9px] border border-hairline bg-card px-3 t-body-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {mosques.map((x) => (
                <option key={x.id} value={x.id}>
                  {t(x.name_en, x.name_ar)}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Fact label={t("ZONES", "المناطق")} value="6" />
            <Fact label={t("ASSETS", "الأصول")} value={String(model.parts.length)} />
            <Fact label={t("AREA", "المساحة")} value={`${formatNumber(m.area_m2)} m2`} />
            <Fact label={t("CAPACITY", "السعة")} value={formatNumber(m.capacity)} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip tone="alert">
              {t(`${faulty.length} faulty`, `${faulty.length} عاطل`)}
            </Chip>
            <Chip tone="warning">
              {t(`${warning.length} warning`, `${warning.length} تحذير`)}
            </Chip>
          </div>
        </Card>

        <Card className="space-y-3">
          <CardHeader
            title={t("Active issues", "الأعطال النشطة")}
            sub={t("Select one to isolate it in the model.", "اختر عطلا لعزله داخل النموذج.")}
          />
          {issues.length === 0 ? (
            <p className="t-body-sm text-muted-ink">
              {t("Nothing outstanding in this mosque.", "لا يوجد عمل معلق في هذا المسجد.")}
            </p>
          ) : (
            <ul className="space-y-2">
              {issues.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(p.id)}
                    aria-pressed={selected === p.id}
                    className={`flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-start transition-calm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                      selected === p.id
                        ? "border-green bg-green/8"
                        : "border-hairline bg-sand-2/50 hover:bg-sand-2"
                    }`}
                  >
                    <Dot
                      tone={p.health === "faulty" ? "alert" : "warning"}
                      label={t(healthMeta[p.health].en, healthMeta[p.health].ar)}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate t-body-sm text-ink">
                        {t(p.name_en, p.name_ar)}
                      </span>
                      <span className="block truncate t-caption text-muted-ink">
                        {p.ticket ? (
                          <BidiText>
                            {p.ticket.id} | {t(p.ticket.title_en, p.ticket.title_ar)}
                          </BidiText>
                        ) : (
                          t(zoneName(p.zone).en, zoneName(p.zone).ar)
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selected ? (
            <Button variant="quiet" full onClick={() => setSelected(null)}>
              {t("Show the whole mosque", "عرض المسجد كاملا")}
            </Button>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-hairline bg-sand-2/60 p-3">
      <p className="t-micro text-muted-ink">{label}</p>
      <p className="t-numeral-sm text-ink">
        <BidiText>{value}</BidiText>
      </p>
    </div>
  );
}

function Factor({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "alert" | "green";
}) {
  return (
    <div className="rounded-[12px] border border-hairline bg-sand-2/60 p-3">
      <p className="t-micro text-muted-ink">{label}</p>
      <p className="t-numeral-sm text-ink">
        <BidiText>{`${value} / 100`}</BidiText>
      </p>
      <Meter className="mt-2" value={value} tone={tone} label={label} />
    </div>
  );
}

function TwinFallback() {
  return (
    <div className="grid h-[620px] place-items-center">
      <Skeleton className="h-64 w-2/3" />
    </div>
  );
}
