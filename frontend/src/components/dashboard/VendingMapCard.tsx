"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import type { SalesIndexItem, VendingMachineMoneyStatus } from "@/lib/api/types";
import { useI18n } from "@/i18n";
import styles from "./VendingMapCard.module.css";

const VendingMap = dynamic(
  () =>
    import("@/components/dashboard/VendingMap").then((m) => ({
      default: m.VendingMap,
    })),
  { ssr: false, loading: () => <div className={styles.loading} /> },
);

export type MapTabKey = "status" | "avgRevenue" | "downtime" | "fillLevel";

function tabLabelKey(tab: MapTabKey) {
  switch (tab) {
    case "status":
      return "dashboard.map.tabs.status";
    case "avgRevenue":
      return "dashboard.map.tabs.avgRevenue";
    case "downtime":
      return "dashboard.map.tabs.downtime";
    case "fillLevel":
      return "dashboard.map.tabs.fillLevel";
  }
}

export function VendingMapCard({
  mapTab,
  onMapTabChange,
  salesIndex,
  moneyFill,
}: {
  mapTab: MapTabKey;
  onMapTabChange: (t: MapTabKey) => void;
  salesIndex?: SalesIndexItem[];
  moneyFill?: VendingMachineMoneyStatus[];
}) {
  const { t } = useI18n();

  return (
    <section>
      <Card className={styles.card}>
        <div className={styles.map}>
          {mapTab === "status" ? (
            <VendingMap salesIndex={salesIndex} moneyFill={moneyFill} />
          ) : (
            <div className={styles.demo}>
              {t("common.demoTab", { tab: t(tabLabelKey(mapTab)) })}
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <div className={styles.footerInner}>
            <Segmented
              value={mapTab}
              onChange={onMapTabChange}
              layoutId="map-pill"
              ariaLabel={t("aria.segmented")}
              options={[
                { value: "status", label: t("dashboard.map.tabs.status") },
                { value: "avgRevenue", label: t("dashboard.map.tabs.avgRevenue") },
                { value: "downtime", label: t("dashboard.map.tabs.downtime") },
                { value: "fillLevel", label: t("dashboard.map.tabs.fillLevel") },
              ]}
              className={styles.segmented}
            />
          </div>
        </div>
      </Card>
    </section>
  );
}

