import type { Config } from "tailwindcss";

declare const require: (
  moduleName: string,
) => NonNullable<Config["presets"]>[number];

const nativewindPreset = require("nativewind/preset");

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [nativewindPreset],
} satisfies Config;
