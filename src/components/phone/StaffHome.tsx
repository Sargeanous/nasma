import { useState } from "react";
import {
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronRight,
  Circle,
  Droplets,
  PhoneCall,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BidiText } from "@/lib/bidi";
import { useDirection } from "@/lib/direction";
import { Card, CardHeader, Chip, EmptyState, SeverityChip, SlaChip } from "@/components/nasma/primitives";
import { PrayerStrip } from "@/components/nasma/PrayerStrip";
import { Button } from "@/components/nasma/Button";
import { SectionTitle } from "./PhoneFrame";
import { FaultReportSheet } from "./FaultReportSheet";
import { dailyTasks, monthlyMaintenance, regulations, emergencyLine } from "@/data/phone";
import { mosque, ordersForMosque, formatAED, zoneName } from "@/data";
import type { Person } from "@/data/types";

export function StaffHome({ person }: { person: Person }) {
  const { t, lang } = useDirection();
  const m = mosque(person.mosques[0]!);
  const [sheet, setSheet] = useState(false);
  const [confirmEmergency, setConfirmEmergency] = useState(false);
  const [doneTasks, setDoneTasks] = useState<string[]>(
    dailyTasks.filter((d) => d.done).map((d) => d.id),
  );
  const [submitted, setSubmitted] = useState(false);

  const tasks = dailyTasks.filter((d) => d.roles.includes(person.role));
  const myOrders = ordersForMosque(m.id);
  const util = m.utilities[m.utilities.length - 1]!;
  const prev = m.utilities[m.utilities.length - 2]!;
  const elecChange = Math.round(
    ((util.electricity_aed - prev.electricity_aed) / prev.electricity_aed) * 100,
  );
  const waterChange = Math.round(((util.water_aed - prev.water_aed) / prev.water_aed) * 100);

  const firstName = lang === "ar" ? person.name_ar : person.name_en.split(" ").slice(-2).join(" ");

  return (
    <>
      {/* Greeting */}
      <section className="rounded-[12px] border border-hairline bg-card p-4">
        <p className="t-title text-ink">
          {t("Peace be upon you,", "السلام عليكم،")} {firstName}
        </p>
        <p className="mt-1 t-body-sm text-muted-ink">
          {t(person.role_en, person.role_ar)} | {t(m.name_en, m.name_ar)}
        </p>
        <p className="t-caption text-muted-ink">{t(m.district, m.district_ar)}</p>
      </section>

      <PrayerStrip />

      {/* Tasks */}
      <SectionTitle>{t("My tasks today", "مهامي اليوم")}</SectionTitle>
      <div className="space-y-2">
        {tasks.map((task) => {
          const done = doneTasks.includes(task.id);
          return (
            <button
              key={task.id}
              type="button"
              onClick={() =>
                setDoneTasks((cur) =>
                  cur.includes(task.id) ? cur.filter((i) => i !== task.id) : [...cur, task.id],
                )
              }
              aria-pressed={done}
              className={cn(
                "flex min-h-11 w-full items-start gap-3 rounded-[12px] border p-3 text-start transition-calm",
                done ? "border-success/30 bg-success/6" : "border-hairline bg-card hover:bg-sand-2",
              )}
            >
              <span className={cn("mt-0.5 shrink-0", done ? "text-success" : "text-muted-ink")}>
                {done ? (
                  <CheckCircle2 className="size-5 stroke-[1.5]" aria-hidden="true" />
                ) : (
                  <Circle className="size-5 stroke-[1.5]" aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <BidiText className="t-caption tnum text-muted-ink">{task.oms}</BidiText>
                  <span className="t-caption text-muted-ink">
                    {t(task.window_en, task.window_ar)}
                  </span>
                </span>
                <span className="mt-1 block t-body-sm font-medium text-ink">
                  {t(task.title_en, task.title_ar)}
                </span>
              </span>
              <span className="t-caption text-green">
                {done ? t("Confirmed", "مؤكد") : t("Confirm", "تأكيد")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Report a fault */}
      <button
        type="button"
        onClick={() => setSheet(true)}
        className="mt-1 flex w-full items-center gap-3 rounded-[12px] border border-green/30 bg-green/8 p-4 text-start transition-calm hover:bg-green/12"
      >
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-[9px] bg-deep-green text-primary-foreground">
          <Camera className="size-5 stroke-[1.5]" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block t-body font-medium text-ink">
            {t("Report a fault in ten seconds", "بلّغ عن عطل في عشر ثوان")}
          </span>
          <span className="block t-caption text-muted-ink">
            {t("Photo, category, send.", "صورة، تصنيف، إرسال.")}
          </span>
        </span>
        <ChevronRight className="icon-directional size-5 shrink-0 stroke-[1.5] text-green" aria-hidden="true" />
      </button>

      {/* My reports */}
      <SectionTitle>{t("My reports", "بلاغاتي")}</SectionTitle>
      {myOrders.length === 0 ? (
        <EmptyState line={t("Nothing open at this mosque.", "لا يوجد مفتوح في هذا المسجد.")} />
      ) : (
        <div className="space-y-2">
          {myOrders.map((o) => (
            <Card key={o.id} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <BidiText className="t-caption font-medium text-muted-ink">{o.id}</BidiText>
                <SeverityChip severity={o.severity} />
                <SlaChip remaining={o.sla_remaining} hours={o.sla_hours} />
              </div>
              <p className="t-body font-medium text-ink">{t(o.title_en, o.title_ar)}</p>
              <p className="t-caption text-muted-ink">
                {t(zoneName(o.zone).name_en, zoneName(o.zone).name_ar)}
              </p>
              {o.assignee_en ? (
                <p className="rounded-[9px] bg-sand-2 px-3 py-2 t-caption text-ink">
                  {t("Technician assigned", "الفني المسند")}:{" "}
                  <span className="font-medium">{t(o.assignee_en, o.assignee_ar ?? "")}</span>
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      {/* Utilities */}
      <SectionTitle>{t("Utilities this month", "الاستهلاك هذا الشهر")}</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <UtilityTile
          icon={<Zap className="size-4 stroke-[1.5]" aria-hidden="true" />}
          label={t("Electricity", "الكهرباء")}
          value={formatAED(util.electricity_aed)}
          sub={`${util.electricity_kwh.toLocaleString("en-US")} kWh`}
          change={elecChange}
        />
        <UtilityTile
          icon={<Droplets className="size-4 stroke-[1.5]" aria-hidden="true" />}
          label={t("Water", "المياه")}
          value={formatAED(util.water_aed)}
          sub={`${util.water_m3.toLocaleString("en-US")} m3`}
          change={waterChange}
        />
      </div>

      {/* Regulations */}
      <SectionTitle>{t("Regulations", "التعاميم")}</SectionTitle>
      <Card padded={false} className="divide-y divide-hairline">
        {regulations.map((r) => (
          <div key={r.id} className="flex items-start gap-3 p-3">
            <BookOpen className="mt-0.5 size-4 shrink-0 stroke-[1.5] text-green" aria-hidden="true" />
            <div className="min-w-0">
              <p className="t-body-sm font-medium text-ink">{t(r.title_en, r.title_ar)}</p>
              <p className="t-caption text-muted-ink">{t(r.note_en, r.note_ar)}</p>
              <BidiText className="t-caption text-muted-ink">{r.ref}</BidiText>
            </div>
          </div>
        ))}
      </Card>

      {/* Monthly maintenance */}
      <SectionTitle>{t("Monthly maintenance", "الصيانة الشهرية")}</SectionTitle>
      <Card className="space-y-3">
        <CardHeader
          title={t("August checklist", "قائمة أغسطس")}
          sub={t("Submitted to the supervisor once complete.", "تُرسل للمشرف بعد الاكتمال.")}
        />
        <ul className="space-y-2">
          {monthlyMaintenance.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              {item.state === "done" || submitted ? (
                <CheckCircle2 className="size-4 shrink-0 stroke-[1.5] text-success" aria-hidden="true" />
              ) : (
                <Circle className="size-4 shrink-0 stroke-[1.5] text-muted-ink" aria-hidden="true" />
              )}
              <span className="t-body-sm text-ink">{t(item.title_en, item.title_ar)}</span>
            </li>
          ))}
        </ul>
        <Button variant="secondary" full disabled={submitted} onClick={() => setSubmitted(true)}>
          {submitted ? t("Submitted", "تم الإرسال") : t("Submit the checklist", "إرسال القائمة")}
        </Button>
      </Card>

      {/* Emergency */}
      <div className="pt-2">
        {confirmEmergency ? (
          <Card className="space-y-3 border-alert/40">
            <p className="t-body font-medium text-alert">
              {t("Raise an emergency?", "رفع بلاغ طارئ؟")}
            </p>
            <p className="t-caption text-muted-ink">{t(emergencyLine.en, emergencyLine.ar)}</p>
            <div className="flex gap-2">
              <Button variant="danger" full onClick={() => setConfirmEmergency(false)}>
                {t("Yes, raise it", "نعم، ارفعه")}
              </Button>
              <Button variant="secondary" full onClick={() => setConfirmEmergency(false)}>
                {t("Cancel", "إلغاء")}
              </Button>
            </div>
          </Card>
        ) : (
          <Button
            variant="danger"
            full
            size="lg"
            onClick={() => setConfirmEmergency(true)}
            icon={<PhoneCall className="size-5 stroke-[1.5]" aria-hidden="true" />}
          >
            {t("Emergency", "طوارئ")}
          </Button>
        )}
      </div>

      <FaultReportSheet
        open={sheet}
        onClose={() => setSheet(false)}
        mosqueName={t(m.name_en, m.name_ar)}
      />
    </>
  );
}

function UtilityTile({
  icon,
  label,
  value,
  sub,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  change: number;
}) {
  const { t } = useDirection();
  const down = change <= 0;
  return (
    <div className="rounded-[12px] border border-hairline bg-card p-3">
      <div className="flex items-center gap-2 text-muted-ink">
        <span className="text-green">{icon}</span>
        <span className="t-micro">{label}</span>
      </div>
      <div className="mt-1.5 t-numeral-sm text-ink">
        <BidiText>{value}</BidiText>
      </div>
      <BidiText className="t-caption text-muted-ink">{sub}</BidiText>
      <div className="mt-1">
        <Chip tone={down ? "success" : "warning"} size="sm">
          <span className="inline-flex items-center gap-1">
            {down ? (
              <TrendingDown className="size-3 stroke-[1.5]" aria-hidden="true" />
            ) : (
              <TrendingUp className="size-3 stroke-[1.5]" aria-hidden="true" />
            )}
            <BidiText>{`${change > 0 ? "+" : ""}${change}%`}</BidiText>
            <span>{t("vs last month", "مقارنة بالشهر الماضي")}</span>
          </span>
        </Chip>
      </div>
    </div>
  );
}
