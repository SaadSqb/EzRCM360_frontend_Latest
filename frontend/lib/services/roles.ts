import { apiRequest } from "@/lib/api";
import type { PaginatedList } from "@/lib/types";

export interface RoleDto {
  id: string;
  name: string;
  description?: string | null;
}

export interface RoleDetailDto extends RoleDto {
  permissions?: { moduleId: string; moduleName: string; canView: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean; visibilityLevel: string }[];
}

export interface CreateRoleRequest {
  name: string;
  description?: string | null;
  organizationId?: string | null;
}

export interface UpdateRoleRequest {
  name: string;
  description?: string | null;
}

export function rolesApi() {
  return {
    getList: (params?: {
      organizationId?: string;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      const q = new URLSearchParams();
      if (params?.organizationId) q.set("OrganizationId", params.organizationId);
      if (params?.pageNumber != null) q.set("pageNumber", String(params.pageNumber));
      if (params?.pageSize != null) q.set("pageSize", String(params.pageSize));
      return apiRequest<PaginatedList<RoleDto>>(`/api/Roles?${q}`);
    },
    getById: (id: string) =>
      apiRequest<RoleDetailDto>(`/api/Roles/${id}`),
    create: (body: CreateRoleRequest) =>
      apiRequest<string>("/api/Roles", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: UpdateRoleRequest) =>
      apiRequest<void>(`/api/Roles/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      apiRequest<void>(`/api/Roles/${id}`, { method: "DELETE" }),
  };
}
