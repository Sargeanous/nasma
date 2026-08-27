import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
  Clock,
  Layers,
  ShieldAlert,
  CalendarClock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BidiText } from "@/lib/bidi";
import { useDirection } from "@/lib/direction";
import { GeometricMark } from "./GeometricMark";

export type Tone = "neutral" | "green" | "gold" | "success" | "warning" | "alert";

const toneText: Record<Tone, string> = {
  neutral: "text-ink",
  green: "text-green",
  gold: "text-gold",
  success: "text-success",
  warning: "text-warning",
  alert: "text-alert",
};

const toneChip: Record<Tone, string> = {
  neutral: "border-hairline bg-sand-3 text-ink",
  green: "border-green/25 bg-green/10 text-green",
  gold: "border-gold/30 bg-gold/10 text-[oklch(0.38_0.09_79.6)]",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  alert: "border-alert/25 bg-alert/10 text-alert",
};

const toneDot: Record<Tone, string> = {
  neutral: "bg-muted-ink",
  green: "bg-green",
  gold: "bg-gold",
  success: "bg-success",
  warning: "bg-warning",
  alert: "bg-alert",
};

/* ------------------------------------------------------------------ Card */

export function Card({
  children,
  className,
  padded = true,
  as: As = "div",
  tabIndex,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  as?: "div" | "section" | "article" | "li";
  tabIndex?: number;
}) {
  return (
    <As
      tabIndex={tabIndex}
      className={cn(
        "rounded-[12px] border border-hairline bg-card shadow-soft",
        padded && "p-4",
        className,
      )}
    >
      {children}
    </As>
  );
}

export function CardHeader({
  title,
  sub,
  action,
  className,
}: {
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h3 className="t-title text-ink">{title}</h3>
        {sub ? <p className="mt-0.5 t-caption text-muted-ink">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* --------------------------------------------------------------- StatTile */

export function StatTile({
  label,
  value,
  sub,
  tone = "neutral",
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-hairline bg-card p-4 shadow-soft",
        tone !== "neutral" && "border-s-2",
        tone === "alert" && "border-s-alert",
        tone === "warning" && "border-s-warning",
        tone === "success" && "border-s-success",
        tone === "green" && "border-s-green",
        tone === "gold" && "border-s-gold",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="t-micro text-muted-ink">{label}</span>
        {icon ? <span className={cn("shrink-0", toneText[tone])}>{icon}</span> : null}
      </div>
      <div className={cn("mt-2 t-numeral", toneText[tone])}>
        <BidiText>{value}</BidiText>
      </div>
      {sub ? <div className="mt-1 t-caption text-muted-ink">{sub}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------- Chip */

export function Chip({
  children,
  tone = "neutral",
  icon,
  className,
  size = "md",
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[9px] border font-medium",
        size === "sm" ? "px-1.5 py-0.5 t-caption" : "px-2 py-1 t-caption",
        toneChip[tone],
        className,
      )}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </span>
  );
}

const severityTone = {
  critical: "alert",
  high: "warning",
  medium: "gold",
  low: "neutral",
} as const;

export function SeverityChip({ severity }: { severity: keyof typeof severityTone }) {
  const { t } = useDirection();
  const labels = {
    critical: t("Critical", "حرج"),
    high: t("High", "مرتفع"),
    medium: t("Medium", "متوسط"),
    low: t("Low", "منخفض"),
  };
  const icons = {
    critical: <ShieldAlert className="size-3.5 stroke-[1.5]" />,
    high: <AlertTriangle className="size-3.5 stroke-[1.5]" />,
    medium: <CircleDot className="size-3.5 stroke-[1.5]" />,
    low: <CircleDot className="size-3.5 stroke-[1.5]" />,
  };
  return (
    <Chip tone={severityTone[severity]} icon={icons[severity]}>
      {labels[severity]}
    </Chip>
  );
}

const bandTone = {
  do_now: "alert",
  escalate: "warning",
  batch: "green",
  plan: "neutral",
} as const;

export function BandChip({ band }: { band: keyof typeof bandTone }) {
  const { t } = useDirection();
  const labels = {
    do_now: t("Do now", "تنفيذ فوري"),
    escalate: t("Escalate", "تصعيد"),
    batch: t("Batch", "تجميع"),
    plan: t("Plan", "تخطيط"),
  };
  const icons = {
    do_now: <Clock className="size-3.5 stroke-[1.5]" />,
    escalate: <ArrowUpRight className="icon-directional size-3.5 stroke-[1.5]" />,
    batch: <Layers className="size-3.5 stroke-[1.5]" />,
    plan: <CalendarClock className="size-3.5 stroke-[1.5]" />,
  };
  return (
    <Chip tone={bandTone[band]} icon={icons[band]}>
      {labels[band]}
    </Chip>
  );
}

export function StatusChip({ status }: { status: string }) {
  const { t } = useDirection();
  const map: Record<string, { label: string; tone: Tone }> = {
    reported: { label: t("Reported", "مُبلغ"), tone: "neutral" },
    assigned: { label: t("Assigned", "مُسند"), tone: "green" },
    in_progress: { label: t("In progress", "قيد التنفيذ"), tone: "gold" },
    escalated: { label: t("Escalated", "مُصعّد"), tone: "warning" },
    emergency_dispatched: { label: t("Emergency dispatched", "إرسال طوارئ"), tone: "alert" },
    closed: { label: t("Closed", "مغلق"), tone: "success" },
  };
  const entry = map[status] ?? { label: status, tone: "neutral" as Tone };
  return (
    <Chip tone={entry.tone} icon={<Dot tone={entry.tone} />}>
      {entry.label}
    </Chip>
  );
}

export function SlaChip({ remaining, hours }: { remaining: number; hours: number }) {
  const { t } = useDirection();
  if (remaining < 0) {
    return (
      <Chip tone="alert" icon={<AlertTriangle className="size-3.5 stroke-[1.5]" />}>
        <BidiText>SLA</BidiText>
        <span>{t("breached by", "تجاوز بمقدار")}</span>
        <BidiText>{Math.abs(remaining)}h</BidiText>
      </Chip>
    );
  }
  const atRisk = remaining <= hours * 0.25;
  return (
    <Chip
      tone={atRisk ? "warning" : "success"}
      icon={
        atRisk ? (
          <Clock className="size-3.5 stroke-[1.5]" />
        ) : (
          <CheckCircle2 className="size-3.5 stroke-[1.5]" />
        )
      }
    >
      <BidiText>{remaining}h</BidiText>
      <span>{t("left of", "من أصل")}</span>
      <BidiText>{hours}h</BidiText>
    </Chip>
  );
}

/* -------------------------------------------------------------------- Dot */

export function Dot({ tone = "neutral", label }: { tone?: Tone; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn("inline-block size-2 shrink-0 rounded-full", toneDot[tone])}
        aria-hidden="true"
      />
      {label ? <span className="t-caption text-ink">{label}</span> : null}
    </span>
  );
}

/* ------------------------------------------------------------------ Meter */

export function Meter({
  value,
  max = 100,
  tone = "green",
  className,
  label,
  height = 6,
}: {
  value: number;
  max?: number;
  tone?: Tone;
  className?: string;
  label?: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-sand-3", className)}
      style={{ height }}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div className={cn("h-full rounded-full", toneDot[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* -------------------------------------------------------------- DataTable */

export type Column<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: "start" | "end";
  numeric?: boolean;
  width?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  maxHeight = 420,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  maxHeight?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("overflow-auto rounded-[12px] border border-hairline bg-card", className)}
      style={{ maxHeight }}
    >
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-sand-2">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                style={{ width: c.width }}
                className={cn(
                  "border-b border-hairline px-3 py-2 t-micro text-muted-ink",
                  c.align === "end" ? "text-end" : "text-start",
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
              className={cn(
                "border-b border-hairline/70 last:border-b-0",
                onRowClick && "cursor-pointer transition-calm hover:bg-sand-2",
              )}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "px-3 py-2.5 t-body-sm text-ink",
                    c.align === "end" ? "text-end" : "text-start",
                    c.numeric && "tnum",
                  )}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------------------------------------------- Timeline */

export type TimelineItem = {
  actor: string;
  role: string;
  change: string;
  timestamp: string;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative ps-4">
      <span
        className="absolute inset-y-1 start-[3px] w-px bg-hairline"
        aria-hidden="true"
      />
      {items.map((item, i) => (
        <li key={i} className="relative pb-4 last:pb-0">
          <span
            className="absolute -start-4 top-1.5 size-[7px] rounded-full bg-green ring-2 ring-card"
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="t-body-sm font-medium text-ink">{item.actor}</span>
            <span className="t-caption text-muted-ink">{item.role}</span>
          </div>
          <p className="t-body-sm text-ink">{item.change}</p>
          <BidiText className="t-caption text-muted-ink">{item.timestamp}</BidiText>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------- EmptyState */

export function EmptyState({
  line,
  action,
  className,
}: {
  line: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[12px] border border-hairline bg-card px-6 py-10 text-center",
        className,
      )}
    >
      <GeometricMark size={64} opacity={0.14} />
      <p className="max-w-[42ch] t-body-sm text-muted-ink">{line}</p>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ Denied */

export function Denied({ className }: { className?: string }) {
  const { t } = useDirection();
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-[12px] border border-hairline bg-card px-6 py-10 text-center",
        className,
      )}
      role="alert"
    >
      <ShieldAlert className="size-7 stroke-[1.5] text-muted-ink" aria-hidden="true" />
      <p className="t-title text-ink">
        {t("Your role does not have access to this.", "لا يملك دورك صلاحية الوصول إلى هذا.")}
      </p>
      <p className="max-w-[52ch] t-body-sm text-muted-ink">
        {t(
          "The server refused the request, so this is not a hidden button, the data never left it.",
          "رفض الخادم الطلب، لذا ليست هذه واجهة مخفية، فالبيانات لم تغادره أصلا.",
        )}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- Skeletons */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[9px] bg-sand-3", className)} />;
}
