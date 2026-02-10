"use client";

import { Bell } from "lucide-react";
import { useI18n } from "@/i18n";
import styles from "./Topbar.module.css";
import Image from "next/image";

export function Topbar() {
  const { t } = useI18n();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.searchWrap}>
          <svg
            className={styles.searchIcon}
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M10.5303 10.5407L14 14M12 7C12 9.7614 9.7614 12 7 12C4.23857 12 2 9.7614 2 7C2 4.23857 4.23857 2 7 2C9.7614 2 12 4.23857 12 7Z"
              stroke="var(--text-light)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            className={styles.searchInput}
            placeholder={t("topbar.searchPlaceholder")}
            aria-label={t("topbar.searchAria")}
          />
        </div>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.refreshBtn}>
          <Image src="/Group.svg" alt="Refresh" width={32} height={32} />
          <div className={styles.refreshMeta}>
            <div className={styles.refreshLabel}>{t("topbar.refreshed")}</div>
            <div className={styles.refreshTime}>20.09.2024 12:35</div>
          </div>
        </button>

        <button
          type="button"
          className={styles.notifBtn}
          aria-label={t("topbar.notifications")}
        >
          <Image
            src="/bell-alt.svg"
            alt="Notifications"
            width={32}
            height={32}
          />
        </button>

        <div className={styles.user}>
          <Image src="/Avatar.svg" alt="Avatar" width={56} height={56} />
        </div>
      </div>
    </header>
  );
}
