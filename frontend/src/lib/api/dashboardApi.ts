import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PeakSaleTimeAtDay,
  ProductsTotalSalesOverview,
  SalesIndexItem,
  VendingMachineMoneyStatus,
  VendingMachinesItemFillOverview,
  VendingMachinesOverview,
  VendingMachinesTotalSalesOverview,
} from "./types";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/bff",
  }),
  endpoints: (build) => ({
    machinesOverview: build.query<VendingMachinesOverview, void>({
      query: () => "/machines/overview",
    }),
    salesIndexByHistoricAvg: build.query<SalesIndexItem[], void>({
      query: () => "/sales/index-by-historic-avg",
    }),
    machinesProductFill: build.query<VendingMachinesItemFillOverview, void>({
      query: () => "/machines/product-fill",
    }),
    machinesMoneyFill: build.query<VendingMachineMoneyStatus[], void>({
      query: () => "/machines/money-fill",
    }),
    salesByVendingMachine: build.query<VendingMachinesTotalSalesOverview, void>({
      query: () => "/sales/by-vending-machine",
    }),
    salesByProductType: build.query<ProductsTotalSalesOverview, void>({
      query: () => "/sales/by-product-type",
    }),
    peakSaleCountPerDay: build.query<PeakSaleTimeAtDay[], void>({
      query: () => "/sales/peak-sale-count-per-day",
    }),
  }),
});

export const {
  useMachinesOverviewQuery,
  useSalesIndexByHistoricAvgQuery,
  useMachinesProductFillQuery,
  useMachinesMoneyFillQuery,
  useSalesByVendingMachineQuery,
  useSalesByProductTypeQuery,
  usePeakSaleCountPerDayQuery,
} = dashboardApi;

