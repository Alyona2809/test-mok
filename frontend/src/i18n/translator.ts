import type { Messages } from "./messages";

type Vars = Record<string, string | number | undefined | null>;

function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split(".").filter(Boolean);
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    const rec = cur as Record<string, unknown>;
    cur = rec[p];
  }
  return cur;
}

function interpolate(template: string, vars?: Vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_m, name: string) => {
    const v = vars[name];
    return v == null ? "" : String(v);
  });
}

export function createTranslator(messages: Messages) {
  return function t(key: string, vars?: Vars): string {
    const raw = getByPath(messages, key);
    if (typeof raw !== "string") return key;
    return interpolate(raw, vars);
  };
}

