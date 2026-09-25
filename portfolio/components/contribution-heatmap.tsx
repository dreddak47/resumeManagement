import { ContributionDay } from "@/lib/github";

function levelFor(count: number) {
  if (count === 0) return "bg-border/60";
  if (count < 3) return "bg-accent/30";
  if (count < 6) return "bg-accent/55";
  if (count < 10) return "bg-accent/80";
  return "bg-accent";
}

export function ContributionHeatmap({
  weeks,
  total,
}: {
  weeks: { days: ContributionDay[] }[];
  total: number;
}) {
  return (
    <div>
      <div className="flex gap-[3px] overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.days.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} contributions`}
                className={`h-[10px] w-[10px] rounded-[2px] ${levelFor(day.count)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        {total.toLocaleString()} contributions in the last year on GitHub
      </p>
    </div>
  );
}
