/** @type {import('next').NextConfig} */
const siteUrl = "https://newhorizon.dev";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid recurring Windows dev-cache corruption that leaves missing chunk files in .next.
      config.cache = false;
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
};

export default nextConfig;
