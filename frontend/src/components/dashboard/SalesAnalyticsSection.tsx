"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Segmented } from "@/components/ui/Segmented";
import { GoToReportButton } from "@/components/ui/GoToReportButton";
import { useI18n } from "@/i18n";
import styles from "./SalesAnalyticsSection.module.css";

export type PopularTabKey = "products" | "categories";

export function SalesAnalyticsSection({
  salesByVmLoading,
  salesByVmTotalSales,
  salesByVmSoldInTopFive,
  salesByVmChart,
  salesByProductLoading,
  popularTab,
  onPopularTabChange,
  salesByProductTotalSold,
  differentProductCategoriesCount,
  salesByProductChart,
}: {
  salesByVmLoading: boolean;
  salesByVmTotalSales?: number;
  salesByVmSoldInTopFive?: number;
  salesByVmChart: Array<{ name: string; total: number; pct: number }>;
  salesByProductLoading: boolean;
  popularTab: PopularTabKey;
  onPopularTabChange: (t: PopularTabKey) => void;
  salesByProductTotalSold?: number;
  differentProductCategoriesCount?: number;
  salesByProductChart: Array<{ name: string; total: number; pct: number; idx: number }>;
}) {
  const { t } = useI18n();

  return (
    <section className={styles.section}>
      <div className={styles.title}>{t("dashboard.sections.salesAnalytics")}</div>
      <div className={styles.grid}>
        <Card className={styles.card321}>
          <CardHeader>
            <div className={styles.headerRow}>
              <div>
                <div className={styles.hTitle}>{t("dashboard.cards.salesByVmTitle")}</div>
                <div className={styles.totalRow}>
                  <div className={styles.totalValue}>
                    {salesByVmTotalSales ?? <Skeleton className={styles.skelValueSm} />}
                  </div>
                  <div className={styles.totalLabel}>{t("dashboard.cards.totalSales")}</div>
                </div>
              </div>
              <div className={styles.metaRight}>
                {t("dashboard.cards.top5", { count: salesByVmSoldInTopFive ?? "—" })}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {salesByVmLoading ? (
              <Skeleton className={styles.skelChart} />
            ) : (
              <div className={styles.chart220}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByVmChart} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.03)" }}
                      contentStyle={{
                        borderRadius: 12,
                        borderColor: "rgba(0,0,0,0.08)",
                      }}
                      formatter={(v: unknown, _n, props) => {
                        const val = typeof v === "number" ? v : Number(v);
                        const pct = (props.payload as { pct?: number })?.pct;
                        return [`${val} (${pct ?? "—"}%)`, t("dashboard.tooltip.sales")];
                      }}
                    />
                    <Bar dataKey="total" fill="var(--primary)" radius={[10, 10, 10, 10]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <GoToReportButton />
          </CardContent>
        </Card>

        <Card className={styles.card653}>
          <CardHeader>
            <div className={styles.headerRow}>
              <div>
                <div className={styles.hTitle}>{t("dashboard.cards.popularTitle")}</div>
                <div className={styles.totalRow}>
                  <div className={styles.totalValue}>
                    {salesByProductTotalSold ?? <Skeleton className={styles.skelValueMd} />}
                  </div>
                  <div className={styles.totalLabel}>{t("dashboard.cards.totalSales")}</div>
                </div>
              </div>
              <div className={styles.rightStack}>
                <Segmented
                  value={popularTab}
                  onChange={onPopularTabChange}
                  layoutId="popular-pill"
                  ariaLabel={t("aria.segmented")}
                  options={[
                    { value: "products", label: t("dashboard.tabs.products") },
                    { value: "categories", label: t("dashboard.tabs.categories") },
                  ]}
                  className={styles.segmented}
                />
                <div className={styles.metaRight}>
                  {t("dashboard.cards.categoriesCount", {
                    count: differentProductCategoriesCount ?? "—",
                  })}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {salesByProductLoading ? (
              <Skeleton className={styles.skelChart} />
            ) : popularTab === "categories" ? (
              <div className={styles.demo}>
                {t("common.demoTab", { tab: t("dashboard.tabs.categories") })}
              </div>
            ) : (
              <div className={styles.chart220}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByProductChart} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.03)" }}
                      contentStyle={{
                        borderRadius: 12,
                        borderColor: "rgba(0,0,0,0.08)",
                      }}
                      formatter={(v: unknown, _n, props) => {
                        const val = typeof v === "number" ? v : Number(v);
                        const pct = (props.payload as { pct?: number })?.pct;
                        return [`${val} (${pct ?? "—"}%)`, t("dashboard.tooltip.sales")];
                      }}
                    />
                    <Bar dataKey="total" fill="rgba(216,11,58,0.35)" radius={[10, 10, 10, 10]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <GoToReportButton />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

