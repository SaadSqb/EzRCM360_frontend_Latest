# Settings & Configuration: Backend vs Frontend Audit

This document summarizes how frontend settings modules align with backend entities/DTOs and what was fixed or remains as a gap.

## Summary of fixes applied (this pass)

| Module | Change |
|--------|--------|
| **Entity Locations** | Table: added **Physical address**, **POS code** columns (form already had all fields). |
| **Entity Providers** | List DTO: added `secondarySpecialty`. Table: added **Primary specialty**, **Secondary specialty** columns. Form already had all fields. |
| **Entities** | Table: added **Organization** column (`organizationName`). Form already had all fields. |
| **Payers** | Table: added **Aliases**. Form: full **Addresses**, **Phone numbers**, **Emails**, **Linked plans** (load detail on edit, submit full payload). |
| **Plans** | Form: added **Aliases**, **Plan responsibility %**, **Patient responsibility %**, **Typical deductible**, **OOP max**, **Timely filing resubmission (days)** (state already had them; inputs were missing). |
| **Facilities** | List DTO: added `posCode`. Table: added **Physical address**, **POS code** columns. Form already had all fields. |
| **Entities / Payers / etc.** | Replaced plain "Loading…" with `<Loader variant="inline" />` where applicable. |

---

## Per-module coverage

### Entity Locations
- **Backend list:** Id, EntityId, EntityDisplayName, LocationName, LocationType, PhysicalAddress, PosCode, IsActive.
- **Frontend:** All list columns and form fields covered ✓ (after adding Physical address & POS code to table).

### Entity Providers
- **Backend list:** Id, EntityId, EntityDisplayName, ProviderName, Npi, ProviderType, PrimarySpecialty, SecondarySpecialty, IsActive. (Detail: + Ssn.)
- **Frontend:** All list columns and form fields covered ✓ (after adding Primary/Secondary specialty to table and list DTO).

### Entities
- **Backend list:** Id, LegalName, DisplayName, GroupNpi, TaxId, Status, OrganizationId, OrganizationName.
- **Frontend:** All list columns and form fields covered ✓ (after adding Organization column).

### Payers
- **Backend list:** Id, PayerName, Aliases, EntityType, Status, OrganizationId, OrganizationName.
- **Backend detail:** + Addresses (PayerAddressDto[]), PhoneNumbers (PayerPhoneDto[]), Emails (PayerEmailDto[]), PlanIds.
- **Backend create/update:** PayerName, Aliases, EntityType, Status, Addresses?, PhoneNumbers?, Emails?, PlanIds?.
- **Frontend:** Full implementation ✓. List table shows name, aliases, entity type, status. Create/Edit form includes: basic info; repeatable **Addresses** (line1, line2, city, state, zip, label); repeatable **Phone numbers** (number, label); repeatable **Emails** (address, label); **Linked plans** (multi-select). On edit, payer detail is loaded via GET by id. Submit sends full payload; empty contact rows are omitted.
### Plans
- **Backend list/detail/create/update:** PlanName, Aliases, PlanIdPrefix, PlanCategory, PlanType, MarketType, OonBenefits, PlanResponsibilityPct, PatientResponsibilityPct, TypicalDeductible, OopMax, NsaEligible, NsaCategory, ProviderParticipationApplicable, TimelyFilingInitialDays, TimelyFilingResubmissionDays, TimelyFilingAppealDays, Status, PayerId (detail/create/update).
- **Frontend:** All list columns and form fields covered ✓ (after adding the missing form inputs).

### Facilities
- **Backend list:** Id, Name, FacilityType, PhysicalAddress, EntityId, EntityDisplayName, PosCode, IsActive.
- **Frontend:** All list columns and form fields covered ✓ (after adding Physical address, POS code to table and posCode to list DTO).

### Users, Roles, Organization, Modifiers, Financial Modifiers, CPT/NDC/ICD, Bundling, Applicability, Procedure Grouping, Plan Participations, Fee Schedules, Zip/Geo
- Not fully re-audited in this pass. List/table and create/update forms were assumed aligned from existing implementation. If you need the same level of column/field audit for these, it can be done in a follow-up.

---

## Recommended next steps

1. **Other modules:** Run the same “backend list/detail/create/update DTO vs frontend table + form” check for Users, Roles, Organization, and the code/modifier/rule/participation/fee schedule/zip-geo modules if you want full parity.
