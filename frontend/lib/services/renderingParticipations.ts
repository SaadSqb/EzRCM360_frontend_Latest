import { apiRequest } from "@/lib/api";
import type { PaginatedList } from "@/lib/types";

export interface RenderingProviderPlanParticipationListItemDto {
  id: string;
  entityProviderId: string;
  entityProviderDisplayName?: string | null;
  planId: string;
  planDisplayName?: string | null;
  participationStatus: number;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  source: number;
  isActive: boolean;
}

export interface RenderingProviderPlanParticipationDetailDto {
  id: string;
  entityProviderId: string;
  planId: string;
  participationStatus: number;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  source: number;
  isActive: boolean;
}

export interface CreateRenderingProviderPlanParticipationRequest {
  entityProviderId: string;
  planId: string;
  participationStatus: number;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  source: number;
  isActive?: boolean;
}

export interface UpdateRenderingProviderPlanParticipationRequest {
  entityProviderId: string;
  planId: string;
  participationStatus: number;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  source: number;
  isActive: boolean;
}

export function renderingParticipationsApi() {
  return {
    getList: (params?: {
      entityProviderId?: string;
      planId?: string;
      isActive?: boolean;
      search?: string;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      const q = new URLSearchParams();
      if (params?.entityProviderId) q.set("entityProviderId", params.entityProviderId);
      if (params?.planId) q.set("planId", params.planId);
      if (params?.isActive != null) q.set("isActive", String(params.isActive));
      if (params?.search) q.set("search", params.search);
      if (params?.pageNumber != null) q.set("pageNumber", String(params.pageNumber));
      if (params?.pageSize != null) q.set("pageSize", String(params.pageSize));
      return apiRequest<PaginatedList<RenderingProviderPlanParticipationListItemDto>>(
        `/api/RenderingProviderPlanParticipations?${q}`
      );
    },
    getById: (id: string) =>
      apiRequest<RenderingProviderPlanParticipationDetailDto>(`/api/RenderingProviderPlanParticipations/${id}`),
    create: (body: CreateRenderingProviderPlanParticipationRequest) =>
      apiRequest<string>("/api/RenderingProviderPlanParticipations", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: UpdateRenderingProviderPlanParticipationRequest) =>
      apiRequest<void>(`/api/RenderingProviderPlanParticipations/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      apiRequest<void>(`/api/RenderingProviderPlanParticipations/${id}`, { method: "DELETE" }),
  };
}
