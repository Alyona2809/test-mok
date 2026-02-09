"use client";

import { Bell, RefreshCw, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/80 px-6 py-4 backdrop-blur">
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden w-[420px] items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 md:flex">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
            placeholder="Найти"
            aria-label="Поиск"
          />
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-black/[0.06] px-1 text-[11px] font-semibold text-muted">
            5
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="hidden items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-sm text-muted hover:text-foreground md:flex"
        >
          <RefreshCw className="h-4 w-4 opacity-70" />
          <div className="text-left leading-4">
            <div className="text-[11px] text-muted">Обновлено</div>
            <div className="text-xs font-medium text-foreground">20.09.2024 12:35</div>
          </div>
        </button>

        <button
          type="button"
          className="relative grid h-10 w-10 place-items-center rounded-2xl border border-border bg-background hover:bg-black/[0.03]"
          aria-label="Уведомления"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5">
          <div className="h-8 w-8 rounded-xl bg-black/[0.06]" />
          <div className="hidden min-w-0 md:block">
            <div className="text-xs font-semibold leading-4">Админ</div>
            <div className="text-[11px] leading-4 text-muted">Санкт‑Петербург</div>
          </div>
        </div>
      </div>
    </header>
  );
}

