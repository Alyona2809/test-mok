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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card/Card";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import type {
  SalesIndexItem,
  VendingMachineMoneyStatus,
} from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n";
import styles from "./MachinesHealthSection.module.css";
import Image from "next/image";
import { GoToReportButton } from "@/components/ui/Button/GoToReportButton";
import {
  renderFixedYPctLabel,
  renderValuePill,
  type RechartsLabelRenderProps,
} from "../utils/rechartsLabelHelpers";

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
  const PRODUCT_FILL_PCT_LABEL_Y = 20;

  const chipClass = (machineType: string) =>
    cn(
      styles.chip,
      machineType === "B"
        ? styles.chipB
        : machineType === "M"
          ? styles.chipM
          : styles.chipOther,
    );

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
                        <span className={chipClass(x.machineType)}>
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
                    barSize={76}
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
                      radius={[0, 0, 12, 12]}
                      background={{ fill: "var(--muted)", radius: 16 }}
                      minPointSize={34}
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
                        content={(props: RechartsLabelRenderProps) =>
                          renderValuePill(props, {
                            bottomOffset: 10,
                            minTopInset: 6,
                          })
                        }
                      />
                      <LabelList
                        dataKey="value"
                        content={(props: RechartsLabelRenderProps) =>
                          renderFixedYPctLabel(
                            props,
                            PRODUCT_FILL_PCT_LABEL_Y,
                            { suffix: " %" },
                          )
                        }
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
                      <span className={chipClass(x.machineType)}>
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
