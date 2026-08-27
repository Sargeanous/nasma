import { lazy, Suspense, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { useDirection } from "@/lib/direction";
import { BidiText } from "@/lib/bidi";
import { Card, CardHeader, Chip, Dot, Skeleton } from "@/components/nasma/primitives";
import { Button } from "@/components/nasma/Button";
import {
  formatNumber,
  mosque,
  mosques,
  mosqueUrgency,
  ordersForMosque,
  regionLabels,
} from "@/data";

const LeafletCanvas = lazy(() => import("./LeafletCanvas"));

export function MapView({ onOpenMosque }: { onOpenMosque: (id: string) => void }) {
  const { t } = useDirection();
  const [selectedId, setSelectedId] = useState("m-001");
  const m = mosque(selectedId);
  const open = ordersForMosque(selectedId).filter((w) => w.status !== "closed");
  const urgency = mosqueUrgency(selectedId);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card padded={false} className="relative overflow-hidden">
        <div className="absolute inset-inline-end-3 top-3 z-[500] rounded-[9px] border border-hairline bg-card/95 px-2.5 py-1.5 t-caption text-muted-ink">
          {t("3D twin arrives with PoP", "التوأم ثلاثي الأبعاد يصل مع النموذج الأولي")}
        </div>
        <div className="absolute bottom-3 z-[500] rounded-[9px] border border-hairline bg-card/95 px-3 py-2 inset-inline-start-3">
          <p className="mb-1.5 t-micro text-muted-ink">{t("LEGEND", "المفتاح")}</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 t-caption text-ink">
              <Dot tone="alert" />
              {t("Needs attention", "يحتاج انتباها")}
            </li>
            <li className="flex items-center gap-2 t-caption text-ink">
              <Dot tone="warning" />
              {t("Open work", "عمل مفتوح")}
            </li>
            <li className="flex items-center gap-2 t-caption text-ink">
              <Dot tone="success" />
              {t("Clear", "سليم")}
            </li>
            <li className="pt-1 t-caption text-muted-ink">
              {t("Circle size follows capacity.", "حجم الدائرة يتبع السعة.")}
            </li>
          </ul>
        </div>
        <ClientOnly fallback={<MapFallback />}>
          <Suspense fallback={<MapFallback />}>
            <LeafletCanvas selectedId={selectedId} onSelect={setSelectedId} />
          </Suspense>
        </ClientOnly>
      </Card>

      <Card className="space-y-4">
        <CardHeader
          title={t(m.name_en, m.name_ar)}
          sub={`${t(m.district, m.district_ar)} | ${t(m.region, regionLabels[m.region]?.ar ?? m.region)}`}
        />
        <div className="flex flex-wrap gap-2">
          <Chip tone="neutral">{t(m.class, m.class_ar)}</Chip>
          <Chip tone="neutral">
            {t(`${formatNumber(m.capacity)} capacity`, `سعة ${formatNumber(m.capacity)}`)}
          </Chip>
          <Chip tone={m.hvac === "manual" ? "warning" : "green"}>
            {m.hvac === "manual" ? t("Manual AC", "تكييف يدوي") : t("AC on plan", "تكييف مجدول")}
          </Chip>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Fact label={t("OPEN WORK", "عمل مفتوح")} value={String(open.length)} />
          <Fact label={t("COMPLIANCE", "الالتزام")} value={`${m.compliance}%`} />
          <Fact label={t("COMFORT", "الراحة")} value={`${m.comfort}%`} />
          <Fact label={t("AREA", "المساحة")} value={`${formatNumber(m.area_m2)} m2`} />
        </div>
        <div className="rounded-[12px] border border-hairline bg-sand-2/60 p-3">
          <p className="t-micro text-muted-ink">{t("CONTRACTOR", "المقاول")}</p>
          <p className="t-body-sm text-ink">{t(m.contractor, m.contractor_ar)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dot
            tone={urgency === "alert" ? "alert" : urgency === "warning" ? "warning" : "success"}
            label={t("Status", "الحالة")}
          />
          <span className="t-caption text-muted-ink">
            {urgency === "alert"
              ? t("Needs attention now", "يحتاج انتباها الآن")
              : urgency === "warning"
                ? t("Open work in hand", "عمل مفتوح قيد المعالجة")
                : t("Nothing outstanding", "لا يوجد عمل معلق")}
          </span>
        </div>
        <Button variant="primary" full onClick={() => onOpenMosque(m.id)}>
          {t("Open mosque", "فتح المسجد")}
        </Button>
      </Card>
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

/** If the tiles never arrive, a clean list beats a grey box. */
function MapFallback() {
  const { t } = useDirection();
  return (
    <div className="h-[620px] overflow-auto p-4">
      <Skeleton className="h-8 w-48" />
      <ul className="mt-4 space-y-2">
        {mosques.map((m) => (
          <li
            key={m.id}
            className="flex items-center gap-3 rounded-[9px] border border-hairline bg-sand-2/50 px-3 py-2"
          >
            <Dot
              tone={
                mosqueUrgency(m.id) === "alert"
                  ? "alert"
                  : mosqueUrgency(m.id) === "warning"
                    ? "warning"
                    : "success"
              }
              label={t("Status", "الحالة")}
            />
            <span className="flex-1 truncate t-body-sm text-ink">{t(m.name_en, m.name_ar)}</span>
            <BidiText className="t-caption text-muted-ink">
              {formatNumber(m.capacity)}
            </BidiText>
          </li>
        ))}
      </ul>
    </div>
  );
}
