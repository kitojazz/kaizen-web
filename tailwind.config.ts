import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pale: "#f4f8fd",
        ink: "#0c1422",
        body: "#526176",
        blue: "#0875e9",
        "blue-dark": "#005fbd",
        "blue-text": "#0066cc",
        "blue-action": "#0066cc",
        navy: "#0b1422",
        deep: "#004994",
        line: "#dce6f1",
        mist: "#eaf3ff",
        "hero-muted": "#b9c8da",
        muted: "#5d6c81",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Segoe UI", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        lift: "0 24px 60px -36px rgba(12, 20, 34, 0.42)",
        card: "0 18px 40px -32px rgba(12, 20, 34, 0.32)",
        hero: "0 36px 90px -42px rgba(12, 20, 34, 0.62)",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
