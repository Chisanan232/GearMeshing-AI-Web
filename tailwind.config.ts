import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config = {
  theme: {
    extend: {},
  },
  plugins: [typography],
} satisfies Config;

export default config;
