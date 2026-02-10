"use client";

import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n";
import styles from "./StatCard.module.css";

export function StatCard({
  label,
  value,
  tone = "neutral",
  pct,
}: {
  label: string;
  value?: number;
  tone?: "neutral" | "good" | "warn" | "bad";
  pct?: number;
}) {
  const { t } = useI18n();

  const toneClass =
    tone === "good"
      ? styles.toneGood
      : tone === "warn"
        ? styles.toneWarn
        : tone === "bad"
          ? styles.toneBad
          : undefined;

  return (
    <Card className={styles.card}>
      <div className={styles.body}>
        <div className={styles.topRow}>
          <div className={styles.label}>{label}</div>
          <button
            type="button"
            className={styles.openBtn}
            aria-label={t("common.open")}
          >
            <ArrowUpRight className={styles.openIcon} />
          </button>
        </div>

        <div className={styles.bottomRow}>
          {value == null ? (
            <Skeleton className={styles.skelValue} />
          ) : (
            <div className={cn(styles.value, toneClass)}>{value}</div>
          )}
          {pct == null ? null : <div className={styles.pct}>{pct}%</div>}
        </div>
      </div>
    </Card>
  );
}

