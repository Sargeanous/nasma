import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wrench } from "lucide-react";
import {
  BandChip,
  Card,
  CardHeader,
  Chip,
  DataTable,
  Denied,
  Dot,
  EmptyState,
  Meter,
  SeverityChip,
  Skeleton,
  SlaChip,
  StatTile,
  StatusChip,
  Timeline,
} from "@/components/nasma/primitives";
import { PrayerStrip } from "@/components/nasma/PrayerStrip";
import { Avatar, DatePair, NamePair } from "@/components/nasma/pairs";
import { TaskRow } from "@/components/nasma/TaskRow";
import { BottomSheet } from "@/components/nasma/BottomSheet";
import { Button } from "@/components/nasma/Button";
import { Wordmark } from "@/components/nasma/Wordmark";
import { useDirection } from "@/lib/direction";
import { workOrders, mosques, formatAED } from "@/data";
import type { Mosque } from "@/data/types";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Nasma Component Library" },
      {
        name: "description",
        content:
          "The Nasma component library: cards, stat tiles, chips, meters, tables, timelines, prayer strip and sheets, all bilingual and RTL ready.",
      },
      { property: "og:title", content: "Nasma Component Library" },
      {
        property: "og:description",
        content: "Bilingual, RTL-ready building blocks for the Nasma mosque operations platform.",
      },
    ],
  }),
  component: Library,
});

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline pt-5">
      <h2 className="t-micro text-muted-ink">{label}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Library() {
  const { t, lang, toggleLang } = useDirection();
  const [sheet, setSheet] = useState(false);
  const order = workOrders[0]!;

  const columns = [
    {
      key: "name",
      header: t("Mosque", "المسجد"),
      render: (m: Mosque) => <NamePair en={m.name_en} ar={m.name_ar} size="sm" />,
    },
    {
      key: "district",
      header: t("District", "المنطقة"),
      render: (m: Mosque) => t(m.district, m.district_ar),
    },
    {
      key: "capacity",
      header: t("Capacity", "السعة"),
      align: "end" as const,
      numeric: true,
      render: (m: Mosque) => m.capacity.toLocaleString("en-US"),
    },
    {
      key: "compliance",
      header: t("Compliance", "الالتزام"),
      align: "end" as const,
      numeric: true,
      render: (m: Mosque) => `${m.compliance}%`,
    },
    {
      key: "elec",
      header: t("Electricity", "الكهرباء"),
      align: "end" as const,
      numeric: true,
      render: (m: Mosque) => formatAED(m.utilities[11]!.electricity_aed),
    },
  ];

  return (
    <main className="min-h-screen bg-sand">
      <header className="border-b border-hairline bg-deep-green">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4">
          <Wordmark tone="light" />
          <div className="flex items-center gap-3">
            <span className="t-micro text-primary-foreground/70">
              {t("Stage 3 - Component library", "المرحلة الثالثة - مكتبة المكونات")}
            </span>
            <button
              onClick={toggleLang}
              className="min-h-9 rounded-[9px] border border-primary-foreground/30 px-3 t-body-sm text-primary-foreground transition-calm hover:bg-primary-foreground/10"
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] space-y-7 px-6 py-8">
        <Block label={t("Stat tiles", "بطاقات الأرقام")}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label={t("Average compliance", "متوسط الالتزام")} value="88%" sub={t("Across 12 mosques", "عبر ١٢ مسجدا")} tone="green" />
            <StatTile label={t("Open faults", "الأعطال المفتوحة")} value="6" sub={t("1 breaching SLA", "واحد تجاوز مستوى الخدمة")} tone="warning" />
            <StatTile label={t("Electricity", "الكهرباء")} value="AED 33,559" sub={t("This month", "هذا الشهر")} />
            <StatTile label={t("Emergency", "طوارئ")} value="1" sub={t("24h containment", "احتواء خلال ٢٤ ساعة")} tone="alert" />
          </div>
        </Block>

        <Block label={t("Chips, dots and meters", "الشرائح والنقاط والمقاييس")}>
          <Card className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <SeverityChip severity="critical" />
              <SeverityChip severity="high" />
              <SeverityChip severity="medium" />
              <StatusChip status="assigned" />
              <StatusChip status="escalated" />
              <BandChip band="do_now" />
              <BandChip band="escalate" />
              <BandChip band="batch" />
              <BandChip band="plan" />
              <SlaChip remaining={5} hours={24} />
              <SlaChip remaining={-9} hours={48} />
              <Chip tone="green" icon={<Wrench className="size-3.5 stroke-[1.5]" />}>
                {t("On plan", "ضمن الخطة")}
              </Chip>
            </div>
            <div className="flex flex-wrap gap-4">
              <Dot tone="success" label={t("On plan", "ضمن الخطة")} />
              <Dot tone="warning" label={t("Manual schedule", "جدول يدوي")} />
              <Dot tone="alert" label={t("Needs attention", "يحتاج تدخلا")} />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <Meter value={88} tone="green" label="compliance" />
              <Meter value={54} tone="warning" label="sla" />
              <Meter value={22} tone="alert" label="risk" />
            </div>
          </Card>
        </Block>

        <Block label={t("Prayer strip and date pair", "شريط الصلاة وزوج التاريخ")}>
          <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
            <PrayerStrip />
            <Card>
              <CardHeader title={t("Today", "اليوم")} />
              <DatePair className="mt-2" />
              <div className="mt-4 flex items-center gap-3">
                <Avatar initials="YM" />
                <NamePair en="Sheikh Yousef Al Marzooqi" ar="الشيخ يوسف المرزوقي" />
              </div>
            </Card>
          </div>
        </Block>

        <Block label={t("Task rows", "صفوف المهام")}>
          <div className="grid gap-2 lg:grid-cols-2">
            {workOrders.slice(0, 4).map((w) => (
              <TaskRow key={w.id} order={w} onSelect={() => setSheet(true)} />
            ))}
          </div>
        </Block>

        <Block label={t("Data table", "جدول البيانات")}>
          <DataTable columns={columns} rows={mosques} rowKey={(m) => m.id} maxHeight={300} />
        </Block>

        <Block label={t("Timeline", "الخط الزمني")}>
          <Card>
            <Timeline
              items={order.timeline.map((e) => ({
                actor: t(e.actor_en, e.actor_ar),
                role: t(e.role_en, e.role_ar),
                change: t(e.change_en, e.change_ar),
                timestamp: e.timestamp,
              }))}
            />
          </Card>
        </Block>

        <Block label={t("States", "الحالات")}>
          <div className="grid gap-3 lg:grid-cols-3">
            <EmptyState
              line={t(
                "No open work orders at this mosque today.",
                "لا توجد أوامر عمل مفتوحة في هذا المسجد اليوم.",
              )}
            />
            <Denied />
            <Card className="space-y-2">
              <span className="t-micro text-muted-ink">{t("Loading", "جار التحميل")}</span>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </Card>
          </div>
        </Block>

        <Block label={t("Buttons and sheet", "الأزرار واللوحة")}>
          <Card className="relative flex flex-wrap gap-2 overflow-hidden" >
            <Button variant="primary">{t("Confirm", "تأكيد")}</Button>
            <Button variant="secondary">{t("Assign", "إسناد")}</Button>
            <Button variant="gold">{t("Report a fault", "الإبلاغ عن عطل")}</Button>
            <Button variant="danger">{t("Emergency", "طوارئ")}</Button>
            <Button variant="quiet" onClick={() => setSheet(true)}>
              {t("Open bottom sheet", "فتح اللوحة السفلية")}
            </Button>
          </Card>
        </Block>
      </div>

      <div className="relative">
        <BottomSheet
          open={sheet}
          onClose={() => setSheet(false)}
          contained={false}
          title={t("Work order", "أمر عمل")}
          className="mx-auto max-w-[402px]"
          footer={
            <Button variant="primary" full onClick={() => setSheet(false)}>
              {t("Close", "إغلاق")}
            </Button>
          }
        >
          <TaskRow order={order} />
        </BottomSheet>
      </div>
    </main>
  );
}
