import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BidiText } from "@/lib/bidi";
import { useDirection } from "@/lib/direction";
import { SeverityChip, SlaChip } from "./primitives";
import type { WorkOrder } from "@/data/types";
import { mosque, zoneName } from "@/data";

export function TaskRow({
  order,
  onSelect,
  selected,
  showMosque = true,
  trailing,
  className,
}: {
  order: WorkOrder;
  onSelect?: (order: WorkOrder) => void;
  selected?: boolean;
  showMosque?: boolean;
  trailing?: ReactNode;
  className?: string;
}) {
  const { t, lang } = useDirection();
  const m = mosque(order.mosque_id);
  const zone = zoneName(order.zone);
  const Comp = onSelect ? "button" : "div";

  return (
    <Comp
      {...(onSelect ? { type: "button" as const, onClick: () => onSelect(order) } : {})}
      className={cn(
        "flex w-full min-h-11 items-start gap-3 rounded-[12px] border bg-card p-3 text-start transition-calm",
        selected ? "border-green bg-green/5" : "border-hairline hover:bg-sand-2",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <BidiText className="t-caption font-medium text-muted-ink">{order.id}</BidiText>
          <SeverityChip severity={order.severity} />
          <SlaChip remaining={order.sla_remaining} hours={order.sla_hours} />
        </div>
        <p className="mt-1.5 t-body font-medium text-ink">
          {t(order.title_en, order.title_ar)}
        </p>
        {lang === "en" ? (
          <p dir="rtl" className="font-arabic t-caption text-muted-ink">
            {order.title_ar}
          </p>
        ) : null}
        {showMosque ? (
          <p className="mt-1 t-caption text-muted-ink">
            {t(m.name_en, m.name_ar)} | {t(zone.name_en, zone.name_ar)}
          </p>
        ) : (
          <p className="mt-1 t-caption text-muted-ink">{t(zone.name_en, zone.name_ar)}</p>
        )}
      </div>
      {trailing ?? (
        onSelect ? (
          <ChevronRight
            className="icon-directional mt-1 size-4 shrink-0 stroke-[1.5] text-muted-ink"
            aria-hidden="true"
          />
        ) : null
      )}
    </Comp>
  );
}
