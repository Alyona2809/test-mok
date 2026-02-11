export const en = {
  meta: {
    title: "Administration and monitoring",
    description: "Vending machines and sales dashboard",
  },
  common: {
    open: "Open",
    section: "Section",
    demoTab: "Demo tab: {tab}",
    goToReport: "Go to report",
    changeMetric: "Change metric",
  },
  aria: {
    segmented: "Segmented control",
  },
  dashboard: {
    period: {
      today: "Today",
      yesterday: "Yesterday",
      week: "Week",
      month: "Month",
      quarter: "Quarter",
    },
    stats: {
      totalMachines: "Total machines",
      working: "Working",
      lowSupply: "Low stock",
      needsRepair: "Needs service",
    },
    map: {
      tabs: {
        status: "Machine status",
        avgRevenue: "Average revenue",
        downtime: "Downtime",
        fillLevel: "Fill level",
      },
    },
    sections: {
      machinesHealth: "Machine health overview",
      salesAnalytics: "Sales and customer behavior analytics",
      peakSalesTime: "Peak sales time",
    },
    cards: {
      salesIndexTitle: "Sales index vs historical average activity",
      productFillTitle: "Product fill",
      productFillSubtitle: "Machines that need restocking",
      moneyFillTitle: "Cash status",
      moneyFillSubtitle: "Refill signals",
      sortFirstFull: "Fullest machines first",
      salesByVmTitle: "Machines by sales volume",
      totalSales: "Total sales",
      top5: "Top-5: {count}",
      popularTitle: "Popular",
      categoriesCount: "Categories: {count}",
    },
    tabs: {
      products: "Products",
      categories: "Categories",
    },
    peakView: {
      line: "Line chart",
      heat: "Heat map",
    },
    tooltip: {
      vm: "VM",
      sales: "Sales",
      peak: "Peak",
      fill: "fill",
    },
  },
  money: {
    coins: "Coins",
    banknotes: "Banknotes",
  },
  topbar: {
    searchPlaceholder: "Search",
    searchAria: "Search",
    refreshed: "Updated",
    notifications: "Notifications",
    language: "Language",
    admin: "Admin",
    city: "Saint Petersburg",
  },
  sidebar: {
    regionDistrict: "Saint Petersburg / Admiralteysky",
    location: "Semyonovskaya",
    adminMonitoring: "Administration and monitoring",
    nav: {
      monitoring: "Machine fleet monitoring",
      remoteControl: "Remote machine control",
      registration: "Machine registration",
      decommission: "Decommission machines",
      reports: "Reports",
      requests: "Requests",
    },
  },
  map: {
    vendingMachineTitle: "VM {type}-{id}",
    salesIndex: "Sales index: {value}%",
    moneyFill: "Cash fill: {value}%",
    dayTitle: "Day {day}: {time}",
  },
} as const;
