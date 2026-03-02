import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#e6f2ff",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#0078d4",
          700: "#106ebe",
          800: "#0d5a9e",
          900: "#1e3a8a",
        },
        surface: {
          DEFAULT: "#f5f5f5",
          card: "#ffffff",
          raised: "#ffffff",
        },
        sidebar: {
          DEFAULT: "#1e3a5f",
          hover: "#2d4a6f",
          active: "#3b5a7f",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Segoe UI", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      spacing: {
        4.5: "1.125rem",
        13: "3.25rem",
        15: "3.75rem",
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)",
        "card-elevated": "0 4px 16px rgba(0, 0, 0, 0.06)",
        "ms-card": "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        "ms-card-hover": "0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)",
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        md: "0 4px 12px -2px rgb(0 0 0 / 0.06), 0 2px 6px -2px rgb(0 0 0 / 0.04)",
        lg: "0 12px 24px -4px rgb(0 0 0 / 0.08), 0 4px 8px -4px rgb(0 0 0 / 0.04)",
      },
      borderColor: {
        DEFAULT: "#e5e7eb",
        light: "#f3f4f6",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      transitionDuration: {
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
      },
      animation: {
        "fade-in": "fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "fade-in-up": "fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in-right": "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "scale-in": "scaleIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "page-enter": "pageEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "progress": "progress 1.5s ease-in-out forwards",
        "progress-indeterminate": "progress-indeterminate 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width, 100%)" },
        },
        pageEnter: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "progress-indeterminate": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        "smooth-out": "cubic-bezier(0, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
