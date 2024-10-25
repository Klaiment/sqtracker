const { withSentryConfig } = require("@sentry/nextjs");
const config = require("../config");
const { version } = require("./package.json");

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
  },
  publicRuntimeConfig: {
    ...config.envs,
    SQ_VERSION: version,
  },
  serverRuntimeConfig: {
    ...config.envs,
    ...config.secrets,
  },
  sentry: {
    hideSourceMaps: true,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
  errorHandler: (err, invokeErr, compilation) => {
    compilation.warnings.push("Sentry CLI Plugin: " + err.message);
  },
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
