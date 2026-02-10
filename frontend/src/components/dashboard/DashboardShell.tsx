"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import styles from "./DashboardShell.module.css";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>
        <Topbar />
        <main className={styles.main}>
          <div className={styles.container}>{children}</div>
        </main>
      </div>
    </div>
  );
}
