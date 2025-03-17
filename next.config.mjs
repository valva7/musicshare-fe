/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["github.githubassets.com", "upload.wikimedia.org", "cdn-icons-png.flaticon.com"],
  }
};

export default nextConfig;
