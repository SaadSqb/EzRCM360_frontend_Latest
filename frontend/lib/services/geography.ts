import { apiRequest } from "@/lib/api";
import type { PaginatedList } from "@/lib/types";

export interface ZipGeoMappingDto {
  id: string;
  mappingName: string;
  fsCategory: number;
  state: string;
  zip: string;
  mappingType: number;
  source: number;
  geoCode: string | null;
  geoName: string | null;
  year: number;
  quarter: number | null;
  active: boolean;
}

export interface ZipGeoMappingLookupsDto {
  states: string[];
  years: number[];
  mappingTypes: { value: number; name: string }[];
  sources: { value: number; name: string }[];
  fsCategories: { value: number; name: string }[];
}

export interface CreateZipGeoMappingCommand {
  mappingName: string;
  fsCategory: number;
  state: string;
  zip: string;
  mappingType: number;
  source: number;
  geoCode?: string | null;
  geoName?: string | null;
  year: number;
  quarter?: number | null;
  active?: boolean;
}

export interface UpdateZipGeoMappingCommand extends CreateZipGeoMappingCommand {
  id: string;
}

export function geographyApi() {
  return {
    getList: (params: {
      fsCategory?: number;
      state?: string;
      zip?: string;
      year?: number;
      active?: boolean;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      const q = new URLSearchParams();
      if (params.fsCategory != null) q.set("fsCategory", String(params.fsCategory));
      if (params.state) q.set("state", params.state);
      if (params.zip) q.set("zip", params.zip);
      if (params.year != null) q.set("year", String(params.year));
      if (params.active != null) q.set("active", String(params.active));
      if (params.pageNumber != null) q.set("pageNumber", String(params.pageNumber));
      if (params.pageSize != null) q.set("pageSize", String(params.pageSize));
      return apiRequest<PaginatedList<ZipGeoMappingDto>>(`/api/ZipGeoMappings?${q}`);
    },
    getById: (id: string) =>
      apiRequest<ZipGeoMappingDto>(`/api/ZipGeoMappings/${id}`),
    getLookups: () =>
      apiRequest<ZipGeoMappingLookupsDto>("/api/ZipGeoMappings/lookups"),
    create: (body: CreateZipGeoMappingCommand) =>
      apiRequest<string>("/api/ZipGeoMappings", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: CreateZipGeoMappingCommand) =>
      apiRequest<void>(`/api/ZipGeoMappings/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      apiRequest<void>(`/api/ZipGeoMappings/${id}`, { method: "DELETE" }),
  };
}
