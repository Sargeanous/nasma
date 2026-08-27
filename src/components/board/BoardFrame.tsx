import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/lib/direction";
import { Wordmark } from "@/components/nasma/Wordmark";
import { DatePair, Avatar, NamePair } from "@/components/nasma/pairs";

const W = 1194;
const H = 834;

/**
 * The iPad board, landscape, exactly one viewport. Nothing scrolls at the page
 * level; each panel owns its own scroll container.
 */
export function BoardFrame({
  children,
  person,
  deviceLabel,
  contractLine,
  onSwitchLang,
}: {
  children: ReactNode;
  person: { name_en: string; name_ar: string; initials: string };
  deviceLabel: string;
  contractLine: ReactNode;
  onSwitchLang: () => void;
}) {
  const { t, lang } = useDirection();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () =>
      setScale(Math.min(1, window.innerWidth / (W + 24), window.innerHeight / (H + 24)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-sand-3">
      <div
        style={{ width: W, height: H, transform: `scale(${scale})` }}
        className={cn(
          "flex shrink-0 flex-col overflow-hidden rounded-[18px] border border-hairline bg-sand shadow-lift",
        )}
      >
        <header className="flex shrink-0 items-center justify-between gap-6 bg-deep-green px-5 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label={t("Back to role selection", "العودة إلى اختيار الدور")}
              className="-ms-2 inline-flex size-11 items-center justify-center rounded-[9px] text-primary-foreground/80 transition-calm hover:bg-primary-foreground/10"
            >
              <ChevronLeft className="icon-directional size-5 stroke-[1.5]" aria-hidden="true" />
            </Link>
            <Wordmark tone="light" />
            <span className="ms-2 rounded-[9px] border border-primary-foreground/25 px-2.5 py-1 t-micro text-primary-foreground/85">
              {deviceLabel}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <DatePair tone="light" align="end" />
            <span className="h-8 w-px bg-primary-foreground/20" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <div className="text-end">
                <NamePair
                  en={person.name_en}
                  ar={person.name_ar}
                  tone="light"
                  size="sm"
                  className="text-end"
                />
                <div className="t-caption text-primary-foreground/70">{contractLine}</div>
              </div>
              <Avatar initials={person.initials} tone="gold" size={40} />
            </div>
            <button
              type="button"
              onClick={onSwitchLang}
              aria-label={t("Switch to Arabic", "Switch to English")}
              className="inline-flex size-11 items-center justify-center rounded-[9px] border border-primary-foreground/25 t-caption text-primary-foreground transition-calm hover:bg-primary-foreground/10"
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden p-4">{children}</div>
      </div>
    </div>
  );
}

export function PanelTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <h2 className="t-micro text-muted-ink">{children}</h2>
      {action}
    </div>
  );
}
