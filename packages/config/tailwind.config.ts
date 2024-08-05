import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
      ],
      mono: ["Menlo", "Monaco", "Courier New", "monospace"],
    },
    screens: {
      sm: "640px",
      md: "800px",
      lg: "1024px",
      xl: "1280px",
    },
    colors: {
      black: colors.black,
      white: colors.white,
      currentColor: colors.current,
      transparent: colors.transparent,
      accent: {
        DEFAULT: "var(--color-accent)",
        hover: "var(--color-accent-hover)",
        disabled: "var(--color-accent-disabled)",
      },
      primary: {
        50: "var(--color-primary-50)",
        100: "var(--color-primary-100)",
        200: "var(--color-primary-200)",
        300: "var(--color-primary-300)",
        400: "var(--color-primary-400)",
        500: "var(--color-primary-500)",
        600: "var(--color-primary-600)",
        700: "var(--color-primary-700)",
        800: "var(--color-primary-800)",
        900: "var(--color-primary-900)",
        950: "var(--color-primary-950)",
      },
      secondary: {
        50: "var(--color-secondary-50)",
        100: "var(--color-secondary-100)",
        200: "var(--color-secondary-200)",
        300: "var(--color-secondary-300)",
        400: "var(--color-secondary-400)",
        500: "var(--color-secondary-500)",
        600: "var(--color-secondary-600)",
        700: "var(--color-secondary-700)",
        800: "var(--color-secondary-800)",
        900: "var(--color-secondary-900)",
      },
      red: colors.red,
      green: colors.green,
      orange: colors.orange,
    },
    extend: {
      spacing: {
        md: "44rem",
        lg: "64.0625rem",
        xl: "75rem",
      },
    },
    keyframes: {
      "fade-in-up": {
        from: { opacity: "0", transform: "translateY(10px)" },
        to: { opacity: "1", transform: "none" },
      },
      spinning: {
        "100%": { transform: "rotate(360deg)" },
      },
    },
    animation: {
      "fade-in-up":
        "fade-in-up 600ms var(--animation-delay, 0ms) cubic-bezier(.21,1.02,.73,1) forwards",
      "fade-in-bottom": "fade-in-bottom cubic-bezier(.21,1.02,.73,1) forwards",
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-radix")],
};

export default config;
