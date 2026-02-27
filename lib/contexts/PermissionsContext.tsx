"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { AUTH_TOKEN_KEY } from "@/lib/env";
import { permissionsApi } from "@/lib/services/permissions";
import type { PermissionDto } from "@/lib/services/permissions";

interface PermissionsContextValue {
  permissions: PermissionDto[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  /** Permission for a module by name (exact match as returned from API). */
  getPermission: (moduleName: string) => PermissionDto | undefined;
  canView: (moduleName: string) => boolean;
  canCreate: (moduleName: string) => boolean;
  canUpdate: (moduleName: string) => boolean;
  canDelete: (moduleName: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (!token) {
      setPermissions([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    permissionsApi()
      .getMyPermissions()
      .then(setPermissions)
      .catch((err) => {
        setPermissions([]);
        setError(err instanceof Error ? err.message : "Failed to load permissions");
      })
      .finally(() => setLoading(false));
  }, []);

  const pathname = usePathname();
  useEffect(() => {
    load();
  }, [load, pathname]);

  const byModuleName = useMemo(() => {
    const map = new Map<string, PermissionDto>();
    permissions.forEach((p) => map.set(p.moduleName, p));
    return map;
  }, [permissions]);

  const getPermission = useCallback(
    (moduleName: string) => byModuleName.get(moduleName),
    [byModuleName]
  );
  const canView = useCallback(
    (moduleName: string) => byModuleName.get(moduleName)?.canView ?? false,
    [byModuleName]
  );
  const canCreate = useCallback(
    (moduleName: string) => byModuleName.get(moduleName)?.canCreate ?? false,
    [byModuleName]
  );
  const canUpdate = useCallback(
    (moduleName: string) => byModuleName.get(moduleName)?.canUpdate ?? false,
    [byModuleName]
  );
  const canDelete = useCallback(
    (moduleName: string) => byModuleName.get(moduleName)?.canDelete ?? false,
    [byModuleName]
  );

  const value: PermissionsContextValue = {
    permissions,
    loading,
    error,
    reload: load,
    getPermission,
    canView,
    canCreate,
    canUpdate,
    canDelete,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions(): PermissionsContextValue {
  const ctx = useContext(PermissionsContext);
  if (!ctx)
    throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
}

/** Optional permission check; returns undefined if PermissionsProvider is not mounted (e.g. login page). */
export function usePermissionsOptional(): PermissionsContextValue | null {
  return useContext(PermissionsContext);
}

/**
 * Fail-secure: when loading or no provider, denies all permissions.
 * Enterprise pattern: either user has access or they don't.
 */
export function useModulePermission(moduleName: string): {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  loading: boolean;
} {
  const ctx = usePermissionsOptional();
  if (!ctx) return { canView: false, canCreate: false, canUpdate: false, canDelete: false, loading: false };
  if (ctx.loading) return { canView: false, canCreate: false, canUpdate: false, canDelete: false, loading: true };
  return {
    canView: ctx.canView(moduleName),
    canCreate: ctx.canCreate(moduleName),
    canUpdate: ctx.canUpdate(moduleName),
    canDelete: ctx.canDelete(moduleName),
    loading: false,
  };
}
