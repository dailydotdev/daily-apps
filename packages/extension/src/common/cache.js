import browser from 'webextension-polyfill';

export const STATE_KEY = 'state';

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
