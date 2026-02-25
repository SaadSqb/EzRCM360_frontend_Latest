import { apiRequest } from "@/lib/api";

export interface PermissionDto {
  moduleId: string;
  moduleName: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  visibilityLevel: string;
}

export interface PermissionItemRequest {
  moduleId: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  visibilityLevel: string;
}

export function permissionsApi() {
  return {
    /** Get permissions for the current user's role. Returns [] if unauthenticated or no role. */
    getMyPermissions: () => apiRequest<PermissionDto[]>("/api/Permissions/me"),
    getByRoleId: (roleId: string) =>
      apiRequest<PermissionDto[]>(`/api/Permissions/role/${roleId}`),
    updateByRoleId: (roleId: string, body: { permissions: PermissionItemRequest[] }) =>
      apiRequest<void>(`/api/Permissions/role/${roleId}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  };
}
