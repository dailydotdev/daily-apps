module.exports = {
  pwa: {
    name: 'Daily Moderator',
    themeColor: '#303237',
    workboxOptions: {
      exclude: [/OneSignal.*\.js$/],
    }
  },
  chainWebpack: config => config.resolve.symlinks(false),
};
