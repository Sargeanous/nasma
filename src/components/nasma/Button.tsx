import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "quiet" | "danger" | "gold";

const variants: Record<Variant, string> = {
  primary: "bg-deep-green text-primary-foreground hover:bg-green border-transparent",
  secondary: "bg-card text-ink border-hairline hover:bg-sand-2",
  quiet: "bg-transparent text-green border-transparent hover:bg-green/8",
  danger: "bg-alert text-primary-foreground border-transparent hover:bg-alert/90",
  gold: "bg-gold text-primary-foreground border-transparent hover:bg-gold-light",
};

export function Button({
  children,
  variant = "secondary",
  full,
  size = "md",
  className,
  icon,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  full?: boolean;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
}) {
  const sizes = {
    sm: "min-h-9 px-3 t-caption",
    md: "min-h-11 px-4 t-body-sm",
    lg: "min-h-12 px-5 t-body",
  } as const;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[9px] border font-medium transition-calm disabled:opacity-50",
        sizes[size],
        variants[variant],
        full && "w-full",
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
