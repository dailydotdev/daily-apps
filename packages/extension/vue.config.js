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
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
      .loader('vue-svg-inline-loader');
  },
};
