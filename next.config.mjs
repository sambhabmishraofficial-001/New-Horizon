/** @type {import('next').NextConfig} */
const siteUrl = "https://newhorizon.dev";

const nextConfig = {
  output: "export",
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
