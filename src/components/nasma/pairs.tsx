import { cn } from "@/lib/utils";
import { useDirection } from "@/lib/direction";
import { dates } from "@/data/prayer";

/** Gregorian and Hijri always travel together. */
export function DatePair({
  className,
  align = "start",
  tone = "ink",
}: {
  className?: string;
  align?: "start" | "end";
  tone?: "ink" | "light";
}) {
  const { lang } = useDirection();
  const greg = lang === "ar" ? dates.gregorian_ar : dates.gregorian_en;
  const hijri = lang === "ar" ? dates.hijri_ar : dates.hijri_en;

  return (
    <div className={cn(align === "end" ? "text-end" : "text-start", className)}>
      <div className={cn("t-caption", tone === "light" ? "text-primary-foreground" : "text-ink")}>
        {greg}
      </div>
      <div
        className={cn(
          "t-caption",
          tone === "light" ? "text-primary-foreground/70" : "text-muted-ink",
        )}
      >
        {hijri}
      </div>
    </div>
  );
}

/** English name with the Arabic twin beneath, or the reverse under RTL. */
export function NamePair({
  en,
  ar,
  className,
  size = "md",
  tone = "ink",
}: {
  en: string;
  ar: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  tone?: "ink" | "light";
}) {
  const { lang } = useDirection();
  const primary = lang === "ar" ? ar : en;
  const secondary = lang === "ar" ? en : ar;
  const primaryDir = lang === "ar" ? "rtl" : "ltr";
  const secondaryDir = lang === "ar" ? "ltr" : "rtl";

  const sizes = { sm: "t-body-sm", md: "t-body", lg: "t-title" } as const;

  return (
    <div className={cn("min-w-0", className)}>
      <div
        dir={primaryDir}
        className={cn(
          "truncate font-medium",
          sizes[size],
          tone === "light" ? "text-primary-foreground" : "text-ink",
        )}
      >
        {primary}
      </div>
      <div
        dir={secondaryDir}
        className={cn(
          "truncate t-caption",
          secondaryDir === "rtl" && "font-arabic",
          tone === "light" ? "text-primary-foreground/70" : "text-muted-ink",
        )}
      >
        {secondary}
      </div>
    </div>
  );
}

export function Avatar({
  initials,
  tone = "green",
  size = 40,
}: {
  initials: string;
  tone?: "green" | "gold" | "deep";
  size?: number;
}) {
  const tones = {
    green: "bg-green/12 text-green border-green/25",
    gold: "bg-[oklch(0.93_0.035_79.6)] text-[oklch(0.38_0.09_79.6)] border-gold/40",
    deep: "bg-deep-green text-primary-foreground border-transparent",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border font-medium tnum",
        tones[tone],
      )}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
