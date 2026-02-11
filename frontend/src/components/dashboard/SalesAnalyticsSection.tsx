"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { GoToReportButton } from "@/components/ui/GoToReportButton";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import styles from "./SalesAnalyticsSection.module.css";
import controlsStyles from "./DashboardControlsBar.module.css";

export type PopularTabKey = "products" | "categories";

type LabelRenderProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: unknown;
  payload?: unknown;
};

function renderValuePill(props: LabelRenderProps) {
  const x =
    typeof props.x === "number"
      ? props.x
      : props.x == null
        ? NaN
        : Number(props.x);
  const y =
    typeof props.y === "number"
      ? props.y
      : props.y == null
        ? NaN
        : Number(props.y);
  const width =
    typeof props.width === "number"
      ? props.width
      : props.width == null
        ? NaN
        : Number(props.width);
  const height =
    typeof props.height === "number"
      ? props.height
      : props.height == null
        ? NaN
        : Number(props.height);
  if (![x, y, width, height].every(Number.isFinite)) return null;

  const raw = props.value;
  const num = typeof raw === "number" ? raw : raw == null ? NaN : Number(raw);
  if (!Number.isFinite(num)) return null;

  const label = String(num);
  const pillHeight = 20;
  const pillPaddingX = 10;
  const pillWidth = Math.max(34, label.length * 7 + pillPaddingX * 2);
  const cx = x + width / 2;
  const pillX = cx - pillWidth / 2;
  // keep the value pill near the bottom; for very small bars we still
  // want it visible (paired with Bar.minPointSize below)
  const pillY = y + height - pillHeight - 8;

  return (
    <g>
      <rect
        x={pillX}
        y={pillY}
        width={pillWidth}
        height={pillHeight}
        rx={10}
        ry={10}
        fill="#ffffff"
        stroke="rgba(16,24,40,0.08)"
      />
      <text
        x={cx}
        y={pillY + 14}
        textAnchor="middle"
        fill="rgba(16,24,40,0.92)"
        fontSize={12}
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}

function renderPctLabel(props: LabelRenderProps) {
  const x =
    typeof props.x === "number"
      ? props.x
      : props.x == null
        ? NaN
        : Number(props.x);
  const width =
    typeof props.width === "number"
      ? props.width
      : props.width == null
        ? NaN
        : Number(props.width);
  if (![x, width].every(Number.isFinite)) return null;

  const raw = props.value;
  const pct = typeof raw === "number" ? raw : raw == null ? NaN : Number(raw);
  if (!Number.isFinite(pct)) return null;

  return (
    <text
      x={x + width / 2}
      // fixed y like in the design (percent row at the top)
      y={22}
      textAnchor="middle"
      fill="rgba(71,84,103,0.55)"
      fontSize={12}
      fontWeight={600}
    >
      {pct}%
    </text>
  );
}

export function SalesAnalyticsSection({
  salesByVmLoading,
  salesByVmTotalSales,
  salesByVmSoldInTopFive,
  salesByVmChart,
  salesByProductLoading,
  popularTab,
  onPopularTabChange,
  salesByProductTotalSold,
  salesByProductSoldInTopFive,
  differentProductCategoriesCount,
  salesByProductChart,
}: {
  salesByVmLoading: boolean;
  salesByVmTotalSales?: number;
  salesByVmSoldInTopFive?: number;
  salesByVmChart: Array<{
    name: string;
    total: number;
    pct: number;
    isOther?: boolean;
  }>;
  salesByProductLoading: boolean;
  popularTab: PopularTabKey;
  onPopularTabChange: (t: PopularTabKey) => void;
  salesByProductTotalSold?: number;
  salesByProductSoldInTopFive?: number;
  differentProductCategoriesCount?: number;
  salesByProductChart: Array<{
    name: string;
    total: number;
    pct: number;
    idx: number;
    isOther?: boolean;
  }>;
}) {
  const { t } = useI18n();
  const vmTop5Pct =
    typeof salesByVmTotalSales === "number" &&
    typeof salesByVmSoldInTopFive === "number" &&
    salesByVmTotalSales > 0
      ? Math.round((salesByVmSoldInTopFive / salesByVmTotalSales) * 100)
      : null;

  const productTop5Pct =
    typeof salesByProductTotalSold === "number" &&
    typeof salesByProductSoldInTopFive === "number" &&
    salesByProductTotalSold > 0
      ? Math.round((salesByProductSoldInTopFive / salesByProductTotalSold) * 100)
      : null;

  return (
    <section className={styles.section}>
      <div className={styles.title}>
        {t("dashboard.sections.salesAnalytics")}
      </div>
      <div className={styles.grid}>
        <Card className={cn(styles.card, styles.card321)}>
          <CardHeader>
            <div className={styles.headerRow}>
              <div className={styles.hTitle}>
                {t("dashboard.cards.salesByVmTitle")}
              </div>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.chartBox}>
              {salesByVmLoading ? (
                <Skeleton className={styles.skelChart} />
              ) : (
                <div className={styles.chart220}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesByVmChart}
                      // narrower bars like in the design
                      barSize={56}
                      barCategoryGap={22}
                      margin={{ top: 34, right: 8, left: 8, bottom: 0 }}
                    >
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.03)" }}
                        contentStyle={{
                          borderRadius: 12,
                          borderColor: "rgba(0,0,0,0.08)",
                        }}
                        formatter={(v: unknown, _n, props) => {
                          const val = typeof v === "number" ? v : Number(v);
                          const pct = (props.payload as { pct?: number })?.pct;
                          return [
                            `${val} (${pct ?? "—"}%)`,
                            t("dashboard.tooltip.sales"),
                          ];
                        }}
                      />
                      <Bar
                        dataKey="total"
                        radius={[16, 16, 16, 16]}
                        background={{ fill: "rgba(0,0,0,0.04)", radius: 16 }}
                        // keep tiny values visible so the value pill doesn't get clipped
                        minPointSize={34}
                      >
                        {salesByVmChart.map((entry, idx) => (
                          <Cell
                            // name is not unique when "Other" is present in multiple languages; include index
                            key={`${entry.name}-${idx}`}
                            fill={
                              entry.isOther
                                ? "rgba(71,84,103,0.78)"
                                : "var(--primary)"
                            }
                          />
                        ))}
                        <LabelList dataKey="pct" content={renderPctLabel} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <div className={styles.stat}>
                <div className={styles.statValue}>
                  {salesByVmTotalSales ?? (
                    <Skeleton className={styles.skelValueSm} />
                  )}
                </div>
                <div className={styles.statLabel}>
                  {t("dashboard.cards.totalSoldUnits")}
                </div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.stat}>
                <div className={styles.statTop}>
                  <div className={styles.statValue}>
                    {salesByVmSoldInTopFive ?? (
                      <Skeleton className={styles.skelValueSm} />
                    )}
                  </div>
                  {vmTop5Pct == null ? null : (
                    <div className={styles.pctPill}>{vmTop5Pct}%</div>
                  )}
                </div>
                <div className={styles.statLabel}>
                  {t("dashboard.cards.soldInTop5Machines")}
                </div>
                </div>
              </div>
            </div>

            <GoToReportButton className={styles.goToReportButton} />
          </CardContent>
        </Card>

        <Card className={cn(styles.card, styles.card653)}>
          <CardHeader>
            <div className={styles.headerRow}>
              <div>
                <div className={styles.hTitle}>
                  {t("dashboard.cards.popularTitle")}
                </div>
              </div>
              <div className={styles.rightStack}>
                <div
                  className={cn(styles.tabsWrap, controlsStyles.tabs)}
                  role="tablist"
                  aria-label={t("aria.segmented")}
                >
                  {(
                    [
                      {
                        value: "products",
                        label: t("dashboard.tabs.products"),
                      },
                      {
                        value: "categories",
                        label: t("dashboard.tabs.categories"),
                      },
                    ] as const
                  ).map((opt) => {
                    const selected = opt.value === popularTab;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onPopularTabChange(opt.value)}
                        className={
                          selected
                            ? controlsStyles.tabSelected
                            : controlsStyles.tab
                        }
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
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.chartBox}>
              {salesByProductLoading ? (
                <Skeleton className={styles.skelChart} />
              ) : popularTab === "categories" ? (
                <div className={cn(styles.demo, styles.chart220)}>
                  {t("common.demoTab", { tab: t("dashboard.tabs.categories") })}
                </div>
              ) : (
                <div className={styles.chart220}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesByProductChart}
                      // wider bars like in the design
                      barSize={250}
                      barCategoryGap={14}
                      margin={{ top: 34, right: 8, left: 8, bottom: 0 }}
                    >
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.03)" }}
                        contentStyle={{
                          borderRadius: 12,
                          borderColor: "rgba(0,0,0,0.08)",
                        }}
                        formatter={(v: unknown, _n, props) => {
                          const val = typeof v === "number" ? v : Number(v);
                          const pct = (props.payload as { pct?: number })?.pct;
                          return [
                            `${val} (${pct ?? "—"}%)`,
                            t("dashboard.tooltip.sales"),
                          ];
                        }}
                      />
                      <Bar
                        dataKey="total"
                        radius={[16, 16, 16, 16]}
                        background={{ fill: "rgba(0,0,0,0.04)", radius: 16 }}
                        // keep tiny values visible so the value pill doesn't get clipped
                        minPointSize={34}
                      >
                        {salesByProductChart.map((entry, idx) => (
                          <Cell
                            key={`${entry.name}-${idx}`}
                            fill={
                              entry.isOther
                                ? "rgba(71,84,103,0.78)"
                                : "var(--primary)"
                            }
                          />
                        ))}
                        <LabelList dataKey="pct" content={renderPctLabel} />
                        <LabelList dataKey="total" content={renderValuePill} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <div className={styles.stat}>
                <div className={styles.statValue}>
                  {differentProductCategoriesCount ?? (
                    <Skeleton className={styles.skelValueSm} />
                  )}
                </div>
                <div className={styles.statLabel}>
                  {t("dashboard.cards.categoriesInTop5")}
                </div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.stat}>
                  <div className={styles.statTop}>
                    <div className={styles.statValue}>
                      {salesByProductSoldInTopFive ?? (
                        <Skeleton className={styles.skelValueMd} />
                      )}
                    </div>
                    {productTop5Pct == null ? null : (
                      <div className={styles.pctPill}>{productTop5Pct}%</div>
                    )}
                  </div>
                <div className={styles.statLabel}>
                  {t("dashboard.cards.soldInTop5Products")}
                </div>
                </div>
              </div>
            </div>

            <GoToReportButton className={styles.goToReportButton} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
