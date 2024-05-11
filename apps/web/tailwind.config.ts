import type { Config } from "tailwindcss";
import sharedConfig from "config/tailwind.config";

const config: Pick<Config, "presets"> = {
  presets: [
    {
      ...sharedConfig,
      content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./ui/**/*.{js,ts,jsx,tsx}",
        // h/t to https://www.willliu.com/blog/Why-your-Tailwind-styles-aren-t-working-in-your-Turborepo
        "../../packages/ui/**/*{.js,.ts,.jsx,.tsx}",
      ],
    },
  ],
};
export default config;
