import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import animation from "@tailwindcss/typography"

const config = {
  theme: {
    extend: {},
  },
  plugins: [animation, typography],
} satisfies Config;

export default config;
