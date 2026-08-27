import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/lib/direction";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  contained = true,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  contained?: boolean;
}) {
  const { t } = useDirection();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={cn(contained ? "absolute" : "fixed", "inset-0 z-50 flex flex-col justify-end")}>
      <button
        type="button"
        aria-label={t("Close", "إغلاق")}
        onClick={onClose}
        className="absolute inset-0 bg-ink/35"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative max-h-[92%] overflow-y-auto rounded-t-[16px] border-t border-hairline bg-card shadow-lift",
          className,
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-hairline bg-card px-4 py-3">
          <span className="mx-auto absolute inset-x-0 top-1.5 h-1 w-9 rounded-full bg-hairline" aria-hidden="true" />
          <h2 className="t-title text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close", "إغلاق")}
            className="inline-flex size-11 items-center justify-center rounded-[9px] text-muted-ink transition-calm hover:bg-sand-3"
          >
            <X className="size-5 stroke-[1.5]" aria-hidden="true" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer ? (
          <div className="sticky bottom-0 border-t border-hairline bg-card p-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
