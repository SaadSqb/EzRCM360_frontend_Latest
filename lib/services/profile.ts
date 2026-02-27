import { apiRequest, apiRequestForm } from "@/lib/api";

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
  profilePictureUrl?: string | null;
}

export interface UpdateMyProfileRequest {
  userName?: string | null;
  email?: string | null;
  profilePictureUrl?: string | null;
  newPassword?: string | null;
}

export function profileApi() {
  return {
    getMe: () => apiRequest<UserProfileDto>("/api/profile/me"),
    updateMe: (body: UpdateMyProfileRequest) =>
      apiRequest<void>("/api/profile/me", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    uploadProfilePicture: (file: File) => {
      const form = new FormData();
      form.append("Picture", file);
      return apiRequestForm("/api/profile/upload-picture", form, "POST");
    },
  };
}
