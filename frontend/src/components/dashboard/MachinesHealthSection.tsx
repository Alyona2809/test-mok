"use client";

import { Banknote, ChevronDown, Coins } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import type { SalesIndexItem, VendingMachineMoneyStatus } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n";
import styles from "./MachinesHealthSection.module.css";

type LabelRenderProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  payload?: unknown;
};

export function MachinesHealthSection({
  salesIndexLoading,
  salesIndexTop,
  productFillLoading,
  productFillTotal,
  productFillPct,
  productFillChart,
  moneyFillLoading,
  moneyFillTop,
}: {
  salesIndexLoading: boolean;
  salesIndexTop: SalesIndexItem[];
  productFillLoading: boolean;
  productFillTotal?: number;
  productFillPct?: number;
  productFillChart: Array<{ name: string; value: number; itemCount: number }>;
  moneyFillLoading: boolean;
  moneyFillTop: VendingMachineMoneyStatus[];
}) {
  const { t } = useI18n();

  return (
    <section className={styles.section}>
      <div className={styles.title}>{t("dashboard.sections.machinesHealth")}</div>
      <div className={styles.grid}>
        <Card className={cn(styles.col12, styles.colXl4)}>
          <CardHeader>
            <div className={styles.cardHeaderRow}>
              <div>
                <CardTitle className={styles.cardTitleStrong}>
                  {t("dashboard.cards.salesIndexTitle")}
                </CardTitle>
                <div className={styles.subText}>{t("common.changeMetric")}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {salesIndexLoading ? (
              <div className={styles.stackSm}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className={styles.skelRow} />
                ))}
              </div>
            ) : (
              <div className={styles.stackSm}>
                {salesIndexTop.map((x) => (
                  <div key={`${x.machineType}-${x.machineId}`} className={styles.stackXs}>
                    <div className={cn(styles.rowBetween, styles.textXs)}>
                      <div className={cn(styles.leftInline, styles.fontMedium, styles.textFg)}>
                        <span
                          className={cn(
                            styles.chip,
                            x.machineType === "B"
                              ? styles.chipB
                              : x.machineType === "M"
                                ? styles.chipM
                                : styles.chipOther,
                          )}
                        >
                          {x.machineType}
                        </span>
                        <span>#{x.machineId}</span>
                      </div>
                      <div className={styles.textMuted}>{x.percentage}%</div>
                    </div>
                    <ProgressBar
                      value={x.percentage}
                      tone={x.percentage >= 70 ? "good" : x.percentage >= 40 ? "warn" : "bad"}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={cn(styles.col12, styles.colXl4)}>
          <CardHeader>
            <div className={styles.cardHeaderRow}>
              <div>
                <CardTitle className={styles.cardTitleStrong}>
                  {t("dashboard.cards.productFillTitle")}
                </CardTitle>
                <div className={styles.bigNumberRow}>
                  <div className={styles.bigNumber}>
                    {productFillTotal ?? <Skeleton className={styles.skelBigNumberInline} />}
                  </div>
                  {productFillPct == null ? null : (
                    <div className={styles.pctPill}>
                      {productFillPct}%
                    </div>
                  )}
                </div>
                <div className={cn(styles.textXs, styles.textMuted)}>
                  {t("dashboard.cards.productFillSubtitle")}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {productFillLoading ? (
              <Skeleton className={styles.chart190} />
            ) : (
              <div className={styles.chart190}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productFillChart}
                    barSize={32}
                    margin={{ top: 22, right: 8, left: 8, bottom: 0 }}
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
                        const pct = (props.payload as { value?: number })?.value;
                        return [
                          `${val} (${t("dashboard.tooltip.fill")}: ${pct ?? "—"}%)`,
                          t("dashboard.tooltip.vm"),
                        ];
                      }}
                    />
                    <Bar dataKey="itemCount" radius={[14, 14, 14, 14]}>
                      {productFillChart.map((entry) => {
                        const highlight = (entry.value ?? 100) <= 10;
                        return (
                          <Cell
                            key={entry.name}
                            fill={highlight ? "var(--primary)" : "rgba(17,24,39,0.16)"}
                          />
                        );
                      })}
                      <LabelList
                        dataKey="itemCount"
                        content={(props: LabelRenderProps) => {
                          const x =
                            typeof props.x === "number" ? props.x : props.x == null ? NaN : Number(props.x);
                          const y =
                            typeof props.y === "number" ? props.y : props.y == null ? NaN : Number(props.y);
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

                          const payload = props.payload as
                            | { itemCount?: number; value?: number }
                            | undefined;
                          const highlight = (payload?.value ?? 100) <= 10;
                          if (!highlight) return null;
                          return (
                            <text
                              x={x + width / 2}
                              y={y + height / 2 + 4}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize={12}
                              fontWeight={700}
                            >
                              {payload?.itemCount ?? ""}
                            </text>
                          );
                        }}
                      />
                      <LabelList
                        dataKey="value"
                        content={(props: LabelRenderProps) => {
                          const x =
                            typeof props.x === "number" ? props.x : props.x == null ? NaN : Number(props.x);
                          const y =
                            typeof props.y === "number" ? props.y : props.y == null ? NaN : Number(props.y);
                          const width =
                            typeof props.width === "number"
                              ? props.width
                              : props.width == null
                                ? NaN
                                : Number(props.width);
                          if (![x, y, width].every(Number.isFinite)) return null;

                          const payload = props.payload as { value?: number } | undefined;
                          const v = payload?.value;
                          if (v == null) return null;
                          const highlight = v <= 10;
                          if (!highlight) return null;
                          return (
                            <text
                              x={x + width / 2}
                              y={y - 8}
                              textAnchor="middle"
                              fill="rgba(107,114,128,0.9)"
                              fontSize={11}
                              fontWeight={600}
                            >
                              {v}%
                            </text>
                          );
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className={styles.goReport}>{t("common.goToReport")}</div>
          </CardContent>
        </Card>

        <Card className={cn(styles.col12, styles.colXl4)}>
          <CardHeader>
            <div className={styles.cardHeaderRowTop}>
              <div>
                <CardTitle className={styles.cardTitleStrong}>
                  {t("dashboard.cards.moneyFillTitle")}
                </CardTitle>
                <div className={styles.subText}>{t("dashboard.cards.moneyFillSubtitle")}</div>
              </div>
              <button
                type="button"
                className={styles.sortBtn}
              >
                {t("dashboard.cards.sortFirstFull")}
                <ChevronDown className={styles.iconSm} />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {moneyFillLoading ? (
              <div className={styles.stackSm}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className={styles.skelMoneyRow} />
                ))}
              </div>
            ) : (
              <div className={styles.moneyList}>
                {moneyFillTop.map((x) => (
                  <div key={`${x.machineType}-${x.machineId}`} className={styles.moneyRow}>
                    <div className={styles.machineIdBox}>
                      <span
                        className={cn(
                          styles.chip,
                          x.machineType === "B"
                            ? styles.chipB
                            : x.machineType === "M"
                              ? styles.chipM
                              : styles.chipOther,
                        )}
                      >
                        {x.machineType}
                      </span>
                      <span className={cn(styles.textSm, styles.fontSemi, styles.textFg)}>
                        #{x.machineId}
                      </span>
                    </div>

                    <div className={styles.moneyGrid}>
                      <div className={styles.metric}>
                        <div className={styles.metricHeader}>
                          <span className={styles.metricLabel}>
                            <Coins className={styles.metricIcon} />
                            {t("money.coins")}
                          </span>
                          <span className={styles.fontMedium}>{x.coinFillPercentage}%</span>
                        </div>
                        <ProgressBar
                          value={x.coinFillPercentage}
                          size="sm"
                          tone={
                            x.coinFillPercentage >= 70 ? "good" : x.coinFillPercentage >= 40 ? "warn" : "primary"
                          }
                        />
                      </div>

                      <div className={styles.metric}>
                        <div className={styles.metricHeader}>
                          <span className={styles.metricLabel}>
                            <Banknote className={styles.metricIcon} />
                            {t("money.banknotes")}
                          </span>
                          <span className={styles.fontMedium}>{x.banknotesFillPercentage}%</span>
                        </div>
                        <ProgressBar
                          value={x.banknotesFillPercentage}
                          size="sm"
                          tone={
                            x.banknotesFillPercentage >= 70
                              ? "good"
                              : x.banknotesFillPercentage >= 40
                                ? "warn"
                                : "primary"
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.goReport}>{t("common.goToReport")}</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

