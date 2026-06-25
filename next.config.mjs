import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

const siteUrl = "https://newhorizon.dev";

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    ...(isDev ? {} : { output: "export" }),
    transpilePackages: ["geist", "remotion", "@remotion/player", "@gsap/react", "gsap"],
    images: {
      unoptimized: true,
    },
    reactStrictMode: true,
    trailingSlash: true,
    async redirects() {
      return [
        { source: "/atrium", destination: "/lattice", permanent: true },
        { source: "/atrium/:path*", destination: "/lattice/:path*", permanent: true },
      ];
    },
    webpack: (config, { dev }) => {
      if (dev) {
        // Filesystem webpack cache on Windows can leave stale chunk refs; use in-memory cache instead.
        config.cache = { type: "memory" };
      }
      return config;
    },
    env: {
      NEXT_PUBLIC_BASE_PATH: "",
      NEXT_PUBLIC_SITE_URL: siteUrl,
    },
  };
};

export default nextConfig;
