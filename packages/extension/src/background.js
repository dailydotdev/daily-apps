import initializeAnalytics from './common/analytics';

browser.browserAction.onClicked.addListener(() => {
  const url = browser.extension.getURL('index.html?source=button');
  browser.tabs.create({ url, active: true });
});

browser.runtime.onInstalled.addListener((obj) => {
  // TODO: analytics consent
  initializeAnalytics(true)
    .then(() => ga('send', 'event', 'Extension', 'Install', obj.reason))
    // TODO: handle error
    // eslint-disable-next-line no-console
    .catch(console.error);
});
