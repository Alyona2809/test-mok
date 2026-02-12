"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Locale } from "./types";
import { messagesByLocale } from "./messages";
import { createTranslator } from "./translator";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (
    key: string,
    vars?: Record<string, string | number | undefined | null>,
  ) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "ru";
  const stored = window.localStorage.getItem("locale");
  if (stored === "ru") return stored;
  const nav = window.navigator.language?.toLowerCase() ?? "";
  return nav.startsWith("ru") ? "ru" : "ru";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem("locale", l);
    } catch {
      // ignore
    }
  };

  const t = useMemo(() => createTranslator(messagesByLocale[locale]), [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider />");
  return ctx;
}
