module.exports = {
  pwa: {
    name: 'Daily Moderator',
    themeColor: '#303237',
    workboxOptions: {
      exclude: [/OneSignal.*\.js$/, /^_/],
    },
  },
  chainWebpack: config => config.resolve.symlinks(false),
};
