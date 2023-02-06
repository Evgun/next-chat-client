module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  env: {
    API_URL: 'http://25.93.120.164:3000',
  },
};