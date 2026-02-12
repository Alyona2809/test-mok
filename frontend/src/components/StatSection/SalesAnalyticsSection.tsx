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
import { Card, CardContent, CardHeader } from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { GoToReportButton } from "@/components/ui/Button/GoToReportButton";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import styles from "./SalesAnalyticsSection.module.css";
import controlsStyles from "../dashboard/DashboardControlsBar.module.css";
import {
  getLabelBoxXYWH,
  renderFixedYPctLabel,
  renderValuePill,
  toFiniteNumber,
  type RechartsLabelRenderProps,
} from "../utils/rechartsLabelHelpers";

export type PopularTabKey = "products" | "categories";

const PCT_LABEL_Y = 20;

function withRankIdx<T extends { total: number; isOther?: boolean }>(
  data: T[],
) {
  const order = data
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => !d.isOther)
    .sort((a, b) => b.d.total - a.d.total);

  const top3 = new Map<number, 0 | 1 | 2>();
  order.slice(0, 3).forEach((x, rank) => {
    top3.set(x.i, rank as 0 | 1 | 2);
  });

  return data.map((d, i) => ({
    ...d,
    rankIdx: top3.get(i),
  }));
}

function renderRankBadge(props: RechartsLabelRenderProps) {
  const box = getLabelBoxXYWH(props);
  if (!box) return null;
  const rankIdx = toFiniteNumber(props.value);
  if (rankIdx == null) return null;
  const payload = props.payload as { isOther?: boolean } | undefined;
  if (payload?.isOther) return null;
  if (rankIdx !== 0 && rankIdx !== 1 && rankIdx !== 2) return null;

  const cx = box.x + box.width / 2;
  const size = 16;

  const minY = PCT_LABEL_Y + 14;
  const bottom = box.y + box.height;
  const valuePillTop = bottom - 28;
  const desiredY = box.y - size - 6;
  const y = Math.max(minY, Math.min(desiredY, valuePillTop - size - 4));
  const x0 = cx - size / 2;

  if (rankIdx === 0) {
    return (
      <g transform={`translate(${x0},${y})`}>
        <circle cx={8} cy={8} r={8} fill="#FEC84B" />
        <rect x={7.4} y={3.6} width={1.2} height={8.4} fill="#F79009" />
      </g>
    );
  }

  if (rankIdx === 1) {
    return (
      <g transform={`translate(${x0},${y})`}>
        <circle cx={8} cy={8} r={8} fill="#D0D5DD" />
        <rect x={5.545} y={3.6} width={1.2} height={8.4} fill="#98A2B3" />
        <rect x={9.26} y={3.6} width={1.2} height={8.4} fill="#98A2B3" />
      </g>
    );
  }

  return (
    <g transform={`translate(${x0},${y})`}>
      <circle cx={8} cy={8} r={8} fill="#93370D" />
      <rect x={3.688} y={3.6} width={1.2} height={8.4} fill="#F77416" />
      <rect x={7.403} y={3.6} width={1.2} height={8.4} fill="#F77416" />
      <rect x={11.117} y={3.6} width={1.2} height={8.4} fill="#F77416" />
    </g>
  );
}

const renderPctLabel = (props: RechartsLabelRenderProps) =>
  renderFixedYPctLabel(props, PCT_LABEL_Y, { suffix: "%" });

const POPULAR_TABS = [
  { value: "products", labelKey: "dashboard.tabs.products" },
  { value: "categories", labelKey: "dashboard.tabs.categories" },
] as const;

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
  const salesByVmChartRanked = withRankIdx(salesByVmChart);
  const salesByProductChartRanked = withRankIdx(salesByProductChart);
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
      ? Math.round(
          (salesByProductSoldInTopFive / salesByProductTotalSold) * 100,
        )
      : null;

  const salesTooltipFormatter = (v: unknown, _n: unknown, props: unknown) => {
    const val = typeof v === "number" ? v : Number(v);
    const pct = (props as { payload?: { pct?: number } })?.payload?.pct;
    return [`${val} (${pct ?? "—"}%)`, t("dashboard.tooltip.sales")];
  };

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
                      data={salesByVmChartRanked}
                      barSize={72}
                      barCategoryGap={16}
                      margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
                    >
                      <XAxis dataKey="name" hide />
                      <YAxis hide domain={[0, "dataMax"]} />
                      <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.03)" }}
                        contentStyle={{
                          borderRadius: 12,
                          borderColor: "rgba(0,0,0,0.08)",
                        }}
                        formatter={salesTooltipFormatter}
                      />
                      <Bar
                        dataKey="total"
                        radius={[0, 0, 12, 12]}
                        background={{ fill: "rgba(0,0,0,0.04)", radius: 12 }}
                        minPointSize={34}
                      >
                        {salesByVmChartRanked.map((entry, idx) => (
                          <Cell
                            key={`${entry.name}-${idx}`}
                            fill={
                              entry.isOther
                                ? "rgba(71,84,103,0.78)"
                                : "var(--primary)"
                            }
                          />
                        ))}
                        <LabelList
                          dataKey="rankIdx"
                          content={renderRankBadge}
                        />
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
                  {POPULAR_TABS.map((opt) => {
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
                        {t(opt.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={cn(styles.chartBox, styles.chartBoxPopular)}>
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
                      data={salesByProductChartRanked}
                      barCategoryGap={4}
                      margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
                    >
                      <XAxis dataKey="name" hide />
                      <YAxis hide domain={[0, "dataMax"]} />
                      <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.03)" }}
                        contentStyle={{
                          borderRadius: 12,
                          borderColor: "rgba(0,0,0,0.08)",
                        }}
                        formatter={salesTooltipFormatter}
                      />
                      <Bar
                        dataKey="total"
                        radius={[0, 0, 12, 12]}
                        background={{ fill: "rgba(0,0,0,0.04)", radius: 12 }}
                        minPointSize={34}
                      >
                        {salesByProductChartRanked.map((entry, idx) => (
                          <Cell
                            key={`${entry.name}-${idx}`}
                            fill={
                              entry.isOther
                                ? "rgba(71,84,103,0.78)"
                                : "var(--primary)"
                            }
                          />
                        ))}
                        <LabelList
                          dataKey="rankIdx"
                          content={renderRankBadge}
                        />
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
                  <div className={cn(styles.statLabel, styles.statLabelLower)}>
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
