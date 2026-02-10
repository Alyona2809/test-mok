"use client";

import { useI18n } from "@/i18n";
import styles from "./DashboardControlsBar.module.css";

export type PeriodKey = "today" | "yesterday" | "week" | "month" | "quarter";

export function DashboardControlsBar({
  period,
  onPeriodChange,
  dateRangeLabel,
}: {
  period: PeriodKey;
  onPeriodChange: (p: PeriodKey) => void;
  dateRangeLabel: string;
}) {
  const { t } = useI18n();

  const options: Array<{ value: PeriodKey; label: string }> = [
    { value: "today", label: t("dashboard.period.today") },
    { value: "yesterday", label: t("dashboard.period.yesterday") },
    { value: "week", label: t("dashboard.period.week") },
    { value: "month", label: t("dashboard.period.month") },
    { value: "quarter", label: t("dashboard.period.quarter") },
  ];

  return (
    <section className={styles.bar}>
      <div className={styles.tabs} role="tablist" aria-label={t("aria.segmented")}>
        {options.map((opt) => {
          const selected = opt.value === period;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPeriodChange(opt.value)}
              className={selected ? styles.tabSelected : styles.tab}
              role="tab"
              aria-selected={selected}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.dateBtn}
      >
        {dateRangeLabel}
      </button>
    </section>
  );
}

