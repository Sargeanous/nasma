import { cn } from "@/lib/utils";

/** Eight-point star with interlaced double diamond. Watermark / empty-state mark only. */
export function GeometricMark({
  className,
  size = 96,
  opacity = 0.12,
}: {
  className?: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      className={cn("text-green", className)}
      style={{ opacity }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="24" y="24" width="72" height="72" />
        <rect x="24" y="24" width="72" height="72" transform="rotate(45 60 60)" />
        <circle cx="60" cy="60" r="36" />
        <rect x="42" y="42" width="36" height="36" transform="rotate(45 60 60)" />
      </g>
    </svg>
  );
}
