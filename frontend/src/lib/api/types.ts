export type VendingMachinesOverview = {
  total: number;
  working: number;
  lowSupply: number;
  needsRepair: number;
};

export type SalesIndexItem = {
  machineId: number;
  machineType: string;
  percentage: number;
};

export type VendingMachineItemFill = {
  itemCount: number;
  fillPercentage: number;
};

export type VendingMachinesItemFillOverview = {
  total: number;
  topFilled: VendingMachineItemFill[];
};

export type VendingMachineMoneyStatus = {
  machineId: number;
  machineType: string;
  coinFillPercentage: number;
  banknotesFillPercentage: number;
};

export type VendingMachineTotalSales = {
  totalSales: number;
  percentageOfAllSales: number;
};

export type VendingMachinesTotalSalesOverview = {
  totalSales: number;
  soldInTopFive: number;
  topVendingMachines: VendingMachineTotalSales[];
};

export type ProductTotalSales = {
  productId: number;
  soldTotal: number;
  percentageOfAllSales: number;
};

export type ProductsTotalSalesOverview = {
  totalSold: number;
  soldInTopFive: number;
  differentProductCategoriesCount: number;
  topProducts: ProductTotalSales[];
};

export type PeakSaleTimeAtDay = {
  day: number;
  /**
   * .NET TimeSpan is usually serialized as "hh:mm:ss" (e.g. "14:05:00")
   */
  peakSalesTime: string;
};

