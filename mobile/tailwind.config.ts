import type { Config } from "tailwindcss";

declare const require: (
  moduleName: string,
) => NonNullable<Config["presets"]>[number];

const nativewindPreset = require("nativewind/preset");

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [nativewindPreset],
  safelist: [
    {
      pattern:
        /^(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
  ],
} satisfies Config;
