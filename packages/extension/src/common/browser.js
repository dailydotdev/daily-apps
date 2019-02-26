const getBrowserName = () => {
  if (window.chrome && window.location.protocol.indexOf('chrome-extension') >= 0) {
    return 'chrome';
  }
  if (window.browser && window.location.protocol.indexOf('moz-extension') >= 0) {
    return 'firefox';
  }

  return null;
};

// eslint-disable-next-line import/prefer-default-export
export const browserName = getBrowserName();
