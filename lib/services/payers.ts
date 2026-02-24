import { apiRequest } from "@/lib/api";
import type { PaginatedList } from "@/lib/types";

export interface PayerListItemDto {
  id: string;
  payerName: string;
  aliases?: string | null;
  entityType: number;
  status: number;
  organizationId: string;
  organizationName?: string | null;
}

export interface PayerDetailDto {
  id: string;
  payerName: string;
  aliases?: string | null;
  entityType: number;
  status: number;
  organizationId: string;
}

export interface CreatePayerRequest {
  payerName: string;
  aliases?: string | null;
  entityType: number;
  status?: number;
}

export interface UpdatePayerRequest {
  payerName: string;
  aliases?: string | null;
  entityType: number;
  status: number;
}

export function payersApi() {
  return {
    getList: (params?: {
      status?: number;
      search?: string;
      organizationId?: string;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      const q = new URLSearchParams();
      if (params?.status != null) q.set("status", String(params.status));
      if (params?.search) q.set("search", params.search ?? "");
      if (params?.organizationId) q.set("OrganizationId", params.organizationId);
      if (params?.pageNumber != null) q.set("pageNumber", String(params.pageNumber));
      if (params?.pageSize != null) q.set("pageSize", String(params.pageSize));
      return apiRequest<PaginatedList<PayerListItemDto>>(`/api/Payers?${q}`);
    },
    getById: (id: string) =>
      apiRequest<PayerDetailDto>(`/api/Payers/${id}`),
    create: (body: CreatePayerRequest) =>
      apiRequest<string>("/api/Payers", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: UpdatePayerRequest) =>
      apiRequest<void>(`/api/Payers/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      apiRequest<void>(`/api/Payers/${id}`, { method: "DELETE" }),
  };
}
