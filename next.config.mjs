/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["github.githubassets.com", "upload.wikimedia.org"],
  }
};

export default nextConfig;
