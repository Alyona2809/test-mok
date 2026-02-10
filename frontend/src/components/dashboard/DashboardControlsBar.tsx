"use client";

import { ChevronDown } from "lucide-react";
import { Segmented } from "@/components/ui/Segmented";
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

  return (
    <section className={styles.bar}>
      <Segmented
        value={period}
        onChange={onPeriodChange}
        layoutId="period-pill"
        ariaLabel={t("aria.segmented")}
        options={[
          { value: "today", label: t("dashboard.period.today") },
          { value: "yesterday", label: t("dashboard.period.yesterday") },
          { value: "week", label: t("dashboard.period.week") },
          { value: "month", label: t("dashboard.period.month") },
          { value: "quarter", label: t("dashboard.period.quarter") },
        ]}
      />

      <button
        type="button"
        className={styles.dateBtn}
      >
        {dateRangeLabel}
        <ChevronDown className={styles.chev} />
      </button>
    </section>
  );
}

