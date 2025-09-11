const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blacklistRE: /(node_modules\/.*\/node_modules\/.*|__tests__\/.*|\.git\/.*|\.vscode\/.*|coverage\/.*)/,
  },
  watchFolders: [],
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // Reduce file watching overhead
        if (req.url && req.url.includes('node_modules')) {
          res.statusCode = 404;
          res.end();
          return;
        }
        return middleware(req, res, next);
      };
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
