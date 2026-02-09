"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Banknote, ChevronDown, Coins } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useMachinesMoneyFillQuery,
  useMachinesOverviewQuery,
  useMachinesProductFillQuery,
  usePeakSaleCountPerDayQuery,
  useSalesByProductTypeQuery,
  useSalesByVendingMachineQuery,
  useSalesIndexByHistoricAvgQuery,
} from "@/lib/api/dashboardApi";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Segmented } from "@/components/ui/Segmented";
import { cn } from "@/lib/cn";

const VendingMap = dynamic(
  () =>
    import("@/components/dashboard/VendingMap").then((m) => ({
      default: m.VendingMap,
    })),
  { ssr: false, loading: () => <div className="h-full w-full bg-black/[0.03]" /> },
);

function StatCard({
  label,
  value,
  tone = "neutral",
  pct,
}: {
  label: string;
  value?: number;
  tone?: "neutral" | "good" | "warn" | "bad";
  pct?: number;
}) {
  const toneClass =
    tone === "good"
      ? "text-emerald-600"
      : tone === "warn"
        ? "text-amber-600"
        : tone === "bad"
          ? "text-rose-600"
          : "text-foreground";

  return (
    <Card className="h-full">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm font-medium text-muted">{label}</div>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-background text-muted hover:text-foreground"
            aria-label="Открыть"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          {value == null ? (
            <Skeleton className="h-10 w-20 rounded-xl" />
          ) : (
            <div className={cn("text-4xl font-semibold tracking-tight", toneClass)}>{value}</div>
          )}
          {pct == null ? null : (
            <div className="pb-1 text-xs font-medium text-muted">{pct}%</div>
          )}
        </div>
      </div>
    </Card>
  );
}

function parseTimeSpanToMinutes(time: string) {
  // "HH:mm:ss"
  const [hh, mm] = time.split(":");
  const h = Number(hh);
  const m = Number(mm);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
}

function fmtMinutesToHHMM(min: number) {
  const h = Math.floor(min / 60) % 24;
  const m = Math.floor(min % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function Home() {
  const [period, setPeriod] = useState<"Сегодня" | "Вчера" | "Неделя" | "Месяц" | "Квартал">(
    "Месяц",
  );
  const [mapTab, setMapTab] = useState<
    "Состояние автоматов" | "Средняя выручка" | "Простой ТА" | "Уровень заполнения"
  >("Состояние автоматов");
  const [popularTab, setPopularTab] = useState<"Товары" | "Категории">("Товары");
  const [peakView, setPeakView] = useState<"line" | "heat">("line");

  const overview = useMachinesOverviewQuery();
  const salesIndex = useSalesIndexByHistoricAvgQuery();
  const productFill = useMachinesProductFillQuery();
  const moneyFill = useMachinesMoneyFillQuery();
  const salesByVm = useSalesByVendingMachineQuery();
  const salesByProduct = useSalesByProductTypeQuery();
  const peakTimes = usePeakSaleCountPerDayQuery();

  const salesIndexTop = useMemo(
    () => (salesIndex.data ?? []).slice(0, 5),
    [salesIndex.data],
  );

  const productFillChart = useMemo(() => {
    const items = productFill.data?.topFilled ?? [];
    return items.map((x, idx) => ({
      name: `#${idx + 1}`,
      value: x.fillPercentage,
      itemCount: x.itemCount,
    }));
  }, [productFill.data]);

  const productFillPct = useMemo(() => {
    const total = overview.data?.total;
    const needs = productFill.data?.total;
    if (!total || needs == null) return undefined;
    return Math.round((needs / total) * 100);
  }, [overview.data?.total, productFill.data?.total]);

  const moneyFillTop = useMemo(
    () => (moneyFill.data ?? []).slice(0, 5),
    [moneyFill.data],
  );

  const salesByVmChart = useMemo(() => {
    const items = salesByVm.data?.topVendingMachines ?? [];
    return items.map((x, idx) => ({
      name: `TA ${idx + 1}`,
      total: x.totalSales,
      pct: x.percentageOfAllSales,
    }));
  }, [salesByVm.data]);

  const salesByProductChart = useMemo(() => {
    const items = salesByProduct.data?.topProducts ?? [];
    return items.map((x, idx) => ({
      name: `#${x.productId}`,
      total: x.soldTotal,
      pct: x.percentageOfAllSales,
      idx: idx + 1,
    }));
  }, [salesByProduct.data]);

  const peakChart = useMemo(() => {
    const items = peakTimes.data ?? [];
    return items.map((x) => ({
      day: x.day,
      minutes: parseTimeSpanToMinutes(x.peakSalesTime),
      label: x.peakSalesTime,
    }));
  }, [peakTimes.data]);

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-7"
      >
        <section className="flex flex-wrap items-center justify-between gap-3">
          <Segmented
            value={period}
            onChange={setPeriod}
            layoutId="period-pill"
            options={[
              { value: "Сегодня", label: "Сегодня" },
              { value: "Вчера", label: "Вчера" },
              { value: "Неделя", label: "Неделя" },
              { value: "Месяц", label: "Месяц" },
              { value: "Квартал", label: "Квартал" },
            ]}
          />

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            23.08.2023 – 20.09.2024
            <ChevronDown className="h-4 w-4 opacity-70" />
          </button>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Всего автоматов" value={overview.data?.total} />
          <StatCard
            label="Работающих"
            value={overview.data?.working}
            tone="good"
            pct={
              overview.data?.total
                ? Math.round((overview.data.working / overview.data.total) * 100)
                : undefined
            }
          />
          <StatCard
            label="Мало товаров"
            value={overview.data?.lowSupply}
            tone="warn"
            pct={
              overview.data?.total
                ? Math.round((overview.data.lowSupply / overview.data.total) * 100)
                : undefined
            }
          />
          <StatCard
            label="Требуют обслуживания"
            value={overview.data?.needsRepair}
            tone="bad"
            pct={
              overview.data?.total
                ? Math.round((overview.data.needsRepair / overview.data.total) * 100)
                : undefined
            }
          />
        </section>

        <section>
          <Card className="overflow-hidden">
            <div className="relative h-[420px] bg-background">
              {mapTab === "Состояние автоматов" ? (
                <VendingMap salesIndex={salesIndex.data} moneyFill={moneyFill.data} />
              ) : (
                <div className="grid h-full place-items-center text-sm text-muted">
                  Демо-вкладка: {mapTab}
                </div>
              )}
            </div>
            <div className="border-t border-border px-5 py-4">
              <div className="flex justify-center">
                <Segmented
                  value={mapTab}
                  onChange={setMapTab}
                  layoutId="map-pill"
                  options={[
                    { value: "Состояние автоматов", label: "Состояние автоматов" },
                    { value: "Средняя выручка", label: "Средняя выручка" },
                    { value: "Простой ТА", label: "Простой ТА" },
                    { value: "Уровень заполнения", label: "Уровень заполнения" },
                  ]}
                  className="bg-card shadow-sm"
                />
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="text-xl font-semibold text-muted">Обзор состояния ТА</div>
          <div className="grid grid-cols-12 gap-5">
            <Card className="col-span-12 xl:col-span-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground font-semibold">
                      Индекс продаж по средней исторической активности
                    </CardTitle>
                    <div className="mt-2 text-xs text-muted">Изменить показатель</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {salesIndex.isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-9 w-full rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {salesIndexTop.map((x) => (
                      <div key={`${x.machineType}-${x.machineId}`} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 font-medium text-foreground">
                            <span
                              className={cn(
                                "grid h-5 w-5 place-items-center rounded-md text-[11px] font-bold",
                                x.machineType === "B"
                                  ? "bg-primary/10 text-primary"
                                  : x.machineType === "M"
                                    ? "bg-amber-500/10 text-amber-700"
                                    : "bg-black/[0.06] text-muted",
                              )}
                            >
                              {x.machineType}
                            </span>
                            <span>#{x.machineId}</span>
                          </div>
                          <div className="text-muted">{x.percentage}%</div>
                        </div>
                        <ProgressBar
                          value={x.percentage}
                          barClassName={
                            x.percentage >= 70
                              ? "bg-emerald-500"
                              : x.percentage >= 40
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-12 xl:col-span-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground font-semibold">Заполнение товарами</CardTitle>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <div className="text-4xl font-semibold tracking-tight">
                        {productFill.data?.total ?? <Skeleton className="inline-block h-10 w-20 rounded-xl" />}
                      </div>
                      {productFillPct == null ? null : (
                        <div className="mb-1 rounded-full bg-black/[0.04] px-2 py-1 text-xs font-medium text-muted">
                          {productFillPct}%
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted">ТА требуют заполнения товаром</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {productFill.isLoading ? (
                  <Skeleton className="h-[190px] w-full rounded-2xl" />
                ) : (
                  <div className="h-[190px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productFillChart} barSize={32} margin={{ top: 22, right: 8, left: 8, bottom: 0 }}>
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
                            return [`${val} (заполнение: ${pct ?? "—"}%)`, "ТА"];
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
                            content={(props: any) => {
                              const payload = props.payload as { itemCount?: number; value?: number } | undefined;
                              const highlight = (payload?.value ?? 100) <= 10;
                              if (!highlight) return null;
                              return (
                                <text
                                  x={props.x! + props.width! / 2}
                                  y={props.y! + props.height! / 2 + 4}
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
                            content={(props: any) => {
                              const payload = props.payload as { value?: number } | undefined;
                              const v = payload?.value;
                              if (v == null) return null;
                              const highlight = v <= 10;
                              if (!highlight) return null;
                              return (
                                <text
                                  x={props.x! + props.width! / 2}
                                  y={props.y! - 8}
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
                <div className="mt-3 text-xs text-muted">Перейти в отчет</div>
              </CardContent>
            </Card>

            <Card className="col-span-12 xl:col-span-4">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-foreground font-semibold">Состояние денежных средств</CardTitle>
                    <div className="mt-2 text-xs text-muted">Сигналы наполнение ТА</div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-muted hover:text-foreground"
                  >
                    Сначала полные ТА
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {moneyFill.isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {moneyFillTop.map((x) => (
                      <div key={`${x.machineType}-${x.machineId}`} className="flex items-center gap-4 py-3">
                        <div className="flex min-w-[96px] items-center gap-2">
                          <span
                            className={cn(
                              "grid h-5 w-5 place-items-center rounded-md text-[11px] font-bold",
                              x.machineType === "B"
                                ? "bg-primary/10 text-primary"
                                : x.machineType === "M"
                                  ? "bg-amber-500/10 text-amber-700"
                                  : "bg-black/[0.06] text-muted",
                            )}
                          >
                            {x.machineType}
                          </span>
                          <span className="text-sm font-semibold text-foreground">#{x.machineId}</span>
                        </div>

                        <div className="grid flex-1 grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-muted">
                              <span className="inline-flex items-center gap-1.5">
                                <Coins className="h-3.5 w-3.5 opacity-70" />
                                Монеты
                              </span>
                              <span className="font-medium">{x.coinFillPercentage}%</span>
                            </div>
                            <ProgressBar
                              value={x.coinFillPercentage}
                              className="h-1"
                              barClassName={
                                x.coinFillPercentage >= 70
                                  ? "bg-emerald-500"
                                  : x.coinFillPercentage >= 40
                                    ? "bg-amber-500"
                                    : "bg-primary"
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-muted">
                              <span className="inline-flex items-center gap-1.5">
                                <Banknote className="h-3.5 w-3.5 opacity-70" />
                                Купюры
                              </span>
                              <span className="font-medium">{x.banknotesFillPercentage}%</span>
                            </div>
                            <ProgressBar
                              value={x.banknotesFillPercentage}
                              className="h-1"
                              barClassName={
                                x.banknotesFillPercentage >= 70
                                  ? "bg-emerald-500"
                                  : x.banknotesFillPercentage >= 40
                                    ? "bg-amber-500"
                                    : "bg-primary"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 text-xs text-muted">Перейти в отчет</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <div className="text-lg font-semibold">Аналитика продаж и потребительского поведения</div>
          <div className="grid grid-cols-12 gap-5">
            <Card className="col-span-12 xl:col-span-6">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">ТА по объемам продаж</div>
                    <div className="mt-2 flex items-end gap-3">
                      <div className="text-2xl font-semibold">
                        {salesByVm.data?.totalSales ?? <Skeleton className="h-7 w-24" />}
                      </div>
                      <div className="text-xs text-muted">Всего продаж</div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted">
                    Топ-5: {salesByVm.data?.soldInTopFive ?? "—"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {salesByVm.isLoading ? (
                  <Skeleton className="h-[220px] w-full rounded-2xl" />
                ) : (
                  <div className="h-[220px]">
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
                            return [`${val} (${pct ?? "—"}%)`, "Продажи"];
                          }}
                        />
                        <Bar dataKey="total" fill="var(--primary)" radius={[10, 10, 10, 10]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-3 text-xs text-muted">Перейти в отчет</div>
              </CardContent>
            </Card>

            <Card className="col-span-12 xl:col-span-6">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">Популярные</div>
                    <div className="mt-2 flex items-end gap-3">
                      <div className="text-2xl font-semibold">
                        {salesByProduct.data?.totalSold ?? <Skeleton className="h-7 w-28" />}
                      </div>
                      <div className="text-xs text-muted">Всего продаж</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Segmented
                      value={popularTab}
                      onChange={setPopularTab}
                      layoutId="popular-pill"
                      options={[
                        { value: "Товары", label: "Товары" },
                        { value: "Категории", label: "Категории" },
                      ]}
                      className="bg-card"
                    />
                    <div className="text-right text-xs text-muted">
                      Категорий: {salesByProduct.data?.differentProductCategoriesCount ?? "—"}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {salesByProduct.isLoading ? (
                  <Skeleton className="h-[220px] w-full rounded-2xl" />
                ) : popularTab === "Категории" ? (
                  <div className="grid h-[220px] place-items-center text-sm text-muted">
                    Демо-вкладка: Категории
                  </div>
                ) : (
                  <div className="h-[220px]">
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
                            return [`${val} (${pct ?? "—"}%)`, "Продажи"];
                          }}
                        />
                        <Bar dataKey="total" fill="rgba(216,11,58,0.35)" radius={[10, 10, 10, 10]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-3 text-xs text-muted">Перейти в отчет</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-lg font-semibold">Время пиковых продаж</div>
            <Segmented
              value={peakView}
              onChange={setPeakView}
              layoutId="peak-pill"
              options={[
                { value: "line", label: "Линейный график" },
                { value: "heat", label: "Тепловая карта" },
              ]}
            />
          </div>

          <Card>
            <CardContent className="pt-5">
              {peakTimes.isLoading ? (
                <Skeleton className="h-[260px] w-full rounded-2xl" />
              ) : peakView === "line" ? (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={peakChart}>
                      <CartesianGrid vertical stroke="rgba(0,0,0,0.06)" horizontal={false} />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
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
                          return [label ?? fmtMinutesToHHMM(val), "Пик"];
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
                <div className="grid grid-cols-[repeat(31,minmax(0,1fr))] gap-1">
                  {(peakTimes.data ?? []).map((x) => {
                    const minutes = parseTimeSpanToMinutes(x.peakSalesTime);
                    const hour = Math.floor(minutes / 60);
                    const alpha = 0.15 + (hour / 23) * 0.55;
                    return (
                      <div
                        key={x.day}
                        title={`День ${x.day}: ${x.peakSalesTime}`}
                        className="h-10 rounded-md"
                        style={{
                          background: `rgba(216, 11, 58, ${alpha})`,
                          border: "1px solid rgba(17, 24, 39, 0.06)",
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </motion.div>
    </DashboardShell>
  );
}
