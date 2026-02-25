import { apiRequest } from "@/lib/api";

export interface SecuritySettingsDto {
  mfaRequiredForAllUsers: boolean;
  mfaFrequency: string;
  inactivityTimeoutMinutes: number;
  dailySessionResetEnabled: boolean;
}

export interface UpdateSecuritySettingsRequest {
  mfaRequiredForAllUsers: boolean;
  mfaFrequency?: string;
  inactivityTimeoutMinutes?: number;
  dailySessionResetEnabled?: boolean;
}

export interface SecurityUserDto {
  id: string;
  userName: string;
  email: string;
  roleName: string | null;
  isTwoFactorEnabled: boolean;
}

export function securityAccessApi() {
  return {
    getSettings: () =>
      apiRequest<SecuritySettingsDto>("/api/SecurityAccess/settings"),

    updateSettings: (body: UpdateSecuritySettingsRequest) =>
      apiRequest<void>("/api/SecurityAccess/settings", {
        method: "PUT",
        body: JSON.stringify(body),
      }),

    getUsers: (search?: string) => {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      return apiRequest<SecurityUserDto[]>(`/api/SecurityAccess/users${q.toString() ? `?${q}` : ""}`);
    },

    disableUserMfa: (userId: string) =>
      apiRequest<void>(`/api/SecurityAccess/users/${userId}/disable-mfa`, {
        method: "POST",
      }),
  };
}
