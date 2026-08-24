import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Cualquier directorio de build de Next, no solo los dos que había. El
  // dev server con NEXT_DIST_DIR=.next-dev generaba miles de errores de lint
  // sobre código compilado, que es ruido que esconde los errores de verdad.
  globalIgnores([
    ".next*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Las portadas sin optimizar y el material de origen del blog.
    "assets/blog-covers-originales/**",
  ]),
]);

export default eslintConfig;
