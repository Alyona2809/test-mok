import { cn } from "@/lib/cn";
import styles from "./ProgressBar.module.css";

export function ProgressBar({
  value,
  size = "md",
  tone = "primary",
  className,
}: {
  value: number;
  size?: "md" | "sm";
  tone?: "primary" | "good" | "warn" | "bad";
  className?: string;
}) {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  const toneClass =
    tone === "good"
      ? styles.toneGood
      : tone === "warn"
        ? styles.toneWarn
        : tone === "bad"
          ? styles.toneBad
          : styles.tonePrimary;
  return (
    <div
      className={cn(
        styles.track,
        size === "sm" ? styles.thin : undefined,
        className,
      )}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          styles.bar,
          toneClass,
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

