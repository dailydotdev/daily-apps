import { authService } from './common/services';
import {
  setCache,
  getCache,
  ANALYTICS_ID_KEY,
  DATA_VERSION_KEY,
  CURRENT_DATA_VERSION,
  STATE_KEY,
  FIRST_INSTALL_KEY,
} from './common/cache';

const saveFirstInstall = async () => {
  const existing = await getCache(FIRST_INSTALL_KEY, null);
  if (!existing) {
    setCache(FIRST_INSTALL_KEY, (new Date()).toISOString());
  }
};

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
  return setCache(STATE_KEY, {
    feed: {
      bookmarks,
      publications: Object.keys(pubs).map(id => ({ id, enabled: pubs[id] })),
    },
    ui: {
      lastNotificationTime: notificationTime,
      ...settings,
    },
    user: { profile },
  });
};

const migrateVersion2 = async () => {
  const cache = await getCache(STATE_KEY, {});
  return setCache(STATE_KEY, {
    ui: {
      onboarding: false,
      minimalUi: false,
      ...cache.ui,
    },
    ...cache,
  });
};

const migrateCache = async () => {
  const version = await getCache(DATA_VERSION_KEY, null);
  if (version) {
    if (version === 1) {
      await migrateVersion1();
    }
    if (version <= 2) {
      await migrateVersion2();
    }
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
    saveFirstInstall(),
    browser.runtime.setUninstallURL('https://daily.dev/uninstall'),
  ]);
});
