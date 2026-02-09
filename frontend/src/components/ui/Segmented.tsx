"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type SegmentedOption<T extends string> = { value: T; label: string };

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  layoutId = "segmented-pill",
}: {
  value: T;
  onChange: (v: T) => void;
  options: SegmentedOption<T>[];
  className?: string;
  layoutId?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm",
        className,
      )}
      role="tablist"
      aria-label="Переключатель вида"
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative px-3 py-1.5 text-xs font-medium transition-colors",
              selected ? "text-foreground" : "text-muted hover:text-foreground",
            )}
            role="tab"
            aria-selected={selected}
          >
            {selected ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-black/[0.04]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            ) : null}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

