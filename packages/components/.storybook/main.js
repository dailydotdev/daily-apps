module.exports = {
  webpackFinal: (config) => {
    const cssRule = config.module.rules.findIndex(
      f => f.test.toString() === '/\\.css$/'
    );
    config.module.rules[cssRule].test = /\.p?css$/;
    config.module.rules[cssRule].use[2] = 'postcss-loader';
    return config;
  },
}
