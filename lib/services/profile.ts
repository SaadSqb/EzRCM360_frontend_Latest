import { apiRequest } from "@/lib/api";

export interface UserProfileDto {
  userId: string;
  userName: string;
  email: string;
  organizationId?: string | null;
  organizationName?: string | null;
  role?: string | null;
  roleId?: string | null;
  userStatus: string;
  isMfaEnabled: boolean;
  mfaEnrolledAt?: string | null;
  lastMfaVerifiedAt?: string | null;
}

export function profileApi() {
  return {
    getMe: () => apiRequest<UserProfileDto>("/api/profile/me"),
  };
}
