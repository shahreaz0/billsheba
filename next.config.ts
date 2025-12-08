import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheComponents: true,
  output: "standalone",
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
}

export default nextConfig
