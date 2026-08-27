import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/lib/direction";
import { Wordmark } from "@/components/nasma/Wordmark";
import { DatePair, Avatar } from "@/components/nasma/pairs";

/**
 * The 402pt phone column, centred on larger screens. Everything inside is
 * one-hand reachable and never wider than the column.
 */
export function PhoneFrame({
  children,
  initials,
  onSwitchLang,
  className,
}: {
  children: ReactNode;
  initials: string;
  onSwitchLang: () => void;
  className?: string;
}) {
  const { t, lang } = useDirection();

  return (
    <div className="min-h-screen bg-sand-3 py-0 sm:py-8">
      <div
        className={cn(
          "relative mx-auto flex min-h-screen w-full max-w-[402px] flex-col bg-sand shadow-lift sm:min-h-[860px] sm:rounded-[28px] sm:border sm:border-hairline",
          className,
        )}
      >
        <header className="sticky top-0 z-30 rounded-t-none bg-deep-green px-4 pb-3 pt-4 sm:rounded-t-[28px]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                aria-label={t("Back to role selection", "العودة إلى اختيار الدور")}
                className="-ms-2 inline-flex size-11 items-center justify-center rounded-[9px] text-primary-foreground/80 transition-calm hover:bg-primary-foreground/10"
              >
                <ChevronLeft className="icon-directional size-5 stroke-[1.5]" aria-hidden="true" />
              </Link>
              <Wordmark tone="light" />
            </div>
            <div className="flex items-center gap-2">
              <DatePair tone="light" align="end" />
              <button
                type="button"
                onClick={onSwitchLang}
                aria-label={t("Switch to Arabic", "Switch to English")}
                className="inline-flex size-11 items-center justify-center rounded-[9px] border border-primary-foreground/25 t-caption text-primary-foreground transition-calm hover:bg-primary-foreground/10"
              >
                {lang === "ar" ? "EN" : "ع"}
              </button>
              <Avatar initials={initials} tone="gold" size={40} />
            </div>
          </div>
        </header>

        <main id="main" className="flex-1 space-y-3 px-4 pb-10 pt-3">{children}</main>
      </div>
    </div>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-1 pt-2">
      <h2 className="t-micro text-muted-ink">{children}</h2>
      {action}
    </div>
  );
}
