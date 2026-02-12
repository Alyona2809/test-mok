"use client";

import { Card } from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n";
import styles from "./StatCard.module.css";
import Image from "next/image";

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

  const fillPct = pct == null ? undefined : Math.max(0, Math.min(100, pct));

  const toneClass =
    tone === "good"
      ? styles.toneGood
      : tone === "warn"
        ? styles.toneWarn
        : tone === "bad"
          ? styles.toneBad
          : undefined;

  const fillToneClass =
    tone === "good"
      ? styles.fillGood
      : tone === "warn"
        ? styles.fillWarn
        : tone === "bad"
          ? styles.fillBad
          : undefined;

  const fillBgClass =
    fillPct == null ? undefined : cn(styles.bgFill, fillToneClass);

  const fillStyle =
    fillPct == null
      ? undefined
      : ({
          ["--fill" as never]: fillPct,
        } as React.CSSProperties);

  return (
    <Card className={cn(styles.card, fillBgClass)} style={fillStyle}>
      <div className={styles.body}>
        <div className={styles.topRow}>
          <div className={styles.label}>{label}</div>
          <button
            type="button"
            className={styles.openBtn}
            aria-label={t("common.open")}
          >
            <Image src="/nav.svg" alt="" width={20} height={20} />
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
