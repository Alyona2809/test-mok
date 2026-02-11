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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import type {
  SalesIndexItem,
  VendingMachineMoneyStatus,
} from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n";
import styles from "./MachinesHealthSection.module.css";
import Image from "next/image";
import { GoToReportButton } from "@/components/ui/GoToReportButton";

type LabelRenderProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  payload?: unknown;
  viewBox?: unknown;
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
  const PRODUCT_FILL_HIGHLIGHT_THRESHOLD = 10;

  return (
    <section className={styles.section}>
      <div className={styles.title}>
        {t("dashboard.sections.machinesHealth")}
      </div>
      <div className={styles.grid}>
        <Card className={styles.card321}>
          <CardHeader>
            <div className={styles.cardHeaderRow}>
              <div>
                <CardTitle className={styles.cardTitleStrong}>
                  {t("dashboard.cards.salesIndexTitle")}
                </CardTitle>
                <div className={styles.subText}>
                  <span className={styles.subTextPill}>
                    <span className={styles.subTextPillLabel}>
                      {t("common.changeMetric")}
                    </span>
                  </span>
                  <Image
                    className={cn(styles.subTextIcon, styles.subTextIconRight)}
                    src="/arrow-down-short-wide.svg"
                    alt=""
                    width={16}
                    height={16}
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            {salesIndexLoading ? (
              <div className={styles.stackSm}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className={styles.skelRow} />
                ))}
              </div>
            ) : (
              <div className={styles.stackSm}>
                {salesIndexTop.map((x) => (
                  <div
                    key={`${x.machineType}-${x.machineId}`}
                    className={styles.stackXs}
                  >
                    <div className={cn(styles.rowBetween, styles.textXs)}>
                      <div
                        className={cn(
                          styles.leftInline,
                          styles.fontMedium,
                          styles.textFg,
                        )}
                      >
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
                      tone={
                        x.percentage >= 70
                          ? "good"
                          : x.percentage >= 40
                            ? "warn"
                            : "bad"
                      }
                    />
                  </div>
                ))}
              </div>
            )}
            <GoToReportButton className={styles.goToReportButton} />
          </CardContent>
        </Card>

        <Card className={styles.card321}>
          <CardHeader>
            <CardTitle className={styles.cardTitleStrong}>
              {t("dashboard.cards.productFillTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            {productFillLoading ? (
              <Skeleton className={styles.chart190} />
            ) : (
              <div className={styles.chart190}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productFillChart}
                    barSize={57}
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
                        const pct = (props.payload as { value?: number })
                          ?.value;
                        return [
                          `${val} (${t("dashboard.tooltip.fill")}: ${pct ?? "—"}%)`,
                          t("dashboard.tooltip.vm"),
                        ];
                      }}
                    />
                    <Bar
                      dataKey="itemCount"
                      radius={[16, 16, 16, 16]}
                      background={{ fill: "var(--muted)", radius: 16 }}
                    >
                      {productFillChart.map((entry) => {
                        const highlight =
                          (entry.value ?? 0) >=
                          PRODUCT_FILL_HIGHLIGHT_THRESHOLD;
                        return (
                          <Cell
                            key={entry.name}
                            fill={
                              highlight
                                ? "var(--primary)"
                                : "rgba(71,84,103,0.72)"
                            }
                          />
                        );
                      })}
                      <LabelList
                        dataKey="itemCount"
                        content={(props: LabelRenderProps) => {
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
                          if (![x, y, width, height].every(Number.isFinite))
                            return null;

                          const payload = props.payload as
                            | { itemCount?: number; value?: number }
                            | undefined;
                          const itemCount = payload?.itemCount;
                          if (itemCount == null) return null;

                          const label = String(itemCount);
                          const pillHeight = 20;
                          const pillPaddingX = 10;
                          const pillWidth = Math.max(
                            34,
                            label.length * 7 + pillPaddingX * 2,
                          );
                          const cx = x + width / 2;
                          const pillX = cx - pillWidth / 2;
                          const unclampedPillY = y + height - pillHeight - 10;
                          const pillY = Math.max(y + 6, unclampedPillY);
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
                        }}
                      />
                      <LabelList
                        dataKey="value"
                        content={(props: LabelRenderProps) => {
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
                          if (![x, y, width, height].every(Number.isFinite))
                            return null;

                          const payload = props.payload as
                            | { value?: number; itemCount?: number }
                            | undefined;
                          const v = payload?.value;
                          if (v == null) return null;

                          const vb = props.viewBox as
                            | {
                                x?: unknown;
                                y?: unknown;
                                width?: unknown;
                                height?: unknown;
                              }
                            | undefined;
                          const vbY =
                            vb && typeof vb.y === "number" ? vb.y : undefined;
                          const vbH =
                            vb && typeof vb.height === "number"
                              ? vb.height
                              : undefined;
                          const yInside =
                            vbY != null && vbH != null
                              ? Math.max(
                                  vbY + 14,
                                  Math.min(vbY + vbH - 8, vbY + 28),
                                )
                              : Math.max(16, Math.min(y + height - 8, y + 18));
                          return (
                            <text
                              x={x + width / 2}
                              y={yInside}
                              textAnchor="middle"
                              fill="var(--text-light)"
                              fontSize={12}
                              fontWeight={500}
                            >
                              {v} %
                            </text>
                          );
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className={styles.bigNumberRow}>
              <div className={styles.bigNumberBlock}>
                <div className={styles.bigNumber}>
                  {productFillTotal ?? (
                    <Skeleton className={styles.skelBigNumberInline} />
                  )}
                </div>
                <div className={styles.bigNumberCaption}>
                  {t("dashboard.cards.productFillSubtitle")}
                </div>
              </div>
              {productFillPct == null ? null : (
                <div className={styles.pctPill}>{productFillPct}%</div>
              )}
            </div>
            <GoToReportButton className={styles.goToReportButton} />
          </CardContent>
        </Card>

        <Card className={styles.card321}>
          <CardHeader className={styles.moneyFillHeader}>
            <div className={styles.cardHeaderRowTop}>
              <div>
                <CardTitle className={styles.cardTitleStrong}>
                  {t("dashboard.cards.moneyFillTitle")}
                </CardTitle>
                <div className={styles.subText}>
                  <Image
                    className={styles.subTextIcon}
                    src="/arrow-down-short-wide.svg"
                    alt=""
                    width={16}
                    height={16}
                    aria-hidden
                  />
                  <span className={styles.subTextPill}>
                    <span className={styles.subTextPillLabel}>
                      {t("dashboard.cards.moneyFillSubtitle")}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            {moneyFillLoading ? (
              <div className={styles.stackSm}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className={styles.skelMoneyRow} />
                ))}
              </div>
            ) : (
              <div className={styles.moneyList}>
                {moneyFillTop.map((x) => (
                  <div
                    key={`${x.machineType}-${x.machineId}`}
                    className={styles.moneyRow}
                  >
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
                      <span
                        className={cn(
                          styles.textSm,
                          styles.fontSemi,
                          styles.textFg,
                        )}
                      >
                        #{x.machineId}
                      </span>
                    </div>

                    <div className={styles.moneyGrid}>
                      <div className={styles.metric}>
                        <div className={styles.metricHeader}>
                          <span className={styles.metricLabel}>
                            <Image
                              src="/coin-alt.svg"
                              alt="Coin"
                              width={16}
                              height={16}
                            />
                          </span>
                          <span className={styles.fontMedium}>
                            {x.coinFillPercentage}%
                          </span>
                        </div>
                        <ProgressBar
                          value={x.coinFillPercentage}
                          size="sm"
                          tone={
                            x.coinFillPercentage >= 70
                              ? "good"
                              : x.coinFillPercentage >= 40
                                ? "warn"
                                : "primary"
                          }
                        />
                      </div>

                      <div className={styles.metric}>
                        <div className={styles.metricHeader}>
                          <span className={styles.metricLabel}>
                            <Image
                              src="/cash.svg"
                              alt="Banknote"
                              width={16}
                              height={16}
                            />
                          </span>
                          <span className={styles.fontMedium}>
                            {x.banknotesFillPercentage}%
                          </span>
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
            <GoToReportButton className={styles.goToReportButton} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
