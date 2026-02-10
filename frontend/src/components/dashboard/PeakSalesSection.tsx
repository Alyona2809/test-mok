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
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Segmented } from "@/components/ui/Segmented";
import type { PeakSaleTimeAtDay } from "@/lib/api/types";
import { useI18n } from "@/i18n";
import { fmtMinutesToHHMM, parseTimeSpanToMinutes } from "./peakTime";
import styles from "./PeakSalesSection.module.css";

export type PeakViewKey = "line" | "heat";

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

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.title}>{t("dashboard.sections.peakSalesTime")}</div>
        <Segmented
          value={peakView}
          onChange={onPeakViewChange}
          layoutId="peak-pill"
          ariaLabel={t("aria.segmented")}
          options={[
            { value: "line", label: t("dashboard.peakView.line") },
            { value: "heat", label: t("dashboard.peakView.heat") },
          ]}
        />
      </div>

      <Card>
        <CardContent className={styles.contentPadTop}>
          {isLoading ? (
            <Skeleton className={styles.skelChart} />
          ) : peakView === "line" ? (
            <div className={styles.chart}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={peakChart}>
                  <CartesianGrid vertical stroke="rgba(0,0,0,0.06)" horizontal={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    domain={[0, 24 * 60]}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    ticks={[0, 360, 600, 720, 960, 1200]}
                    tickFormatter={(v) => {
                      const n = Number(v);
                      if (n === 0) return "00:00 – 05:59";
                      if (n === 360) return "06:00 – 09:59";
                      if (n === 600) return "10:00 – 11:59";
                      if (n === 720) return "12:00 – 15:59";
                      if (n === 960) return "16:00 – 19:59";
                      if (n === 1200) return "20:00 – 23:59";
                      return fmtMinutesToHHMM(n);
                    }}
                  />
                  <Tooltip
                    cursor={{ stroke: "rgba(0,0,0,0.06)" }}
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: "rgba(0,0,0,0.08)",
                    }}
                    formatter={(v: unknown, _n, props) => {
                      const val = typeof v === "number" ? v : Number(v);
                      const label = (props.payload as { label?: string })?.label;
                      return [label ?? fmtMinutesToHHMM(val), t("dashboard.tooltip.peak")];
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
                    dataKey="minutes"
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
                    title={t("map.dayTitle", { day: x.day, time: x.peakSalesTime })}
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

