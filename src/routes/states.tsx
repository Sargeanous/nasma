import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { useDirection } from "@/lib/direction";
import { Wordmark } from "@/components/nasma/Wordmark";
import { Card, CardHeader, Denied, EmptyState } from "@/components/nasma/primitives";
import {
  ErrorState,
  LoadingRows,
  LoadingTiles,
  NoDataYet,
  OfflineBanner,
  SkipLink,
  StaleNotice,
  TilesUnavailable,
} from "@/components/nasma/states";

export const Route = createFileRoute("/states")({
  head: () => ({
    meta: [
      { title: "Edge states and accessibility - Nasma" },
      {
        name: "description",
        content:
          "Every edge state in Nasma: offline queueing, stale sync, permission refusal, empty and error states, loading skeletons, with the accessibility rules the platform holds itself to.",
      },
      { property: "og:title", content: "Edge states and accessibility - Nasma" },
      {
        property: "og:description",
        content:
          "Offline, stale, denied, empty, error and loading states across phone, board and laptop surfaces, plus the accessibility audit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StatesPage,
});

function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="t-title text-ink">{title}</h2>
        <p className="t-body-sm text-muted-ink">{sub}</p>
      </div>
      {children}
    </section>
  );
}

const audit: { en: string; ar: string }[] = [
  {
    en: "Every surface carries one h1, landmark regions and a skip link to the main content.",
    ar: "كل واجهة تحمل عنوانا رئيسيا واحدا ومناطق دلالية ورابط تخطٍّ إلى المحتوى.",
  },
  {
    en: "Focus is a two pixel gold ring at a two pixel offset, never removed, never colour only.",
    ar: "التركيز حلقة ذهبية بسمك بكسلين وإزاحة بكسلين، لا تُزال ولا تعتمد على اللون وحده.",
  },
  {
    en: "Status is never colour alone: every dot, chip and band pairs colour with a word or an icon.",
    ar: "الحالة لا تعتمد على اللون وحده: كل نقطة وشارة تقترن بكلمة أو أيقونة.",
  },
  {
    en: "Body text meets 4.5 to 1 on sand and card, secondary text meets 4.5 to 1 at 14 pixels and above.",
    ar: "نص المتن يحقق نسبة تباين ٤٫٥ إلى ١ على الخلفيتين، والنص الثانوي كذلك من ١٤ بكسل فأعلى.",
  },
  {
    en: "Touch targets on the phone and the board are at least 44 by 44 pixels.",
    ar: "أهداف اللمس على الهاتف واللوحة لا تقل عن ٤٤ في ٤٤ بكسل.",
  },
  {
    en: "Live regions announce offline, sync and refusal without stealing focus.",
    ar: "المناطق الحيّة تعلن انقطاع الاتصال والمزامنة والرفض دون سحب التركيز.",
  },
  {
    en: "Arabic mirrors through logical properties, while numerals, charts and axes stay left to right.",
    ar: "العربية تنعكس عبر الخصائص المنطقية، مع بقاء الأرقام والرسوم ومحاورها من اليسار إلى اليمين.",
  },
  {
    en: "Latin names inside Arabic sentences sit in bidi isolates so the punctuation never jumps.",
    ar: "الأسماء اللاتينية داخل الجمل العربية داخل عوازل اتجاهية فلا تقفز علامات الترقيم.",
  },
  {
    en: "Motion honours the reduced motion preference; animation collapses to an instant state change.",
    ar: "الحركة تحترم تفضيل تقليل الحركة؛ إذ تتحول إلى تغيّر فوري في الحالة.",
  },
  {
    en: "Refusal is server side. A denied panel states that the data never left the service.",
    ar: "الرفض يتم في الخادم، ولوحة المنع تُبيّن أن البيانات لم تغادر الخدمة.",
  },
];

function StatesPage() {
  const { t, lang, setLang } = useDirection();
  const [queued, setQueued] = useState(3);

  return (
    <div className="min-h-screen bg-sand">
      <SkipLink />
      <header className="border-b border-hairline bg-green text-sand">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-6 py-3">
          <Wordmark />
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="rounded-[8px] border border-sand/30 px-2.5 py-1.5 t-label text-sand transition-calm hover:bg-sand/10"
          >
            {lang === "en" ? "ع" : "EN"}
          </button>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-[1100px] space-y-10 px-6 py-8">
        <div>
          <h1 className="t-display text-ink">{t("Edge states", "الحالات الطرفية")}</h1>
          <p className="mt-1 max-w-[70ch] t-body text-muted-ink">
            {t(
              "What the platform looks like when the network drops, the data is old, the request is refused, there is nothing to show, or something fails outright.",
              "كيف تبدو المنصة عند انقطاع الشبكة، أو قِدَم البيانات، أو رفض الطلب، أو غياب ما يُعرض، أو حدوث خطأ.",
            )}
          </p>
        </div>

        <Section
          title={t("Offline on the phone", "دون اتصال على الهاتف")}
          sub={t(
            "Basements and plant rooms lose signal. Work continues and entries queue on the device.",
            "الأقبية وغرف المعدات تفقد الإشارة. يستمر العمل وتُحفظ الإدخالات على الجهاز.",
          )}
        >
          <div className="space-y-3">
            <OfflineBanner forceVisible queued={queued} />
            <OfflineBanner forceVisible />
            <button
              type="button"
              onClick={() => setQueued((q) => (q === 3 ? 1 : 3))}
              className="rounded-[9px] border border-hairline bg-card px-3 py-2 t-label text-ink transition-calm hover:bg-sand-2"
            >
              {t("Toggle the queue count", "تبديل عدد العناصر المعلّقة")}
            </button>
          </div>
        </Section>

        <Section
          title={t("Stale data", "بيانات قديمة")}
          sub={t(
            "A board on a wall can sit for hours. It says how old it is rather than pretending to be live.",
            "قد تبقى اللوحة معروضة ساعات، فتُظهر عمر بياناتها بدل الادّعاء بأنها لحظية.",
          )}
        >
          <StaleNotice minutes={17} onRefresh={() => {}} />
        </Section>

        <Section
          title={t("Refused by the server", "مرفوض من الخادم")}
          sub={t(
            "Permission is enforced in the service, not by hiding buttons.",
            "الصلاحية تُطبّق في الخدمة، لا بإخفاء الأزرار.",
          )}
        >
          <Denied />
        </Section>

        <Section
          title={t("Nothing to show", "لا يوجد ما يُعرض")}
          sub={t(
            "An empty list is often good news: no breaches, no faults, no overdue checks.",
            "القائمة الفارغة غالبا خبر جيد: لا مخالفات ولا أعطال ولا فحوص متأخرة.",
          )}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <EmptyState
              line={t(
                "No SLA breaches in your zone today. The next review is after Asr.",
                "لا خروقات لاتفاقية مستوى الخدمة في منطقتك اليوم. المراجعة القادمة بعد العصر.",
              )}
            />
            <NoDataYet />
          </div>
        </Section>

        <Section
          title={t("Something failed", "حدث خطأ")}
          sub={t(
            "Errors name what did not happen and confirm nothing was lost.",
            "الأخطاء تُسمّي ما لم يحدث وتؤكد أن شيئا لم يُفقد.",
          )}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <ErrorState onRetry={() => {}} />
            <Card className="flex items-center justify-center">
              <TilesUnavailable />
            </Card>
          </div>
        </Section>

        <Section
          title={t("Loading", "جارٍ التحميل")}
          sub={t(
            "Skeletons match the shape that arrives, so nothing jumps when the data lands.",
            "الهياكل المؤقتة تطابق شكل المحتوى القادم، فلا يقفز شيء عند وصول البيانات.",
          )}
        >
          <div className="space-y-3">
            <LoadingTiles />
            <LoadingRows />
          </div>
        </Section>

        <Section
          title={t("Accessibility audit", "تدقيق إمكانية الوصول")}
          sub={t(
            "The rules every surface in Nasma is held to.",
            "القواعد التي تلتزم بها كل واجهة في نسمة.",
          )}
        >
          <Card>
            <CardHeader
              title={t("Held to on phone, board and laptop", "مطبّقة على الهاتف واللوحة والحاسوب")}
            />
            <ul className="mt-3 space-y-2.5">
              {audit.map((item) => (
                <li key={item.en} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 stroke-[1.8] text-green" aria-hidden="true" />
                  <span className="t-body-sm text-ink">{t(item.en, item.ar)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Section>
      </main>
    </div>
  );
}
