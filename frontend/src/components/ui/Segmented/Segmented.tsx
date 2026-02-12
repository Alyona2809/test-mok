"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import styles from "./Segmented.module.css";

export type SegmentedOption<T extends string> = { value: T; label: string };

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  layoutId = "segmented-pill",
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: SegmentedOption<T>[];
  className?: string;
  layoutId?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      className={cn(
        styles.root,
        className,
      )}
      role="tablist"
      aria-label={ariaLabel ?? "Segmented control"}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              styles.button,
              selected ? styles.buttonSelected : styles.buttonUnselected,
            )}
            role="tab"
            aria-selected={selected}
          >
            {selected ? (
              <motion.span
                layoutId={layoutId}
                className={styles.pill}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            ) : null}
            <span className={styles.label}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

