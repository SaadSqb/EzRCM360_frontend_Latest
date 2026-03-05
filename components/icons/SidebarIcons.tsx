"use client";

import { FC } from "react";

interface IconProps {
  className?: string;
  color?: string;
}

const defaultColor = "#64748B";
const activeColor = "#2563EB";

export const DashboardIcon: FC<IconProps> = ({ className, color = defaultColor }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <mask id="mask0_dashboard" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
      <path d="M20 0H0V20H20V0Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_dashboard)">
      <path d="M7.51699 2.36664L3.02533 5.86664C2.27533 6.44997 1.66699 7.69164 1.66699 8.63334V14.8083C1.66699 16.7417 3.24199 18.325 5.17533 18.325H14.8253C16.7587 18.325 18.3337 16.7417 18.3337 14.8167V8.75001C18.3337 7.74164 17.6587 6.44997 16.8337 5.87497L11.6837 2.26664C10.517 1.44997 8.64199 1.49164 7.51699 2.36664Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.75 9.58301L10.25 13.083L8.91667 11.083L6.25 13.7497" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.084 9.58301H13.7507V11.2497" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

export const PatientsIcon: FC<IconProps> = ({ className, color = defaultColor }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <mask id="mask0_patients" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
      <path d="M20 0H0V20H20V0Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_patients)">
      <path d="M6.17513 16.3418L5.35013 16.5335C4.75846 16.6668 4.30013 17.1335 4.15846 17.7251L3.9668 18.5501C3.95013 18.6335 3.8168 18.6335 3.80013 18.5501L3.60846 17.7251C3.47513 17.1335 3.00846 16.6751 2.4168 16.5335L1.5918 16.3418C1.50846 16.3251 1.50846 16.1918 1.5918 16.1751L2.4168 15.9835C3.00846 15.8501 3.4668 15.3835 3.60846 14.7918L3.80013 13.9668C3.8168 13.8835 3.95013 13.8835 3.9668 13.9668L4.15846 14.7918C4.2918 15.3835 4.75846 15.8418 5.35013 15.9835L6.17513 16.1751C6.25846 16.1918 6.25846 16.3251 6.17513 16.3418Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10"/>
      <path d="M3.7998 5.3665C3.7998 7.3665 5.3748 8.9915 7.35814 9.05817C7.4498 9.04984 7.5498 9.04984 7.63314 9.05817C9.61647 8.9915 11.1915 7.3665 11.1998 5.3665C11.1998 3.32484 9.5498 1.6665 7.4998 1.6665" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.6747 3.33301C15.2914 3.33301 16.5914 4.64134 16.5914 6.24967C16.5914 7.85801 15.3414 9.10801 13.7831 9.16634C13.7164 9.15801 13.6414 9.15801 13.5664 9.16634" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.50026 18.1747C9.05858 18.1997 10.6252 17.8164 11.8086 17.0247C13.8252 15.6747 13.8252 13.4747 11.8086 12.133C10.6336 11.3497 9.05858 10.9664 7.50026 10.9914C6.66693 11.008 5.84193 11.133 5.08359 11.3747C4.76693 11.4747 4.46693 11.5914 4.18359 11.733" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.2832 16.6665C15.8832 16.5415 16.4499 16.2998 16.9165 15.9415C18.2165 14.9665 18.2165 13.3582 16.9165 12.3832C16.4582 12.0332 15.8999 11.7998 15.3082 11.6665" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

export const ClaimsIcon: FC<IconProps> = ({ className, color = defaultColor }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <mask id="mask0_claims" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
      <path d="M20 0H0V20H20V0Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_claims)">
      <path d="M7.50033 18.3332H12.5003C16.667 18.3332 18.3337 16.6665 18.3337 12.4998V7.49984C18.3337 3.33317 16.667 1.6665 12.5003 1.6665H7.50033C3.33366 1.6665 1.66699 3.33317 1.66699 7.49984V12.4998C1.66699 16.6665 3.33366 18.3332 7.50033 18.3332Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.125 7.5H6.875" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.125 12.5H6.875" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

export const OperationalModulesIcon: FC<IconProps> = ({ className, color = defaultColor }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <mask id="mask0_operational" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
      <path d="M20 0H0V20H20V0Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_operational)">
      <path d="M10.8416 2.43359L15.7583 4.61693C17.1749 5.24193 17.1749 6.27526 15.7583 6.90026L10.8416 9.08359C10.2833 9.33359 9.36658 9.33359 8.80825 9.08359L3.8916 6.90026C2.47493 6.27526 2.47493 5.24193 3.8916 4.61693L8.80825 2.43359C9.36658 2.18359 10.2833 2.18359 10.8416 2.43359Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 9.16699C2.5 9.86699 3.025 10.6753 3.66667 10.9587L9.325 13.4753C9.75833 13.667 10.25 13.667 10.675 13.4753L16.3333 10.9587C16.975 10.6753 17.5 9.86699 17.5 9.16699" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 13.333C2.5 14.108 2.95833 14.808 3.66667 15.1247L9.325 17.6413C9.75833 17.833 10.25 17.833 10.675 17.6413L16.3333 15.1247C17.0417 14.808 17.5 14.108 17.5 13.333" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

export const RcmIntelligenceIcon: FC<IconProps> = ({ className, color = defaultColor }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <mask id="mask0_rcm" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
      <path d="M20 0H0V20H20V0Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_rcm)">
      <path d="M2.5 18.333H17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.66665 6.98389H3.33333C2.875 6.98389 2.5 7.35889 2.5 7.81722V15.0006C2.5 15.4589 2.875 15.8339 3.33333 15.8339H4.66665C5.12498 15.8339 5.49998 15.4589 5.49998 15.0006V7.81722C5.49998 7.35889 5.12498 6.98389 4.66665 6.98389Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.6666 4.32422H9.33333C8.875 4.32422 8.5 4.69922 8.5 5.15755V14.9993C8.5 15.4576 8.875 15.8326 9.33333 15.8326H10.6666C11.1249 15.8326 11.4999 15.4576 11.4999 14.9993V5.15755C11.4999 4.69922 11.1249 4.32422 10.6666 4.32422Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.6667 1.6665H15.3333C14.875 1.6665 14.5 2.0415 14.5 2.49984V14.9998C14.5 15.4582 14.875 15.8332 15.3333 15.8332H16.6667C17.125 15.8332 17.5 15.4582 17.5 14.9998V2.49984C17.5 2.0415 17.125 1.6665 16.6667 1.6665Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

export const SettingsIcon: FC<IconProps> = ({ className, color = defaultColor }) => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <mask id="mask0_settings" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
      <path d="M20 0H0V20H20V0Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_settings)">
      <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.66699 10.7328V9.26617C1.66699 8.3995 2.37533 7.68287 3.25033 7.68287C4.75866 7.68287 5.37533 6.61621 4.61699 5.30787C4.18366 4.55787 4.44199 3.58287 5.20033 3.14954L6.64199 2.32454C7.30033 1.93287 8.15033 2.16621 8.54199 2.82454L8.63366 2.98287C9.38366 4.29121 10.617 4.29121 11.3753 2.98287L11.467 2.82454C11.8587 2.16621 12.7087 1.93287 13.367 2.32454L14.8087 3.14954C15.567 3.58287 15.8253 4.55787 15.392 5.30787C14.6337 6.61621 15.2503 7.68287 16.7587 7.68287C17.6253 7.68287 18.342 8.39117 18.342 9.26617V10.7328C18.342 11.5995 17.6337 12.3162 16.7587 12.3162C15.2503 12.3162 14.6337 13.3828 15.392 14.6912C15.8253 15.4495 15.567 16.4162 14.8087 16.8495L13.367 17.6745C12.7087 18.0662 11.8587 17.8328 11.467 17.1745L11.3753 17.0162C10.6253 15.7078 9.39199 15.7078 8.63366 17.0162L8.54199 17.1745C8.15033 17.8328 7.30033 18.0662 6.64199 17.6745L5.20033 16.8495C4.44199 16.4162 4.18366 15.4412 4.61699 14.6912C5.37533 13.3828 4.75866 12.3162 3.25033 12.3162C2.37533 12.3162 1.66699 11.5995 1.66699 10.7328Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

export const HelpSupportIcon: FC<IconProps> = ({ className, color = defaultColor }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <mask id="mask0_help" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
      <path d="M20 0H0V20H20V0Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_help)">
      <path d="M10.0003 18.3332C14.5837 18.3332 18.3337 14.5832 18.3337 9.99984C18.3337 5.4165 14.5837 1.6665 10.0003 1.6665C5.41699 1.6665 1.66699 5.4165 1.66699 9.99984C1.66699 14.5832 5.41699 18.3332 10.0003 18.3332Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 6.6665V10.8332" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.99609 13.333H10.0036" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

export const sidebarIcons = {
  dashboard: DashboardIcon,
  patients: PatientsIcon,
  claims: ClaimsIcon,
  operationalModules: OperationalModulesIcon,
  rcmIntelligence: RcmIntelligenceIcon,
  settings: SettingsIcon,
  helpSupport: HelpSupportIcon,
};

export { defaultColor, activeColor };
