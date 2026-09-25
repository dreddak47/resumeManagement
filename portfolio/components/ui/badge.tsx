import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "interest";
}) {
  const variants = {
    default: "border-border text-muted-foreground bg-background-elevated",
    accent: "border-accent/30 text-accent-soft bg-accent/10",
    interest: "border-interest/30 text-interest bg-interest/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
