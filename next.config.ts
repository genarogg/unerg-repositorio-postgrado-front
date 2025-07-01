import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignora los errores de ESLint durante el build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // (opcional) Ignora errores de TypeScript durante el build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
