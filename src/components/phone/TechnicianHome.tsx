import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  Circle,
  Gauge,
  Pencil,
  PlayCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BidiText } from "@/lib/bidi";
import { useDirection } from "@/lib/direction";
import {
  Card,
  CardHeader,
  Chip,
  Meter,
  SeverityChip,
  SlaChip,
  StatusChip,
} from "@/components/nasma/primitives";
import { Button } from "@/components/nasma/Button";
import { PrayerStrip } from "@/components/nasma/PrayerStrip";
import { SectionTitle } from "./PhoneFrame";
import { inspectionItems, meterReading } from "@/data/phone";
import { mosque, ordersForPerson, zoneName } from "@/data";
import type { Person, WorkOrder } from "@/data/types";

type JobState = "assigned" | "in_progress" | "photo_attached" | "closed";

export function TechnicianHome({ person }: { person: Person }) {
  const { t } = useDirection();
  const orders = ordersForPerson(person.mosques);
  const primary = orders.find((o) => o.assignee_en?.includes("Ramesh")) ?? orders[0]!;
  const others = orders.filter((o) => o.id !== primary.id);

  return (
    <>
      <section className="rounded-[12px] border border-hairline bg-card p-4">
        <p className="t-title text-ink">
          {t("Peace be upon you,", "السلام عليكم،")} {t("Ramesh", person.name_ar)}
        </p>
        <p className="mt-1 t-body-sm text-muted-ink">
          {t(person.role_en, person.role_ar)} | {t(person.scope_en, person.scope_ar)}
        </p>
      </section>

      <PrayerStrip />

      <SectionTitle>{t("My work orders", "أوامر العمل الخاصة بي")}</SectionTitle>
      <JobCard order={primary} />

      {others.map((o) => (
        <Card key={o.id} className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <BidiText className="t-caption font-medium text-muted-ink">{o.id}</BidiText>
            <SeverityChip severity={o.severity} />
            <SlaChip remaining={o.sla_remaining} hours={o.sla_hours} />
          </div>
          <p className="t-body font-medium text-ink">{t(o.title_en, o.title_ar)}</p>
          <p className="t-caption text-muted-ink">
            {t(mosque(o.mosque_id).name_en, mosque(o.mosque_id).name_ar)} |{" "}
            {t(zoneName(o.zone).name_en, zoneName(o.zone).name_ar)}
          </p>
          <StatusChip status={o.status} />
        </Card>
      ))}

      <SectionTitle>{t("Monthly inspection", "الفحص الشهري")}</SectionTitle>
      <InspectionCard />

      <SectionTitle>{t("Meter reading", "قراءة العداد")}</SectionTitle>
      <MeterCard />
    </>
  );
}

function JobCard({ order }: { order: WorkOrder }) {
  const { t } = useDirection();
  const [state, setState] = useState<JobState>("assigned");
  const m = mosque(order.mosque_id);

  const labels: Record<JobState, string> = {
    assigned: t("Assigned to you", "مسند إليك"),
    in_progress: t("In progress", "قيد التنفيذ"),
    photo_attached: t("Fix photo attached", "صورة الإصلاح مرفقة"),
    closed: t("Closed with evidence", "مغلق مع الدليل"),
  };

  return (
    <Card className="space-y-3 border-green/40">
      <div className="flex flex-wrap items-center gap-2">
        <BidiText className="t-caption font-medium text-muted-ink">{order.id}</BidiText>
        <SeverityChip severity={order.severity} />
        <SlaChip remaining={order.sla_remaining} hours={order.sla_hours} />
      </div>
      <div>
        <p className="t-body font-medium text-ink">{t(order.title_en, order.title_ar)}</p>
        <p className="t-caption text-muted-ink">
          {t(m.name_en, m.name_ar)} | {t(zoneName(order.zone).name_en, zoneName(order.zone).name_ar)}
        </p>
      </div>

      <p className="rounded-[9px] bg-sand-2 px-3 py-2 t-body-sm text-ink">
        {t(
          `Assigned to you, ${order.sla_remaining}h left in the ${order.sla_hours}h SLA`,
          `مسند إليك، تبقى ${order.sla_remaining} ساعة من أصل ${order.sla_hours} ساعة`,
        )}
      </p>

      <ol className="space-y-2">
        {(["assigned", "in_progress", "photo_attached", "closed"] as JobState[]).map((s, i) => {
          const order_ = ["assigned", "in_progress", "photo_attached", "closed"];
          const reached = order_.indexOf(state) >= i;
          return (
            <li key={s} className="flex items-center gap-2">
              {reached ? (
                <CheckCircle2 className="size-4 shrink-0 stroke-[1.5] text-success" aria-hidden="true" />
              ) : (
                <Circle className="size-4 shrink-0 stroke-[1.5] text-muted-ink" aria-hidden="true" />
              )}
              <span className={cn("t-body-sm", reached ? "text-ink" : "text-muted-ink")}>
                {labels[s]}
              </span>
            </li>
          );
        })}
      </ol>

      {state === "assigned" ? (
        <Button
          variant="primary"
          full
          icon={<PlayCircle className="size-5 stroke-[1.5]" aria-hidden="true" />}
          onClick={() => setState("in_progress")}
        >
          {t("Start job", "بدء العمل")}
        </Button>
      ) : null}
      {state === "in_progress" ? (
        <Button
          variant="secondary"
          full
          icon={<Camera className="size-5 stroke-[1.5]" aria-hidden="true" />}
          onClick={() => setState("photo_attached")}
        >
          {t("Attach fix photo", "إرفاق صورة الإصلاح")}
        </Button>
      ) : null}
      {state === "photo_attached" ? (
        <Button variant="primary" full onClick={() => setState("closed")}>
          {t("Close with evidence", "الإغلاق مع الدليل")}
        </Button>
      ) : null}
      {state === "closed" ? (
        <p className="t-caption text-muted-ink">
          {t(
            "Sent to the Imam for verification. A technician cannot verify his own job.",
            "أُرسل للإمام للتحقق. لا يتحقق الفني من عمله بنفسه.",
          )}
        </p>
      ) : null}
    </Card>
  );
}

function InspectionCard() {
  const { t } = useDirection();
  const [results, setResults] = useState<Record<string, "pass" | "fail" | undefined>>({});
  const completed = inspectionItems.filter((i) => results[i.id]).length;

  return (
    <Card className="space-y-3">
      <CardHeader
        title={t("Air conditioning, monthly", "التكييف، شهري")}
        sub={t(
          `${completed} of ${inspectionItems.length} recorded`,
          `${completed} من ${inspectionItems.length} مسجلة`,
        )}
        action={<Meter value={completed} max={inspectionItems.length} className="mt-2 w-16" />}
      />
      <ul className="divide-y divide-hairline">
        {inspectionItems.map((item) => (
          <li key={item.id} className="flex items-center gap-2 py-2">
            <span className="min-w-0 flex-1">
              <span className="block t-body-sm text-ink">{t(item.title_en, item.title_ar)}</span>
              {item.needsPhoto ? (
                <Chip tone="neutral" size="sm" className="mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Camera className="size-3 stroke-[1.5]" aria-hidden="true" />
                    {t("Photo required", "صورة مطلوبة")}
                  </span>
                </Chip>
              ) : null}
            </span>
            <span className="flex shrink-0 gap-1">
              <button
                type="button"
                aria-label={t("Pass", "مطابق")}
                aria-pressed={results[item.id] === "pass"}
                onClick={() => setResults((r) => ({ ...r, [item.id]: "pass" }))}
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-[9px] border transition-calm",
                  results[item.id] === "pass"
                    ? "border-success bg-success/10 text-success"
                    : "border-hairline text-muted-ink hover:bg-sand-2",
                )}
              >
                <CheckCircle2 className="size-5 stroke-[1.5]" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={t("Fail", "غير مطابق")}
                aria-pressed={results[item.id] === "fail"}
                onClick={() => setResults((r) => ({ ...r, [item.id]: "fail" }))}
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-[9px] border transition-calm",
                  results[item.id] === "fail"
                    ? "border-alert bg-alert/10 text-alert"
                    : "border-hairline text-muted-ink hover:bg-sand-2",
                )}
              >
                <XCircle className="size-5 stroke-[1.5]" aria-hidden="true" />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function MeterCard() {
  const { t } = useDirection();
  const [captured, setCaptured] = useState(false);
  const [value, setValue] = useState(String(meterReading.value));
  const [editing, setEditing] = useState(false);

  return (
    <Card className="space-y-3">
      <CardHeader
        title={t(meterReading.meter_en, meterReading.meter_ar)}
        sub={t(
          `Last month ${meterReading.previous.toLocaleString("en-US")} kWh`,
          `الشهر الماضي ${meterReading.previous.toLocaleString("en-US")} ك.و.س`,
        )}
      />
      {!captured ? (
        <Button
          variant="secondary"
          full
          icon={<Gauge className="size-5 stroke-[1.5]" aria-hidden="true" />}
          onClick={() => setCaptured(true)}
        >
          {t("Photograph the meter", "تصوير العداد")}
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-end justify-between gap-3 rounded-[12px] bg-sand-2 p-3">
            <div>
              <span className="t-micro text-muted-ink">
                {t("Read from the photo", "المقروء من الصورة")}
              </span>
              {editing ? (
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  inputMode="numeric"
                  aria-label={t("Meter value", "قيمة العداد")}
                  className="mt-1 block w-full rounded-[9px] border border-green bg-card px-2 py-1 t-numeral-sm tnum text-ink"
                />
              ) : (
                <div className="mt-1 t-numeral-sm tnum text-ink">
                  <BidiText>{`${Number(value).toLocaleString("en-US")} ${t(meterReading.unit_en, meterReading.unit_ar)}`}</BidiText>
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="quiet"
              icon={<Pencil className="size-4 stroke-[1.5]" aria-hidden="true" />}
              onClick={() => setEditing((e) => !e)}
            >
              {editing ? t("Save", "حفظ") : t("Edit", "تعديل")}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone="success" size="sm">
              <BidiText>{`${Math.round(meterReading.confidence * 100)}%`}</BidiText>
              <span>{t("confidence", "ثقة")}</span>
            </Chip>
            <span className="t-caption text-muted-ink">
              {t("Check it before you send.", "تحقق منها قبل الإرسال.")}
            </span>
          </div>
          <Button variant="primary" full>
            {t("Submit reading", "إرسال القراءة")}
          </Button>
        </div>
      )}
    </Card>
  );
}
