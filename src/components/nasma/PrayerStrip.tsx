import { cn } from "@/lib/utils";
import { BidiText } from "@/lib/bidi";
import { useDirection } from "@/lib/direction";
import { prayerTimes, nextPrayer } from "@/data/prayer";

export function PrayerStrip({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { t } = useDirection();
  const next = nextPrayer();
  const five = prayerTimes.filter((p) => p.key !== "shuruq");

  return (
    <section
      aria-label={t("Prayer times today", "مواقيت الصلاة اليوم")}
      className={cn(
        "rounded-[12px] border border-hairline bg-deep-green text-primary-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-primary-foreground/15 px-3 py-2">
        <span className="t-micro text-primary-foreground/70">
          {t("Prayer times", "مواقيت الصلاة")}
        </span>
        <span className="t-caption text-primary-foreground/80">
          {t("Adhan and iqamah", "الأذان والإقامة")}
        </span>
      </div>
      <ol className="grid grid-cols-5">
        {five.map((p) => {
          const isNext = p.key === next.key;
          return (
            <li
              key={p.key}
              aria-current={isNext ? "step" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-1 py-2.5 text-center",
                isNext && "bg-gold/20",
              )}
            >
              {isNext ? (
                <span
                  className="absolute inset-x-0 top-0 h-[2px] bg-gold"
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={cn(
                  "t-caption",
                  isNext ? "text-gold-light" : "text-primary-foreground/70",
                )}
              >
                {t(p.name_en, p.name_ar)}
              </span>
              <BidiText className={cn("t-body-sm font-semibold", !compact && "text-[0.9375rem]")}>
                {p.adhan}
              </BidiText>
              <BidiText className="t-caption text-primary-foreground/65">{p.iqamah}</BidiText>
              {isNext ? (
                <span className="t-caption font-medium text-gold-light">
                  {t("Next", "التالية")}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
