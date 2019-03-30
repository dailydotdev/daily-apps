if ('serviceWorker' in navigator && window.chrome && window.location.protocol.indexOf('chrome-extension') >= 0) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(() => {
      console.log('service worker registered');
    }).catch((registrationError) => {
      console.warn('service worker registration failed: ', registrationError);
    });
  });
}
