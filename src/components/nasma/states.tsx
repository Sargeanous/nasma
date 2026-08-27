import { useEffect, useState, type ReactNode } from "react";
import { CloudOff, RefreshCw, TriangleAlert, WifiOff, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/lib/direction";
import { GeometricMark } from "./GeometricMark";
import { Skeleton } from "./primitives";

/* ------------------------------------------------------------- Skip link */

export function SkipLink({ targetId = "main" }: { targetId?: string }) {
  const { t } = useDirection();
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[200] focus:rounded-[9px] focus:border focus:border-hairline focus:bg-card focus:px-4 focus:py-2 focus:t-body-sm focus:text-ink"
    >
      {t("Skip to the main content", "تخطَّ إلى المحتوى الرئيسي")}
    </a>
  );
}

/* ------------------------------------------------------------ Visually hidden */

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/* --------------------------------------------------------- Offline banner */

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  return online;
}

export function OfflineBanner({
  queued = 0,
  className,
  forceVisible = false,
}: {
  queued?: number;
  className?: string;
  forceVisible?: boolean;
}) {
  const { t, lang } = useDirection();
  const online = useOnline();
  if (online && !forceVisible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center gap-3 rounded-[11px] border border-warning/25 bg-warning/10 px-3 py-2.5",
        className,
      )}
    >
      <WifiOff className="size-4 shrink-0 stroke-[1.6] text-warning" aria-hidden="true" />
      <div className="min-w-0">
        <p className="t-label text-warning">{t("Working offline", "العمل دون اتصال")}</p>
        <p className="t-body-sm text-muted-ink">
          {queued > 0
            ? t(
                `${queued} ${queued === 1 ? "entry is" : "entries are"} held on this device and will send when the signal returns.`,
                `${lang === "ar" ? new Intl.NumberFormat("ar-AE").format(queued) : queued} إدخالات محفوظة على الجهاز وسترسل عند عودة الاتصال.`,
              )
            : t(
                "You can keep recording. Everything is held on this device and sends when the signal returns.",
                "يمكنك متابعة التسجيل. كل شيء محفوظ على الجهاز ويرسل عند عودة الاتصال.",
              )}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Stale data */

export function StaleNotice({
  minutes,
  onRefresh,
  className,
}: {
  minutes: number;
  onRefresh?: () => void;
  className?: string;
}) {
  const { t, lang } = useDirection();
  const n = lang === "ar" ? new Intl.NumberFormat("ar-AE").format(minutes) : String(minutes);
  return (
    <div
      role="status"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-[11px] border border-hairline bg-sand-3 px-3 py-2",
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 t-body-sm text-muted-ink">
        <History className="size-4 stroke-[1.6]" aria-hidden="true" />
        {t(`Last synced ${n} minutes ago`, `آخر مزامنة قبل ${n} دقيقة`)}
      </span>
      {onRefresh ? (
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-hairline bg-card px-2.5 py-1.5 t-label text-ink transition-calm hover:bg-sand-2"
        >
          <RefreshCw className="size-3.5 stroke-[1.6]" aria-hidden="true" />
          {t("Refresh", "تحديث")}
        </button>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------- Error state */

export function ErrorState({
  line,
  onRetry,
  className,
}: {
  line?: string;
  onRetry?: () => void;
  className?: string;
}) {
  const { t } = useDirection();
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-[12px] border border-alert/20 bg-alert/5 px-6 py-10 text-center",
        className,
      )}
    >
      <TriangleAlert className="size-7 stroke-[1.5] text-alert" aria-hidden="true" />
      <p className="t-title text-ink">{t("This did not load", "تعذّر تحميل هذا")}</p>
      <p className="max-w-[52ch] t-body-sm text-muted-ink">
        {line ??
          t(
            "The request did not reach the operations service. Nothing was lost, try again in a moment.",
            "لم يصل الطلب إلى خدمة التشغيل. لم يُفقد شيء، أعد المحاولة بعد لحظات.",
          )}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-[9px] border border-hairline bg-card px-3 py-2 t-label text-ink transition-calm hover:bg-sand-2"
        >
          <RefreshCw className="size-3.5 stroke-[1.6]" aria-hidden="true" />
          {t("Try again", "إعادة المحاولة")}
        </button>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ No data yet */

export function NoDataYet({ line, className }: { line?: string; className?: string }) {
  const { t } = useDirection();
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[12px] border border-hairline bg-card px-6 py-10 text-center",
        className,
      )}
    >
      <GeometricMark size={64} opacity={0.14} />
      <p className="max-w-[44ch] t-body-sm text-muted-ink">
        {line ??
          t(
            "Nothing has been recorded here yet. This is the calm state, not an error.",
            "لم يُسجَّل شيء هنا بعد. هذه حالة هادئة وليست خطأ.",
          )}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------- Tile lost */

export function TilesUnavailable({ className }: { className?: string }) {
  const { t } = useDirection();
  return (
    <div
      role="status"
      className={cn(
        "inline-flex items-center gap-2 rounded-[9px] border border-hairline bg-card/95 px-3 py-2 t-body-sm text-muted-ink",
        className,
      )}
    >
      <CloudOff className="size-4 stroke-[1.6]" aria-hidden="true" />
      {t("Map imagery is unavailable, showing the list instead.", "صور الخريطة غير متاحة، تُعرض القائمة بدلا منها.")}
    </div>
  );
}

/* ------------------------------------------------------------- Loading set */

export function LoadingRows({ rows = 4, className }: { rows?: number; className?: string }) {
  const { t } = useDirection();
  return (
    <div className={cn("space-y-2", className)} aria-busy="true" role="status">
      <VisuallyHidden>{t("Loading", "جارٍ التحميل")}</VisuallyHidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-[11px] border border-hairline bg-card p-3">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="mt-2 h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function LoadingTiles({ tiles = 4, className }: { tiles?: number; className?: string }) {
  const { t } = useDirection();
  return (
    <div className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4", className)} aria-busy="true" role="status">
      <VisuallyHidden>{t("Loading", "جارٍ التحميل")}</VisuallyHidden>
      {Array.from({ length: tiles }).map((_, i) => (
        <div key={i} className="rounded-[12px] border border-hairline bg-card p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-7 w-16" />
          <Skeleton className="mt-3 h-2.5 w-24" />
        </div>
      ))}
    </div>
  );
}
