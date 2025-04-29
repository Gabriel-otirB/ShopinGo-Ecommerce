import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
        pathname: '/**',  // permite qualquer caminho dentro do domínio
      },
    ],
  },
};

export default nextConfig;
