import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default defineConfig([
  ...compat.config({ extends: ["next/core-web-vitals", "next/typescript"] }),
  {
    rules: {
      // Shipped media uses direct, manifest-owned CDN URLs. Its layouts reserve
      // dimensions and lazy-load below the fold, so an image proxy adds no value.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([
    ".next/**",
    ".amplify/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Active media/lead infrastructure and the focused intake function are
    // linted. Only the dormant compatibility backend remains excluded.
    "amplify/auth/**",
    "amplify/functions/api/**",
    "amplify/storage/**",
  ]),
]);
