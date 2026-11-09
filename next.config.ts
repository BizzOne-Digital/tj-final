import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Admin uploads are served from MongoDB via /api/uploads/** (serverless-safe).
    localPatterns: [
      { pathname: "/api/uploads/**" },
      { pathname: "/league-assets/**" },
      { pathname: "/brand/**" },
      { pathname: "/**" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
