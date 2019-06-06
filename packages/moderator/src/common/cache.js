import localForage from 'localforage';

const store = localForage.createInstance({
  name: 'daily-mod',
});

export const STATE_KEY = 'state';

export function setCache(key, value) {
  return store.setItem(key, value);
}

export async function getCache(key, defaultValue) {
  const res = await store.getItem(key);
  if (!(Number.isNaN(res) || res === undefined)) {
    return res;
  }

  return defaultValue;
}

export function removeCache(key) {
  return store.removeItem(key);
}
