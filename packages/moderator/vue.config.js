module.exports = {
  pwa: {
    name: 'Daily Moderator',
    themeColor: '#303237',
  },
  chainWebpack: config => config.resolve.symlinks(false),
};
