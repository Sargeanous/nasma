import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Unicode first-strong isolate / pop directional isolate. */
export const FSI = "\u2068";
export const PDI = "\u2069";

/**
 * Wraps a Latin run (ticket ids, times, percentages, "SLA", AED figures) so it
 * does not jump to the wrong end of an Arabic line.
 */
export function BidiText({
  children,
  className,
  tabular = true,
  as: As = "span",
}: {
  children: ReactNode;
  className?: string;
  tabular?: boolean;
  as?: "span" | "div" | "strong";
}) {
  return (
    <As dir="ltr" className={cn("inline-block unicode-bidi-isolate", tabular && "tnum", className)}>
      {children}
    </As>
  );
}

/** String-level isolation for cases where a component only accepts text. */
export function isolate(value: string | number): string {
  return `${FSI}${value}${PDI}`;
}
