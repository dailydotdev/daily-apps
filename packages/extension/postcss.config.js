const path = require('path');

module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-mixins': {
      mixinsDir: path.join(__dirname, '../../node_modules/@daily/components/src/styles/mixins'),
    },
    'postcss-extend': {},
    'postcss-nesting': {},
    'postcss-custom-media': {},
  },
};
