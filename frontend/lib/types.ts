/** Paginated list from backend (matches PaginatedList<T>) */
export interface PaginatedList<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** Auth */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  created: string;
  expiration: string;
  tokenType: string;
  expiresInSeconds: number;
  requiresMfa?: boolean;
  userId?: string;
}

/** Lookups */
export interface LookupDto {
  id: string;
  title: string;
}

export interface ModuleLookupDto {
  id: string;
  name: string;
  parentId: string | null;
}

/** Geography Resolution (Zip Geo Mappings) */
export interface ZipGeoMappingDto {
  id: string;
  mappingName: string;
  fsCategory: string;
  state: string;
  zip: string;
  mappingType: string;
  source: string;
  geoCode: string;
  geoName: string;
  year: number;
  active: boolean;
}

/** Applicability Rules */
export interface ApplicabilityRuleDto {
  id: string;
  sortOrder: number;
  ruleSetName: string;
  displayName: string;
  payerEntityType: string;
  planCategory: string;
  claimCategory: string;
  providerParticipation: string;
  payerCategory: string;
  feeScheduleApplied: string;
  merCalculationScope: string;
  isActive: boolean;
}

/** ICD Codes */
export interface IcdCodeDto {
  id: string;
  code: string;
  description: string;
  version: string;
  effectiveStartDate: string | null;
  effectiveEndDate: string | null;
  isBillable: boolean;
  isActive: boolean;
}

/** Organization */
export interface OrganizationDto {
  id: string;
  name: string;
  isActive: boolean;
}
