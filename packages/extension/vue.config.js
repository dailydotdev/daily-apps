const path = require('path');
const { GenerateSW } = require('workbox-webpack-plugin');

process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  pages: {
    'standalone/standalone': {
      entry: 'src/standalone/standalone.js',
      filename: 'index.html',
      title: 'New Tab',
    },
  },
  pluginOptions: {
    browserExtension: {
      registry: undefined,
      components: {
        background: true,
        standalone: true,
      },
      api: 'browser',
      usePolyfill: true,
      autoImportPolyfill: true,
      componentOptions: {
        background: {
          entry: 'src/background.js',
        },
      },
    },
  },
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
      .loader('vue-svg-inline-loader');
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'chrome') {
      return {
        plugins: [
          new GenerateSW({
            exclude: [/.*/],
            swDest: path.join(config.output.path, 'sw.js'),
            importWorkboxFrom: 'local',
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
              {
                urlPattern: new RegExp('^https://res.cloudinary.com/daily-now/image/upload/.*/v1/posts/.*'),
                handler: 'CacheFirst',
                options: {
                  cacheName: 'post-images',
                  expiration: {
                    // 7 days
                    maxAgeSeconds: 604800,
                  },
                },
              },
              {
                urlPattern: new RegExp('^https://res.cloudinary.com/daily-now/image/upload/.*/v1/ads/.*'),
                handler: 'CacheFirst',
                options: {
                  cacheName: 'ads-images',
                  expiration: {
                    // 7 days
                    maxAgeSeconds: 604800,
                  },
                },
              },
              {
                urlPattern: new RegExp('^https://res.cloudinary.com/daily-now/image/upload/.*/v1/logos/.*'),
                handler: 'CacheFirst',
                options: {
                  cacheName: 'pubs-logos',
                },
              },
            ],
          }),
        ],
      };
    }
    return {};
  },
};
