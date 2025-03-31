/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["github.githubassets.com", "upload.wikimedia.org", "cdn-icons-png.flaticon.com"],
  },
  webpack: (config) => {
    // Firebase 관련 경고 해결을 위한 설정
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }

    return config
  },
};

export default nextConfig;
