import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [new URL(`${process.env.NEXT_AWS_S3_URL}/**`)],
  },
};

export default nextConfig;
