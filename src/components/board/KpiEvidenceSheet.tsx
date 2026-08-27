import { Printer, X } from "lucide-react";
import { useDirection } from "@/lib/direction";
import { BidiText } from "@/lib/bidi";
import { Button } from "@/components/nasma/Button";
import { GeometricMark } from "@/components/nasma/GeometricMark";
import { dates } from "@/data/prayer";
import { kpiEvidence } from "@/data/board";

/** A print-ready contract evidence document, shown over the board. */
export function KpiEvidenceSheet({
  onClose,
  supervisor,
  contractor,
  mosqueCount,
}: {
  onClose: () => void;
  supervisor: string;
  contractor: string;
  mosqueCount: number;
}) {
  const { t, lang } = useDirection();

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink/35 p-6">
      <div className="flex max-h-full w-[720px] flex-col overflow-hidden rounded-[16px] border border-hairline bg-card shadow-lift">
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <h2 className="t-title text-ink">{t("KPI evidence", "أدلة مؤشرات الأداء")}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close", "إغلاق")}
            className="inline-flex size-11 items-center justify-center rounded-[9px] text-muted-ink transition-calm hover:bg-sand-2"
          >
            <X className="size-5 stroke-[1.5]" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-6 py-5">
          <div className="relative overflow-hidden rounded-[12px] border border-hairline bg-sand-2 p-5">
            <GeometricMark
              className="pointer-events-none absolute -end-6 -top-6 size-40 text-green/8"
              aria-hidden="true"
            />
            <p className="t-micro text-muted-ink">
              {t("Awqaf Abu Dhabi | Nasma", "أوقاف أبوظبي | نسمة")}
            </p>
            <h3 className="mt-1 t-heading text-ink">
              {t("Monthly contract performance", "أداء العقد الشهري")}
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
              <Row label={t("Contractor", "المقاول")} value={contractor} />
              <Row label={t("Supervisor", "المشرف")} value={supervisor} />
              <Row
                label={t("Mosques in contract", "المساجد في العقد")}
                value={String(mosqueCount)}
              />
              <Row
                label={t("Issued", "تاريخ الإصدار")}
                value={lang === "ar" ? dates.gregorian_ar : dates.gregorian_en}
              />
            </div>
          </div>

          <table className="mt-5 w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-hairline px-3 py-2 text-start t-micro text-muted-ink">
                  {t("Measure", "المؤشر")}
                </th>
                <th className="border-b border-hairline px-3 py-2 text-end t-micro text-muted-ink">
                  {t("Result", "النتيجة")}
                </th>
                <th className="border-b border-hairline px-3 py-2 text-start t-micro text-muted-ink">
                  {t("Evidence", "الدليل")}
                </th>
              </tr>
            </thead>
            <tbody>
              {kpiEvidence.map((row) => (
                <tr key={row.label_en} className="border-b border-hairline/70 last:border-b-0">
                  <td className="px-3 py-2.5 t-body-sm text-ink">
                    {t(row.label_en, row.label_ar)}
                  </td>
                  <td className="px-3 py-2.5 text-end t-body-sm font-medium text-ink tnum">
                    <BidiText>{row.value}</BidiText>
                  </td>
                  <td className="px-3 py-2.5 t-caption text-muted-ink">
                    {t(row.note_en, row.note_ar)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-4 t-caption text-muted-ink">
            {t(
              "Figures are taken from the work order record. Every closed job carries a photo and the confirmation of the imam or caretaker who lives with the fix.",
              "الأرقام مأخوذة من سجل أوامر العمل. كل عمل مغلق يحمل صورة وتأكيدا من الإمام أو خادم المسجد.",
            )}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-hairline px-6 py-4">
          <p className="t-caption text-muted-ink">
            {t("Ready to print or send to Awqaf HQ.", "جاهز للطباعة أو الإرسال إلى المقر.")}
          </p>
          <div className="flex gap-2">
            <Button onClick={onClose}>{t("Close", "إغلاق")}</Button>
            <Button
              variant="primary"
              icon={<Printer className="size-4 stroke-[1.5]" aria-hidden="true" />}
              onClick={() => window.print()}
            >
              {t("Print", "طباعة")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-hairline/60 pb-1">
      <span className="t-caption text-muted-ink">{label}</span>
      <span className="t-body-sm text-ink">{value}</span>
    </div>
  );
}
