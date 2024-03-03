import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      white: "#fff",
      black: "#000",
      transparent: "transparent",
      alabaster: {
        50: "var(--alabaster-50)",
        100: "var(--alabaster-100)",
        200: "var(--alabaster-200)",
        300: "var(--alabaster-300)",
        400: "var(--alabaster-400)",
        500: "var(--alabaster-500)",
        600: "var(--alabaster-600)",
        700: "var(--alabaster-700)",
        800: "var(--alabaster-800)",
        900: "var(--alabaster-900)",
        950: "var(--alabaster-950)",
      },
    },
  },
  plugins: [],
};
export default config;
