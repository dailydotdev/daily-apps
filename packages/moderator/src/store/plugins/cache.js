import { setCache, STATE_KEY } from '../../common/cache';

const stateToCache = (state) => {
  const toCache = Object.assign({},{ ...state });
  delete toCache.requests.reasons;

  return toCache;
};

export default (store) => {
  store.subscribe((mutation, state) => {
    if (mutation.type !== 'loadFromCache' && mutation.type.indexOf('reset') < 0) {
      setCache(STATE_KEY, stateToCache(state))
      // eslint-disable-next-line no-console
        .catch(err => console.warn('failed to cache state', err));
    }
  });
};
