"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  useMachinesMoneyFillQuery,
  useMachinesOverviewQuery,
  useMachinesProductFillQuery,
  usePeakSaleCountPerDayQuery,
  useSalesByProductTypeQuery,
  useSalesByVendingMachineQuery,
  useSalesIndexByHistoricAvgQuery,
} from "@/lib/api/dashboardApi";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useI18n } from "@/i18n";
import styles from "./DashboardPage.module.css";
import { DashboardControlsBar, type PeriodKey } from "./DashboardControlsBar";
import { OverviewStatsGrid } from "../StatSection/OverviewStatsGrid";
import { VendingMapCard, type MapTabKey } from "../Map/VendingMapCard";
import { MachinesHealthSection } from "../StatSection/MachinesHealthSection";
import {
  SalesAnalyticsSection,
  type PopularTabKey,
} from "../StatSection/SalesAnalyticsSection";
import {
  PeakSalesSection,
  type PeakViewKey,
} from "../StatSection/PeakSalesSection";
import { parseTimeSpanToMinutes } from "../StatSection/peakTime";

export function DashboardPage() {
  const { t } = useI18n();

  const [period, setPeriod] = useState<PeriodKey>("month");
  const [mapTab, setMapTab] = useState<MapTabKey>("status");
  const [popularTab, setPopularTab] = useState<PopularTabKey>("products");
  const [peakView, setPeakView] = useState<PeakViewKey>("line");

  const overview = useMachinesOverviewQuery();
  const salesIndex = useSalesIndexByHistoricAvgQuery();
  const productFill = useMachinesProductFillQuery();
  const moneyFill = useMachinesMoneyFillQuery();
  const salesByVm = useSalesByVendingMachineQuery();
  const salesByProduct = useSalesByProductTypeQuery();
  const peakTimes = usePeakSaleCountPerDayQuery();

  const salesIndexTop = useMemo(
    () => (salesIndex.data ?? []).slice(0, 5),
    [salesIndex.data],
  );

  const productFillChart = useMemo(() => {
    const items = productFill.data?.topFilled ?? [];
    return items.map((x, idx) => ({
      name: `#${idx + 1}`,
      value: x.fillPercentage,
      itemCount: x.itemCount,
    }));
  }, [productFill.data]);

  const productFillPct = useMemo(() => {
    const total = overview.data?.total;
    const needs = productFill.data?.total;
    if (!total || needs == null) return undefined;
    return Math.round((needs / total) * 100);
  }, [overview.data?.total, productFill.data?.total]);

  const moneyFillTop = useMemo(
    () => (moneyFill.data ?? []).slice(0, 5),
    [moneyFill.data],
  );

  const salesByVmChart = useMemo(() => {
    const items = salesByVm.data?.topVendingMachines ?? [];
    const vmLabel = t("dashboard.tooltip.vm");
    const top = items.map((x, idx) => ({
      name: `${vmLabel} ${idx + 1}`,
      total: x.totalSales,
      pct: x.percentageOfAllSales,
      isOther: false,
    }));

    const totalAll = salesByVm.data?.totalSales;
    const soldInTopFive = salesByVm.data?.soldInTopFive;
    if (typeof totalAll !== "number" || typeof soldInTopFive !== "number")
      return top;

    const topPct = items.reduce(
      (acc, x) => acc + (x.percentageOfAllSales || 0),
      0,
    );
    const otherTotal = Math.max(0, totalAll - soldInTopFive);
    const otherPct = Math.max(0, Math.round(100 - topPct));

    if (otherTotal > 0) {
      top.push({
        name: t("common.other"),
        total: otherTotal,
        pct: otherPct,
        isOther: true,
      });
    }
    return top;
  }, [salesByVm.data, t]);

  const salesByProductChart = useMemo(() => {
    const items = salesByProduct.data?.topProducts ?? [];
    const top = items.map((x, idx) => ({
      name: `#${x.productId}`,
      total: x.soldTotal,
      pct: x.percentageOfAllSales,
      idx: idx + 1,
      isOther: false,
    }));

    const totalAll = salesByProduct.data?.totalSold;
    const soldInTopFive = salesByProduct.data?.soldInTopFive;
    if (typeof totalAll !== "number" || typeof soldInTopFive !== "number")
      return top;

    const topPct = items.reduce(
      (acc, x) => acc + (x.percentageOfAllSales || 0),
      0,
    );
    const otherTotal = Math.max(0, totalAll - soldInTopFive);
    const otherPct = Math.max(0, Math.round(100 - topPct));
    if (otherTotal > 0) {
      top.push({
        name: t("common.other"),
        total: otherTotal,
        pct: otherPct,
        idx: top.length + 1,
        isOther: true,
      });
    }
    return top;
  }, [salesByProduct.data, t]);

  const peakChart = useMemo(() => {
    const items = peakTimes.data ?? [];
    return items.map((x) => ({
      day: x.day,
      minutes: parseTimeSpanToMinutes(x.peakSalesTime),
      label: x.peakSalesTime,
    }));
  }, [peakTimes.data]);

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={styles.root}
      >
        <DashboardControlsBar
          period={period}
          onPeriodChange={setPeriod}
          dateRangeLabel="23.08.2023 – 20.09.2024"
        />

        <OverviewStatsGrid overview={overview.data} />

        <VendingMapCard
          mapTab={mapTab}
          onMapTabChange={setMapTab}
          salesIndex={salesIndex.data}
          moneyFill={moneyFill.data}
        />

        <MachinesHealthSection
          salesIndexLoading={salesIndex.isLoading}
          salesIndexTop={salesIndexTop}
          productFillLoading={productFill.isLoading}
          productFillTotal={productFill.data?.total}
          productFillPct={productFillPct}
          productFillChart={productFillChart}
          moneyFillLoading={moneyFill.isLoading}
          moneyFillTop={moneyFillTop}
        />

        <SalesAnalyticsSection
          salesByVmLoading={salesByVm.isLoading}
          salesByVmTotalSales={salesByVm.data?.totalSales}
          salesByVmSoldInTopFive={salesByVm.data?.soldInTopFive}
          salesByVmChart={salesByVmChart}
          salesByProductLoading={salesByProduct.isLoading}
          popularTab={popularTab}
          onPopularTabChange={setPopularTab}
          salesByProductTotalSold={salesByProduct.data?.totalSold}
          salesByProductSoldInTopFive={salesByProduct.data?.soldInTopFive}
          differentProductCategoriesCount={
            salesByProduct.data?.differentProductCategoriesCount
          }
          salesByProductChart={salesByProductChart}
        />

        <PeakSalesSection
          peakView={peakView}
          onPeakViewChange={setPeakView}
          isLoading={peakTimes.isLoading}
          peakChart={peakChart}
          peakTimesData={peakTimes.data ?? []}
        />
      </motion.div>
    </DashboardShell>
  );
}
