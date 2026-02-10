"use client";

import { Bell, RefreshCw, Search } from "lucide-react";
import { useI18n } from "@/i18n";
import styles from "./Topbar.module.css";

export function Topbar() {
  const { t } = useI18n();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.searchWrap}>
          <Search className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder={t("topbar.searchPlaceholder")}
            aria-label={t("topbar.searchAria")}
          />
          <span className={styles.pillCount}>5</span>
        </div>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.refreshBtn}>
          <RefreshCw className={styles.refreshIcon} />
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
          <Bell className={styles.notifIcon} />
          <span className={styles.notifDot} />
        </button>

        <div className={styles.user}>
          <div className={styles.avatar} />
          <div className={styles.userMeta}>
            <div className={styles.userName}>{t("topbar.admin")}</div>
            <div className={styles.userCity}>{t("topbar.city")}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
