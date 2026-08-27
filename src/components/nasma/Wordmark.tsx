import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  tone = "ink",
  size = "md",
}: {
  className?: string;
  tone?: "ink" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-[1.0625rem]",
    md: "text-[1.375rem]",
    lg: "text-[1.75rem]",
  } as const;

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        dir="ltr"
        className={cn(
          "font-display leading-none tracking-wide",
          sizes[size],
          tone === "light" ? "text-primary-foreground" : "text-deep-green",
        )}
      >
        Nasma
      </span>
      <span
        dir="rtl"
        lang="ar"
        className={cn(
          "font-arabic leading-none",
          size === "lg" ? "text-lg" : "text-sm",
          tone === "light" ? "text-primary-foreground/75" : "text-gold",
        )}
      >
        نسمة
      </span>
    </span>
  );
}
