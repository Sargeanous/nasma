import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileDown,
  MapPin,
  ShieldAlert,
  UserPlus,
  Users,
} from "lucide-react";
import { useDirection } from "@/lib/direction";
import { BidiText } from "@/lib/bidi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/nasma/Button";
import { Avatar } from "@/components/nasma/pairs";
import {
  Card,
  Chip,
  Dot,
  Meter,
  SeverityChip,
  SlaChip,
  StatTile,
  StatusChip,
} from "@/components/nasma/primitives";
import { PanelTitle } from "./BoardFrame";
import { KpiEvidenceSheet } from "./KpiEvidenceSheet";
import { crewFor, portfolioCompliance, portfolioFor, portfolioOrders } from "@/data/board";
import { mosque, zoneName } from "@/data";
import type { Person, WorkOrder } from "@/data/types";
import { ppm } from "@/data/fleet";

const bandOrder = { do_now: 0, escalate: 1, batch: 2, plan: 3 } as const;

export function SupervisorBoard({ person }: { person: Person }) {
  const { t } = useDirection();
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const scopeIds = portfolioFor(person.id);
  const orders = useMemo(
    () =>
      [...portfolioOrders(person.id)].sort(
        (a, b) => bandOrder[a.band] - bandOrder[b.band] || b.score - a.score,
      ),
    [person.id],
  );
  const breaches = orders.filter((o) => o.sla_remaining < 0).length;
  const emergencies = orders.filter((o) => o.status === "emergency_dispatched").length;
  const compliance = portfolioCompliance(person.id);
  const team = crewFor(person.id);
  const scopedPpm = ppm.filter((p) => scopeIds.includes(p.mosque_id));

  return (
    <div className="relative grid h-full min-h-0 grid-cols-[1fr_398px] grid-rows-[auto_minmax(0,1fr)] gap-4">
      {/* KPI row */}
      <div className="col-span-2 grid grid-cols-4 gap-3">
        <StatTile
          label={t("Open work orders", "أوامر العمل المفتوحة")}
          value={orders.length}
          tone="green"
          icon={<ClipboardList className="size-4 stroke-[1.5]" />}
          sub={
            <BidiText>
              {orders.map((o) => o.id).join(" | ")}
            </BidiText>
          }
        />
        <StatTile
          label={t("Service level breaches", "تجاوزات مستوى الخدمة")}
          value={breaches}
          tone={breaches > 0 ? "alert" : "success"}
          icon={
            breaches > 0 ? (
              <AlertTriangle className="size-4 stroke-[1.5]" />
            ) : (
              <CheckCircle2 className="size-4 stroke-[1.5]" />
            )
          }
          sub={breaches > 0 ? t("Escalate today", "تصعيد اليوم") : t("All within window", "الكل ضمن المهلة")}
        />
        <StatTile
          label={t("Emergency", "طوارئ")}
          value={emergencies}
          tone="warning"
          icon={<ShieldAlert className="size-4 stroke-[1.5]" />}
          sub={t("24h containment", "احتواء خلال ٢٤ ساعة")}
        />
        <StatTile
          label={t("Portfolio compliance", "التزام المحفظة")}
          value={`${compliance}%`}
          tone="green"
          icon={<CheckCircle2 className="size-4 stroke-[1.5]" />}
          sub={t(`${scopeIds.length} mosques under contract`, `${scopeIds.length} مساجد ضمن العقد`)}
        />
      </div>

      {/* Left: active work orders */}
      <section className="flex min-h-0 flex-col">
        <PanelTitle
          action={
            <Button
              size="sm"
              icon={<FileDown className="size-4 stroke-[1.5]" aria-hidden="true" />}
              onClick={() => setEvidenceOpen(true)}
            >
              {t("Export KPI evidence", "تصدير أدلة المؤشرات")}
            </Button>
          }
        >
          {t("Active work orders, most urgent first", "أوامر العمل النشطة، الأكثر إلحاحا أولا")}
        </PanelTitle>
        <div className="min-h-0 flex-1 space-y-2.5 overflow-auto pe-1">
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              assignedTo={assigned[order.id]}
              onAssign={(name) => setAssigned((prev) => ({ ...prev, [order.id]: name }))}
              team={team}
            />
          ))}
        </div>
      </section>

      {/* Right: team and PPM */}
      <section className="flex min-h-0 flex-col gap-3">
        <div>
          <PanelTitle>{t("Team on contract", "الفريق على العقد")}</PanelTitle>
          <Card padded={false}>
            <ul>
              {team.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center gap-3 border-b border-hairline/70 px-3 py-2.5 last:border-b-0"
                >
                  <Avatar initials={member.initials} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate t-body-sm font-medium text-ink">
                        {t(member.name_en, member.name_ar)}
                      </span>
                      {member.on_site ? (
                        <Chip
                          tone="success"
                          icon={<MapPin className="size-3.5 stroke-[1.5]" />}
                        >
                          {t("On site", "في الموقع")}
                        </Chip>
                      ) : null}
                    </div>
                    <p className="truncate t-caption text-muted-ink">
                      {t(member.trade_en, member.trade_ar)}
                      {" | "}
                      <BidiText>
                        {t(
                          `${member.mosques.length} mosques, ${member.radius_km} km`,
                          `${member.mosques.length} مساجد، ${member.radius_km} كم`,
                        )}
                      </BidiText>
                    </p>
                  </div>
                  <div className="w-20 shrink-0">
                    <div className="flex items-baseline justify-between t-caption text-muted-ink">
                      <span>{t("Load", "الحمل")}</span>
                      <BidiText className="tnum text-ink">
                        {member.load}/{member.capacity}
                      </BidiText>
                    </div>
                    <Meter
                      value={member.load}
                      max={member.capacity}
                      tone={member.load / member.capacity > 0.8 ? "warning" : "green"}
                      height={5}
                      label={t("Team load", "حمل الفريق")}
                      className="mt-1"
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="border-t border-hairline bg-sand-2 px-3 py-2 t-caption text-muted-ink">
              {t(
                "Regulation limit: 5 mosques or 4 km radius per team.",
                "الحد النظامي: خمسة مساجد أو نطاق أربعة كيلومترات لكل فريق.",
              )}
            </p>
          </Card>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <PanelTitle>{t("Planned maintenance", "الصيانة الوقائية")}</PanelTitle>
          <Card padded={false} className="min-h-0 flex-1 overflow-auto">
            <ul>
              {scopedPpm.map((item) => {
                const m = mosque(item.mosque_id);
                const tone =
                  item.state === "overdue"
                    ? "alert"
                    : item.state === "this_week"
                      ? "warning"
                      : "neutral";
                const stateLabel =
                  item.state === "overdue"
                    ? t("Overdue", "متأخر")
                    : item.state === "this_week"
                      ? t("This week", "هذا الأسبوع")
                      : t("Scheduled", "مجدول");
                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 border-b border-hairline/70 px-3 py-2.5 last:border-b-0"
                  >
                    <CalendarClock
                      className={cn(
                        "mt-0.5 size-4 shrink-0 stroke-[1.5]",
                        tone === "alert"
                          ? "text-alert"
                          : tone === "warning"
                            ? "text-warning"
                            : "text-muted-ink",
                      )}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate t-body-sm text-ink">
                        {t(item.title_en, item.title_ar)}
                      </p>
                      <p className="truncate t-caption text-muted-ink">
                        {t(m.name_en, m.name_ar)}
                        {" | "}
                        {t(item.due_en, item.due_ar)}
                      </p>
                    </div>
                    <Chip tone={tone}>{stateLabel}</Chip>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </section>

      {evidenceOpen ? (
        <KpiEvidenceSheet
          onClose={() => setEvidenceOpen(false)}
          supervisor={t(person.name_en, person.name_ar)}
          contractor={person.contractor ?? ""}
          mosqueCount={scopeIds.length}
        />
      ) : null}
    </div>
  );
}

function OrderRow({
  order,
  team,
  assignedTo,
  onAssign,
}: {
  order: WorkOrder;
  team: ReturnType<typeof crewFor>;
  assignedTo?: string | undefined;
  onAssign: (name: string) => void;
}) {
  const { t } = useDirection();
  const [picking, setPicking] = useState(false);
  const m = mosque(order.mosque_id);
  const zone = zoneName(order.zone);
  const owner = assignedTo ?? (order.assignee_en ? t(order.assignee_en, order.assignee_ar) : null);

  return (
    <Card className="p-3.5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <BidiText className="t-caption text-muted-ink tnum">{order.id}</BidiText>
            <SeverityChip severity={order.severity} />
            <StatusChip status={order.status} />
            <SlaChip remaining={order.sla_remaining} hours={order.sla_hours} />
          </div>
          <h3 className="mt-1.5 t-title text-ink">{t(order.title_en, order.title_ar)}</h3>
          <p className="t-caption text-muted-ink">
            {t(m.name_en, m.name_ar)}
            {" | "}
            {t(zone.name_en, zone.name_ar)}
            {" | "}
            {t(m.district, m.district_ar)}
          </p>
        </div>
        <div className="w-[190px] shrink-0 text-end">
          {owner ? (
            <div className="rounded-[9px] border border-hairline bg-sand-2 px-2.5 py-2">
              <p className="t-micro text-muted-ink">{t("Assigned to", "مُسند إلى")}</p>
              <p className="t-body-sm text-ink">{owner}</p>
            </div>
          ) : picking ? (
            <div className="rounded-[9px] border border-hairline bg-sand-2 p-1.5">
              {team.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    onAssign(t(member.name_en, member.name_ar));
                    setPicking(false);
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-[9px] px-2 py-2 text-start t-body-sm text-ink transition-calm hover:bg-card"
                >
                  <span className="truncate">{t(member.name_en, member.name_ar)}</span>
                  <BidiText className="t-caption text-muted-ink tnum">
                    {member.load}/{member.capacity}
                  </BidiText>
                </button>
              ))}
            </div>
          ) : (
            <Button
              size="sm"
              variant="primary"
              icon={<UserPlus className="size-4 stroke-[1.5]" aria-hidden="true" />}
              onClick={() => setPicking(true)}
            >
              {t("Assign a technician", "إسناد فني")}
            </Button>
          )}
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-4 border-t border-hairline/70 pt-2.5">
        <Dot
          tone={order.sla_remaining < 0 ? "alert" : "success"}
          label={t(
            order.sla_remaining < 0
              ? `Breached by ${Math.abs(order.sla_remaining)}h of the ${order.sla_hours}h window`
              : `${order.sla_remaining}h remaining of the ${order.sla_hours}h window`,
            order.sla_remaining < 0
              ? `تجاوز بمقدار ${Math.abs(order.sla_remaining)} ساعة من ${order.sla_hours} ساعة`
              : `${order.sla_remaining} ساعة متبقية من ${order.sla_hours} ساعة`,
          )}
        />
        <div className="flex-1">
          <Meter
            value={Math.max(0, order.sla_remaining)}
            max={order.sla_hours}
            tone={order.sla_remaining < 0 ? "alert" : order.sla_remaining <= order.sla_hours * 0.25 ? "warning" : "green"}
            height={5}
            label={t("Service level remaining", "المتبقي من مستوى الخدمة")}
          />
        </div>
        <span className="inline-flex items-center gap-1.5 t-caption text-muted-ink">
          <Users className="size-3.5 stroke-[1.5]" aria-hidden="true" />
          {t(order.raised_by_en, order.raised_by_ar)}
        </span>
      </div>
    </Card>
  );
}
