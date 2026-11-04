/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "14mb",
    },
    // Hosting con poca memoria/CPU: un solo worker y sin hilos extra durante el build.
    cpus: 1,
    workerThreads: false,
  },
  webpack: (config, { dev }) => {
    // La caché persistente de webpack falla en el filesystem del hosting
    // ("Unable to snapshot resolve dependencies") y no aporta en un build limpio.
    if (!dev) config.cache = false;
    return config;
  },
};

export default nextConfig;
