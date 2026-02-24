"use client";

import { useMemo } from "react";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { usePermissionsOptional } from "@/lib/contexts/PermissionsContext";
import { SETTINGS_HREF_TO_MODULE_NAME } from "@/lib/constants/routeModuleMap";

const configSections = [
  {
    title: "Organization & Access",
    description:
      "Define enterprise-level governance, identity, access control, and security enforcement.",
    links: [
      { label: "Organization", href: "/settings/organization" },
      { label: "Users Access", href: "/settings/users" },
      { label: "Roles & Permissions", href: "/settings/roles-permissions" },
      { label: "Security Access", href: "/settings/security-access" },
    ],
  },
  {
    title: "Entity Configurations",
    description:
      "Define Entity identity and structure for access control and downstream operational configuration.",
    links: [
      { label: "Entity Information", href: "/settings/entities" },
      { label: "Entity Providers", href: "/settings/entity-providers" },
      { label: "Entity Locations", href: "/settings/entity-locations" },
      { label: "Entity Billable Fee Schedules", href: "/settings/entity-fee-schedules" },
    ],
  },
  {
    title: "Payers & Plans Configurations",
    description: "Centralized payer and plan registry used across all modules.",
    links: [
      { label: "Payer Configuration", href: "/settings/payers" },
      { label: "Plan Configuration", href: "/settings/plans" },
    ],
  },
  {
    title: "Group Provider-Plan Participation",
    description:
      "Authoritative record of network participation status used by all modules.",
    links: [
      { label: "Provider-Plan Participation", href: "/settings/group-participation" },
    ],
  },
  {
    title: "Rendering Provider-Plan Participation",
    description:
      "Authoritative record of network participation status used by all modules.",
    links: [
      { label: "Provider-Plan Participation", href: "/settings/rendering-participation" },
    ],
  },
  {
    title: "Facilities Configurations",
    description: "Define independent service locations separate from Entity practices.",
    links: [
      { label: "Facility Configuration", href: "/settings/facilities" },
    ],
  },
  {
    title: "Fee Schedules Configurations",
    description:
      "Centralized valuation datasets for reimbursement calculation and analysis.",
    links: [
      { label: "Fee Schedules", href: "/settings/fee-schedules" },
      { label: "Geography Resolution", href: "/settings/geography-resolution" },
      { label: "Applicability Rules", href: "/settings/applicability-rules" },
    ],
  },
  {
    title: "Codes & Modifiers Configurations",
    description: "Standardized coding and financial adjustment logic.",
    links: [
      { label: "ICD Codes", href: "/settings/icd-codes" },
      { label: "NDC Codes", href: "/settings/ndc-codes" },
      { label: "CPT / HCPCS Codes", href: "/settings/cpt-hcpcs-codes" },
      { label: "Modifiers", href: "/settings/modifiers" },
      { label: "Financial Modifiers", href: "/settings/financial-modifiers" },
      { label: "Bundling / Reduction Rules", href: "/settings/bundling-reduction-rules" },
      { label: "Procedure Grouping Rules", href: "/settings/procedure-grouping-rules" },
    ],
  },
  {
    title: "NSA Configuration",
    description: "Centralized NSA eligibility and valuation governance.",
    links: [
      { label: "NSA Eligibility Rules", href: "/settings/nsa-eligibility" },
      { label: "Federal NSA Rules", href: "/settings/nsa-federal" },
      { label: "State NSA Rules", href: "/settings/nsa-state" },
      { label: "Emergency Override Rules", href: "/settings/nsa-emergency" },
    ],
  },
];

export default function SettingsPage() {
  const permissions = usePermissionsOptional();
  const filteredSections = useMemo(() => {
    // Show full sections when no provider, still loading, or no permissions (e.g. API failed) so the page is never blank
    if (!permissions || permissions.loading || permissions.permissions.length === 0)
      return configSections;
    return configSections
      .map((section) => ({
        ...section,
        links: section.links.filter((link) => {
          const moduleName = SETTINGS_HREF_TO_MODULE_NAME[link.href];
          if (!moduleName) return true;
          return permissions.canView(moduleName);
        }),
      }))
      .filter((section) => section.links.length > 0);
  }, [permissions]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Settings & Configurations
      </h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSections.map((section) => (
          <SettingsCard
            key={section.title}
            title={section.title}
            description={section.description}
            links={section.links}
          />
        ))}
      </div>
    </div>
  );
}
