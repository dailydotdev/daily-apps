import { setCache, STATE_KEY } from '../../common/cache';

export default (store) => {
  store.subscribe((mutation, state) => {
    if (mutation.type !== 'loadFromCache' && mutation.type.indexOf('reset') < 0) {
      setCache(STATE_KEY, state)
      // eslint-disable-next-line no-console
        .catch(err => console.warn('failed to cache state', err));
    }
  });
};
