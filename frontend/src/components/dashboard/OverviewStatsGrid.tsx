"use client";

import type { VendingMachinesOverview } from "@/lib/api/types";
import { StatCard } from "@/components/dashboard/StatCard";
import { useI18n } from "@/i18n";
import styles from "./OverviewStatsGrid.module.css";

export function OverviewStatsGrid({ overview }: { overview?: VendingMachinesOverview }) {
  const { t } = useI18n();

  return (
    <section className={styles.grid}>
      <StatCard label={t("dashboard.stats.totalMachines")} value={overview?.total} />
      <StatCard
        label={t("dashboard.stats.working")}
        value={overview?.working}
        tone="good"
        pct={overview?.total ? Math.round((overview.working / overview.total) * 100) : undefined}
      />
      <StatCard
        label={t("dashboard.stats.lowSupply")}
        value={overview?.lowSupply}
        tone="warn"
        pct={overview?.total ? Math.round((overview.lowSupply / overview.total) * 100) : undefined}
      />
      <StatCard
        label={t("dashboard.stats.needsRepair")}
        value={overview?.needsRepair}
        tone="bad"
        pct={overview?.total ? Math.round((overview.needsRepair / overview.total) * 100) : undefined}
      />
    </section>
  );
}

