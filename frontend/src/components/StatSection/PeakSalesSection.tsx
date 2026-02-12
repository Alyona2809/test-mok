"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import type { PeakSaleTimeAtDay } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n";
import { fmtMinutesToHHMM, parseTimeSpanToMinutes } from "./peakTime";
import styles from "./PeakSalesSection.module.css";
import controlsStyles from "../dashboard/DashboardControlsBar.module.css";

export type PeakViewKey = "line" | "heat";

const PEAK_TIME_BANDS = [
  { from: 1200, to: 1439, label: "20:00 – 23:59" },
  { from: 960, to: 1199, label: "16:00 – 19:59" },
  { from: 720, to: 959, label: "12:00 – 15:59" },
  { from: 600, to: 719, label: "10:00 – 11:59" },
  { from: 360, to: 599, label: "06:00 – 09:59" },
  { from: 0, to: 359, label: "00:00 – 05:59" },
] as const;

const PEAK_BAND_TICKS = PEAK_TIME_BANDS.map((_b, i) => i);

function getPeakTimeBandIndex(minutes: number) {
  const m = Number(minutes);
  if (!Number.isFinite(m)) return 0;
  if (m <= 359) return 0;
  if (m <= 599) return 1;
  if (m <= 719) return 2;
  if (m <= 959) return 3;
  if (m <= 1199) return 4;
  return 5;
}

function formatPeakSalesYAxisTick(v: unknown) {
  const idx = Number(v);
  return (
    PEAK_TIME_BANDS[idx as 0 | 1 | 2 | 3 | 4 | 5]?.label ?? String(v ?? "")
  );
}

function PeakSalesYAxisTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value?: unknown };
}) {
  const label = formatPeakSalesYAxisTick(payload?.value);
  return (
    <g transform={`translate(${x ?? 0},${y ?? 0})`}>
      <text
        x={0}
        y={0}
        textAnchor="end"
        dominantBaseline="central"
        className={styles.yTick}
      >
        {label}
      </text>
    </g>
  );
}

export function PeakSalesSection({
  peakView,
  onPeakViewChange,
  isLoading,
  peakChart,
  peakTimesData,
}: {
  peakView: PeakViewKey;
  onPeakViewChange: (v: PeakViewKey) => void;
  isLoading: boolean;
  peakChart: Array<{ day: number; minutes: number; label: string }>;
  peakTimesData: PeakSaleTimeAtDay[];
}) {
  const { t } = useI18n();

  const peakChartBanded = peakChart.map((p) => ({
    ...p,
    band: getPeakTimeBandIndex(p.minutes),
  }));

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.title}>
          {t("dashboard.sections.peakSalesTime")}
        </div>
        <div
          className={cn(styles.tabsWrap, controlsStyles.tabs)}
          role="tablist"
          aria-label={t("aria.segmented")}
        >
          {(
            [
              { value: "line", label: t("dashboard.peakView.line") },
              { value: "heat", label: t("dashboard.peakView.heat") },
            ] as const
          ).map((opt) => {
            const selected = opt.value === peakView;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onPeakViewChange(opt.value)}
                className={
                  selected ? controlsStyles.tabSelected : controlsStyles.tab
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

      <Card>
        <CardContent className={styles.cardContent}>
          {isLoading ? (
            <Skeleton className={styles.skelChart} />
          ) : peakView === "line" ? (
            <div className={styles.chart}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={peakChartBanded}
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                >
                  <CartesianGrid
                    vertical
                    stroke="rgba(0,0,0,0.06)"
                    horizontal={false}
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    domain={[0, PEAK_TIME_BANDS.length - 1]}
                    tickLine={false}
                    axisLine={false}
                    width={96}
                    tickMargin={0}
                    ticks={PEAK_BAND_TICKS}
                    tick={<PeakSalesYAxisTick />}
                  />
                  <Tooltip
                    cursor={{ stroke: "rgba(0,0,0,0.06)" }}
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: "rgba(0,0,0,0.08)",
                    }}
                    formatter={(v: unknown, _n, props) => {
                      const payload = props.payload as {
                        label?: string;
                        minutes?: number;
                      };
                      const label = payload?.label;
                      return [
                        label ?? fmtMinutesToHHMM(payload?.minutes ?? 0),
                        t("dashboard.tooltip.peak"),
                      ];
                    }}
                  />
                  <defs>
                    <linearGradient id="peakFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(17,24,39,0.12)" />
                      <stop offset="100%" stopColor="rgba(17,24,39,0.00)" />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="band"
                    stroke="rgba(71,85,105,0.95)"
                    strokeWidth={2.5}
                    fill="url(#peakFill)"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={styles.heatGrid}>
              {peakTimesData.map((x) => {
                const minutes = parseTimeSpanToMinutes(x.peakSalesTime);
                const hour = Math.floor(minutes / 60);
                const alpha = 0.15 + (hour / 23) * 0.55;
                return (
                  <div
                    key={x.day}
                    title={t("map.dayTitle", {
                      day: x.day,
                      time: x.peakSalesTime,
                    })}
                    className={styles.heatCell}
                    style={{
                      background: `rgba(216, 11, 58, ${alpha})`,
                    }}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
