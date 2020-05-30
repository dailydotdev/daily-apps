module.exports = {
  client: {
    service: {
      name: 'Daily API',
      url: 'http://localhost:5000/graphql',
    },
    // Files processed by the extension
    includes: [
      'src/**/*.vue',
      'src/**/*.js',
    ],
  },
};
