"use client";

import Image from "next/image";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import styles from "./GoToReportButton.module.css";

export function GoToReportButton({
  className,
  onClick,
  label,
}: {
  className?: string;
  onClick?: () => void;
  label?: string;
}) {
  const { t } = useI18n();

  return (
    <button type="button" className={cn(styles.button, className)} onClick={onClick}>
      <span className={styles.text}>{label ?? t("common.goToReport")}</span>
      <span className={styles.iconBox} aria-hidden>
        <Image src="/arrow-narrow-right.svg" alt="" width={16} height={16} />
      </span>
    </button>
  );
}

