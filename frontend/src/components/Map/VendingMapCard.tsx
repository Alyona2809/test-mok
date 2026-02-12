"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/Card/Card";
import type {
  SalesIndexItem,
  VendingMachineMoneyStatus,
} from "@/lib/api/types";
import { useI18n } from "@/i18n";
import styles from "./VendingMapCard.module.css";

const VendingMap = dynamic(
  () =>
    import("@/components/Map/VendingMap").then((m) => ({
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

  const options: Array<{ value: MapTabKey; label: string }> = [
    { value: "status", label: t("dashboard.map.tabs.status") },
    { value: "avgRevenue", label: t("dashboard.map.tabs.avgRevenue") },
    { value: "downtime", label: t("dashboard.map.tabs.downtime") },
    { value: "fillLevel", label: t("dashboard.map.tabs.fillLevel") },
  ];

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
            <div
              className={styles.tabs}
              role="tablist"
              aria-label={t("aria.segmented")}
            >
              {options.map((opt) => {
                const selected = opt.value === mapTab;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onMapTabChange(opt.value)}
                    className={selected ? styles.tabSelected : styles.tab}
                    role="tab"
                    aria-selected={selected}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
