"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { I18nProvider } from "@/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <I18nProvider>{children}</I18nProvider>
    </Provider>
  );
}

