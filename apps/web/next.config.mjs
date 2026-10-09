import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pages are rendered per request (the CSP nonce in proxy.ts forces that), and
  // src/lib/rules.ts reads docs/rules/*.md from outside this app at request
  // time. Trace from the repo root and include those files explicitly, or the
  // Vercel function bundle won't contain them.
  outputFileTracingRoot: repoRoot,
  outputFileTracingIncludes: {
    "/rules": ["../../docs/rules/**/*.md"],
    "/rules/[id]": ["../../docs/rules/**/*.md"],
  },
};

export default nextConfig;
