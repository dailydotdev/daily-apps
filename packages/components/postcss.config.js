const path = require('path');

module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-mixins': {
      mixinsDir: path.join(__dirname, 'src/styles/mixins'),
    },
    'postcss-extend': {},
    'postcss-nested': { bubble: ['-moz-document'] },
    'postcss-custom-media': {},
  },
};
