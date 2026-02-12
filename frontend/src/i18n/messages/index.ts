import { ru } from "./ru";
import type { Locale } from "../types";

export type Messages = typeof ru;

export const messagesByLocale: Record<Locale, Messages> = {
  ru,
};
