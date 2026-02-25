import { apiRequest } from "@/lib/api";
import type { PaginatedList } from "@/lib/types";

export interface FeeScheduleDto {
  id: string;
  scheduleCode?: string | null;
  category: number;
  state?: string | null;
  status: number;
  year: number;
  quarter: number;
}

export interface FeeScheduleDetailDto {
  id: string;
  scheduleCode?: string | null;
  category: number;
  state?: string | null;
  geoType: number;
  geoCode?: string | null;
  geoName?: string | null;
  billingType: number;
  year: number;
  quarter: number;
  calculationModel: number;
  adoptFeeScheduleId?: string | null;
  multiplierPct: number;
  fallbackCategory?: number | null;
  status: number;
}

export interface CreateFeeScheduleCommand {
  scheduleCode?: string | null;
  category: number;
  state?: string | null;
  geoType: number;
  geoCode?: string | null;
  geoName?: string | null;
  billingType: number;
  year: number;
  quarter: number;
  calculationModel: number;
  adoptFeeScheduleId?: string | null;
  multiplierPct: number;
  fallbackCategory?: number | null;
  status?: number;
}

export function feeSchedulesApi() {
  return {
    getLookups: () =>
      apiRequest<{
        categories: { value: number; name: string }[];
        states: string[];
        geoTypes: { value: number; name: string }[];
        billingTypes: { value: number; name: string }[];
        years: number[];
        calculationModels: { value: number; name: string }[];
      }>("/api/FeeSchedules/lookups"),
    getList: (params?: {
      category?: number;
      state?: string;
      status?: number;
      year?: number;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      const q = new URLSearchParams();
      if (params?.category != null) q.set("category", String(params.category));
      if (params?.state) q.set("state", params.state);
      if (params?.status != null) q.set("status", String(params.status));
      if (params?.year != null) q.set("year", String(params.year));
      if (params?.pageNumber != null) q.set("pageNumber", String(params.pageNumber));
      if (params?.pageSize != null) q.set("pageSize", String(params.pageSize));
      return apiRequest<PaginatedList<FeeScheduleDto>>(`/api/FeeSchedules?${q}`);
    },
    getById: (id: string) =>
      apiRequest<FeeScheduleDetailDto>(`/api/FeeSchedules/${id}`),
    create: (body: CreateFeeScheduleCommand) =>
      apiRequest<string>("/api/FeeSchedules", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: CreateFeeScheduleCommand) =>
      apiRequest<void>(`/api/FeeSchedules/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      apiRequest<void>(`/api/FeeSchedules/${id}`, { method: "DELETE" }),
  };
}
