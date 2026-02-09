"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  Monitor,
  Settings,
  SquareStack,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/cn";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  active?: boolean;
};

const nav: NavItem[] = [
  { label: "Мониторинг парка ТА", icon: Monitor, href: "/", active: true },
  { label: "Удаленное управление ТА", icon: Settings, href: "/" },
  { label: "Регистрация ТА", icon: KeyRound, href: "/" },
  { label: "Вывод ТА из эксплуатации", icon: Wrench, href: "/" },
  { label: "Отчеты", icon: BarChart3, href: "/" },
  { label: "Заявки", icon: ClipboardList, href: "/" },
];

const rail: Array<Pick<NavItem, "icon" | "href" | "active">> = [
  { icon: LayoutDashboard, href: "/", active: true },
  { icon: Monitor, href: "/" },
  { icon: SquareStack, href: "/" },
  { icon: BarChart3, href: "/" },
  { icon: Settings, href: "/" },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen shrink-0 border-r border-border bg-card">
      {/* Icon rail */}
      <div className="flex w-[64px] flex-col items-center border-r border-border bg-card py-4">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-sm font-extrabold text-white">
          U
        </div>

        <div className="mt-6 flex w-full flex-1 flex-col items-center gap-2 px-2">
          {rail.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-2xl border border-transparent transition-colors",
                    item.active
                      ? "bg-black/[0.04] text-foreground"
                      : "text-muted hover:bg-black/[0.03] hover:text-foreground",
                  )}
                  aria-label="Раздел"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="px-2">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-background text-muted">
            <Settings className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Menu panel */}
      <div className="flex w-[280px] flex-col bg-card">
        <div className="px-5 py-4">
          <div className="min-w-0">
            <div className="text-xs text-muted">
              Санкт‑Петербург / Адмиралтейский
            </div>
            <div className="mt-1 text-sm font-semibold leading-5">
              Семёновская{" "}
              <span className="ml-1 rounded-md bg-black/[0.04] px-1.5 py-0.5 text-xs text-muted">
                58
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 pb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Администрирование и мониторинг
        </div>

        <nav className="px-3 pb-4">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group mb-1 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors",
                    item.active
                      ? "bg-black/[0.04] text-foreground"
                      : "text-muted hover:bg-black/[0.03] hover:text-foreground",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] opacity-90" />
                  <span className="leading-5">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="mt-auto px-5 pb-5 text-xs text-muted"></div>
      </div>
    </aside>
  );
}
