import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Project-wide tweaks.
  {
    rules: {
      // French copy uses literal apostrophes everywhere; escaping every one
      // would obscure the source for very little linting value.
      "react/no-unescaped-entities": "off",
      // `<a>` is intentionally used for cross-section navigation that should
      // trigger a full session refresh (post-login, post-permission-change).
      // Within a workspace we use Link; the lint rule is too coarse.
      "@next/next/no-html-link-for-pages": "off",
      // Server Components are evaluated once per request — Date.now is fine
      // here, the lint rule is for impure client renders.
      "react-hooks/purity": "off",
    },
  },
]);

export default eslintConfig;
