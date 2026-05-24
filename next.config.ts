import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // static HTML export — required for GitHub Pages
  trailingSlash: true,     // generates /idea/[id]/index.html instead of /idea/[id].html
  images: {
    unoptimized: true,     // Next.js image optimisation requires a server; disable for static
  },
};

export default nextConfig;
