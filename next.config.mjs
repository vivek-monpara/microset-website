/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.56.1'],
  serverExternalPackages: ['otplib', 'qrcode'],
}

export default nextConfig
