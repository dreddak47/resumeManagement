import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-background-elevated/60 p-6 backdrop-blur-sm transition-colors hover:border-accent/40",
        className
      )}
    >
      {children}
    </div>
  );
}
