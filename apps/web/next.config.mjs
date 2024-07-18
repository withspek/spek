/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@spek/client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
      },
    ],
  },
};

export default nextConfig;
