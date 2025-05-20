import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#00FFFF", // ou use a cor do seu branding
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
