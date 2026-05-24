import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next.js doesn't try to infer it from a
  // grand-parent lockfile when several lockfiles are present on disk.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
