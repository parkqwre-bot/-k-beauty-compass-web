/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: require('path').join(__dirname, '..'),
  },
  outputFileTracing: {
    include: [
      require('path').join(__dirname, 'content'),
    ],
  },
};

module.exports = nextConfig;
