"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n";
import styles from "./Sidebar.module.css";

type NavItem = {
  bottom: string;
  src: string;
  href: string;
  active?: boolean;
};

const railIcons = [
  { src: "/gauge-high.svg", href: "/" },
  { src: "/data-display.svg", href: "/" },
  { src: "/database-position.svg", href: "/" },
  { src: "/gift.svg", href: "/" },
  { src: "/square-a-lock.svg", href: "/" },
];

const underIconc = [
  { src: "/circle-question.svg", href: "/" },
  { src: "/chat-conversation.svg", href: "/" },
];

export function Sidebar() {
  const { t } = useI18n();

  const nav: NavItem[] = [
    {
      bottom: t("sidebar.nav.monitoring"),
      src: "/laptop-search.svg",
      href: "/",
    },
    {
      bottom: t("sidebar.nav.remoteControl"),
      src: "/Icon-nav-item.svg",
      href: "/",
    },
    {
      bottom: t("sidebar.nav.registration"),
      src: "/Icon-nav.svg",
      href: "/",
    },
    {
      bottom: t("sidebar.nav.decommission"),
      src: "/power-alt.svg",
      href: "/",
    },
  ];

  return (
    <aside className={styles.aside}>
      <div className={styles.rail}>
        <div className={styles.logoBanner}>
          <Image
            src="/logo.svg"
            alt="Logo"
            fill
            className={styles.logoBannerImage}
            sizes="64px"
          />
        </div>
        <div className={styles.railNav}>
          {railIcons.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.99 }}
            >
              <Link
                href={item.href}
                className={cn(styles.railLink, styles.railLinkInactive)}
                aria-label={t("common.section")}
              >
                <Image
                  src={item.src}
                  alt=""
                  width={20}
                  height={20}
                  className={styles.railIcon}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className={styles.railBottom}>
          {underIconc.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.99 }}
            >
              <Link
                href={item.href}
                className={cn(styles.railLink, styles.railLinkInactive)}
                aria-label={t("common.section")}
              >
                <Image
                  src={item.src}
                  alt=""
                  width={20}
                  height={20}
                  className={styles.railIcon}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.menu}>
        <div className={styles.menuHeader}>
          <div className={styles.menuHeaderInner}>
            <div className={styles.region}>{t("sidebar.regionDistrict")}</div>
            <div className={styles.Chevron}>
              <div className={styles.locationRow}>
                <span className={styles.locationName}>
                  {t("sidebar.location")}
                </span>
                <span className={styles.badge}>58</span>
              </div>
              <ChevronDown className={styles.locationChevron} aria-hidden />
            </div>
          </div>
        </div>

        <div className={styles.menuSectionTitle}>
          {t("sidebar.adminMonitoring")}
        </div>

        <nav className={styles.nav}>
          {nav.map((item) => {
            return (
              <motion.div
                key={item.bottom}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    styles.navLink,
                    item.active ? styles.navLinkActive : styles.navLinkInactive,
                  )}
                >
                  <Image
                    src={item.src}
                    alt=""
                    width={18}
                    height={18}
                    className={styles.navIcon}
                  />
                  <span className={styles.navBottom}>{item.bottom}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className={styles.menuFooter} />
      </div>
    </aside>
  );
}
