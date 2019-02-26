browser.browserAction.onClicked.addListener(() => {
  const url = browser.extension.getURL('index.html?source=button');
  browser.tabs.create({ url, active: true });
});

browser.runtime.onInstalled.addListener((obj) => {
  ga('send', 'event', 'Extension', 'Install', obj.reason);
});
