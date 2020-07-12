import { authService } from './common/services';
import {
  setCache,
  getCache,
  ANALYTICS_ID_KEY,
  DATA_VERSION_KEY,
  CURRENT_DATA_VERSION,
  STATE_KEY,
} from './common/cache';

const cacheUserId = async () => {
  const profile = await authService.getUserProfile();
  return setCache(ANALYTICS_ID_KEY, profile.id);
};

const migrateVersion1 = async () => {
  const [bookmarks, pubs, settings, profile, notificationTime] = await Promise.all([
    getCache('bookmarks', []),
    getCache('publications', {}),
    getCache('settings', {}),
    getCache('profile', null),
    getCache('notificationTime', null),
  ]);
  return {
    feed: {
      bookmarks,
      publications: Object.keys(pubs).map(id => ({ id, enabled: pubs[id] })),
    },
    ui: {
      lastNotificationTime: notificationTime,
      ...settings,
    },
    user: { profile },
  };
};

const migrateCache = async () => {
  const version = await getCache(DATA_VERSION_KEY, '1');
  if (version !== CURRENT_DATA_VERSION) {
    const newCache = await migrateVersion1();
    await setCache(STATE_KEY, newCache);
  }
  await setCache(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
};

browser.browserAction.onClicked.addListener(() => {
  const url = browser.extension.getURL('index.html?source=button');
  browser.tabs.create({ url, active: true });
});

browser.alarms.create('cacheUserId', { periodInMinutes: 60 });

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'cacheUserId') {
    // TODO: handle error
    await cacheUserId();
  }
});

browser.runtime.onInstalled.addListener(async () => {
  await Promise.all([
    cacheUserId(),
    migrateCache(),
    browser.runtime.setUninstallURL('https://daily.dev/uninstall'),
  ]);
});
