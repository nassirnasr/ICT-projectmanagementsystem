import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        blue: {
          50: "#eff6ff",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        
        "dark-bg": "#0B0F19",          // Deeper, richer background
        "dark-sidebar": "#111827",     // Refined sidebar
        "dark-navbar": "#131B2C",      // More sophisticated navbar
        "dark-secondary": "#1E2A45",   // Richer accent
        "dark-tertiary": "#2C3B5C",    // More vibrant dividers
        "dark-hover": "#1A2542",       // Elegant hover state
        "stroke-dark": "#1F2B47",      // Refined borders
        
        "blue-primary": "#2563eb",     // More vibrant primary blue
        
        "accent-1": "#F43F5E",         // For important actions/alerts
        "accent-2": "#8B5CF6",         // For secondary highlights
        "accent-3": "#10B981",         // For success states
      },
      
    },
  },
  plugins: [],
} satisfies Config;
