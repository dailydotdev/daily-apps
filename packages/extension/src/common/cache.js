export const STATE_KEY = 'state';
export const ANALYTICS_ID_KEY = 'analyticsId';
export const CONSENT_KEY = 'analyticsConsent';
export const DATA_VERSION_KEY = 'dataVersion';
export const CURRENT_DATA_VERSION = 2;

export function setCache(key, value) {
  return browser.storage.local.set({ [key]: value });
}

export async function getCache(key, defaultValue) {
  const res = await browser.storage.local.get(key);
  if (!(Number.isNaN(res[key]) || res[key] === undefined)) {
    return res[key];
  }

  return defaultValue;
}

export function removeCache(key) {
  return browser.storage.local.remove(key);
}
