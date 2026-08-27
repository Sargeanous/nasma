import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Wordmark } from "@/components/nasma/Wordmark";
import { GeometricMark } from "@/components/nasma/GeometricMark";
import { BidiText } from "@/lib/bidi";
import { useDirection } from "@/lib/direction";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nasma Foundation - Tokens, Type and RTL" },
      {
        name: "description",
        content:
          "Stage one of Nasma: colour tokens, type scale, form language and bilingual RTL infrastructure for the Awqaf mosque operations platform.",
      },
      { property: "og:title", content: "Nasma Foundation - Tokens, Type and RTL" },
      {
        property: "og:description",
        content: "Colour tokens, type scale and bilingual RTL infrastructure for Nasma.",
      },
    ],
  }),
  component: Foundation,
});

const palette = [
  { name: "deep-green", hex: "#0A4239", cls: "bg-deep-green" },
  { name: "green", hex: "#0E5E50", cls: "bg-green" },
  { name: "gold", hex: "#B98A2F", cls: "bg-gold" },
  { name: "gold-light", hex: "#CFA14C", cls: "bg-gold-light" },
  { name: "sand", hex: "#F2EFE7", cls: "bg-sand" },
  { name: "sand-2", hex: "#F4F1E9", cls: "bg-sand-2" },
  { name: "sand-3", hex: "#EDEAE0", cls: "bg-sand-3" },
  { name: "hairline", hex: "#DDD7C8", cls: "bg-hairline" },
  { name: "ink", hex: "#1B1E1C", cls: "bg-ink" },
  { name: "muted", hex: "#79756A", cls: "bg-muted-ink" },
  { name: "success", hex: "#1F7A4D", cls: "bg-success" },
  { name: "warning", hex: "#B4690E", cls: "bg-warning" },
  { name: "alert", hex: "#B3372E", cls: "bg-alert" },
];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline pt-6">
      <h2 className="t-micro text-muted-ink">{label}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Foundation() {
  const { lang, dir, toggleLang, t } = useDirection();

  return (
    <main className="min-h-screen bg-sand">
      <header className="border-b border-hairline bg-deep-green">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between px-6 py-4">
          <Wordmark tone="light" />
          <div className="flex items-center gap-3">
            <span className="t-micro text-primary-foreground/70">
              {t("Stage 1 - Foundation", "المرحلة الأولى - الأساس")}
            </span>
            <button
              onClick={toggleLang}
              className="rounded-[9px] border border-primary-foreground/30 px-3 py-1.5 t-body-sm text-primary-foreground transition-calm hover:bg-primary-foreground/10"
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1000px] space-y-8 px-6 py-8">
        <div className="relative overflow-hidden card-hairline p-6">
          <div className="geo-watermark pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <h1 className="t-heading text-ink">
              {t("Design tokens and RTL infrastructure", "الرموز التصميمية وبنية الاتجاه")}
            </h1>
            <p className="mt-2 max-w-[62ch] t-body text-muted-ink">
              {t(
                "Institutional calm. Swiss information discipline in a Gulf palette. Every surface after this one draws from these tokens.",
                "هدوء مؤسسي. انضباط المعلومات السويسري بلوحة ألوان خليجية. كل الشاشات تعتمد على هذه الرموز.",
              )}
            </p>
            <p className="mt-3 t-body-sm text-muted-ink">
              {t("Active direction", "الاتجاه الحالي")}: <BidiText>{dir.toUpperCase()}</BidiText>
            </p>
          </div>
        </div>

        <Section label={t("Palette", "لوحة الألوان")}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {palette.map((c) => (
              <div key={c.name} className="card-hairline overflow-hidden">
                <div className={`h-14 ${c.cls}`} />
                <div className="border-t border-hairline px-2.5 py-2">
                  <div className="t-caption text-ink">{c.name}</div>
                  <BidiText className="t-caption text-muted-ink">{c.hex}</BidiText>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label={t("Type scale", "مقياس الخط")}>
          <div className="card-hairline divide-y divide-hairline">
            {[
              ["t-numeral-lg", "36 / 40", "1,482"],
              ["t-numeral", "28 / 32", "AED 33,559"],
              ["t-heading", "22 / 28", t("Fleet overview", "نظرة عامة على الأسطول")],
              ["t-title", "17 / 24", t("Active work orders", "أوامر العمل النشطة")],
              ["t-body", "15 / 24", t("Carpet water damage near entrance", "تلف مياه بالسجاد قرب المدخل")],
              ["t-body-sm", "13 / 20", t("Technician assigned: Ramesh Kumar", "الفني المكلف: راميش كومار")],
              ["t-caption", "12 / 18", t("Weather-normalised on cooling degree days", "معدلة حسب درجات التبريد")],
              ["t-micro", "11 / 16", "SLA REMAINING"],
            ].map(([cls, spec, sample]) => (
              <div key={cls} className="flex items-baseline gap-4 px-4 py-3">
                <BidiText className="w-28 shrink-0 t-caption text-muted-ink">{cls}</BidiText>
                <BidiText className="w-16 shrink-0 t-caption text-muted-ink">{spec}</BidiText>
                <span className={`${cls} text-ink`}>{sample}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 t-caption text-muted-ink">
            {t(
              "Schibsted Grotesk for Latin, IBM Plex Sans Arabic for Arabic, Marcellus for the word Nasma only.",
              "شبستد جروتسك للاتينية، آي بي إم بلكس سانس عربي للعربية، ومارسيلوس لكلمة نسمة فقط.",
            )}
          </p>
        </Section>

        <Section label={t("Form language", "لغة الشكل")}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="card-hairline p-4">
              <div className="t-micro text-muted-ink">{t("Controls", "عناصر التحكم")}</div>
              <button className="mt-3 min-h-11 w-full rounded-[9px] bg-deep-green px-4 t-body-sm font-medium text-primary-foreground transition-calm hover:bg-green">
                {t("Confirm", "تأكيد")}
              </button>
              <button className="mt-2 min-h-11 w-full rounded-[9px] border border-hairline bg-card px-4 t-body-sm text-ink transition-calm hover:bg-sand-3">
                {t("Cancel", "إلغاء")}
              </button>
              <p className="mt-3 t-caption text-muted-ink">{t("Radius 9px", "نصف قطر ٩ بكسل")}</p>
            </div>
            <div className="card-hairline p-4 shadow-soft">
              <div className="t-micro text-muted-ink">{t("Cards", "البطاقات")}</div>
              <p className="mt-3 t-body-sm text-ink">
                {t(
                  "Radius 12 to 16px, elevation by 1px hairline plus a very soft shadow.",
                  "نصف قطر ١٢ إلى ١٦ بكسل، والارتفاع عبر خط شعري وظل ناعم جدا.",
                )}
              </p>
            </div>
            <div className="card-hairline flex flex-col items-center justify-center gap-2 p-4">
              <GeometricMark size={72} opacity={0.16} />
              <p className="t-caption text-muted-ink">
                {t("Empty-state mark", "علامة الحالة الفارغة")}
              </p>
            </div>
          </div>
        </Section>

        <Section label={t("Bidi isolation and mirroring", "عزل الاتجاه والانعكاس")}>
          <div className="card-hairline space-y-3 p-4">
            <p className="t-body text-ink">
              {t("Ticket", "التذكرة")} <BidiText>t-1001</BidiText> {t("at", "في")}{" "}
              <BidiText>12:27</BidiText>, <BidiText>SLA</BidiText>{" "}
              <BidiText>5h</BidiText> {t("remaining, compliance", "متبقية، الالتزام")}{" "}
              <BidiText>88%</BidiText>.
            </p>
            <p className="t-caption text-muted-ink">
              {t(
                "Latin runs are wrapped in U+2068 / U+2069 isolates so they hold position inside Arabic text.",
                "النصوص اللاتينية معزولة برموز الاتجاه حتى تبقى في موضعها داخل النص العربي.",
              )}
            </p>
            <div className="flex items-center gap-2 t-body-sm text-ink">
              <span>{t("Directional icon mirrors", "الأيقونة الاتجاهية تنعكس")}</span>
              <ChevronRight className="icon-directional size-4 stroke-[1.5]" aria-hidden="true" />
            </div>
          </div>
        </Section>

        <Section label={t("House rules", "قواعد الكتابة")}>
          <ul className="card-hairline divide-y divide-hairline t-body-sm text-ink">
            <li className="px-4 py-2.5">
              {t(
                "No em dashes, no en dashes, no middle dot. Hyphen or vertical bar only.",
                "لا شرطات طويلة أو متوسطة أو نقطة وسطى. شرطة أو خط عمودي فقط.",
              )}
            </li>
            <li className="px-4 py-2.5">
              {t(
                "Logical CSS only: margin-inline, padding-inline, inset-inline, text-align start and end.",
                "خصائص منطقية فقط في التنسيق، دون يمين أو يسار.",
              )}
            </li>
            <li className="px-4 py-2.5">
              {t(
                "Never encode meaning in colour alone. Every tone carries a label or an icon.",
                "لا يُعبَّر عن المعنى باللون وحده. لكل حالة تسمية أو أيقونة.",
              )}
            </li>
          </ul>
        </Section>
      </div>
    </main>
  );
}
