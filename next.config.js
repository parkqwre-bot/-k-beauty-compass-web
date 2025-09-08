/** @type {import('next').NextConfig} */
const CopyPlugin = require('copy-webpack-plugin');

const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: './content',
              to: './content',
            },
          ],
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
