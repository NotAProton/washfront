/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: './',
  eslint: {
    ignoreDuringBuilds: true
  }

}

module.exports = nextConfig
