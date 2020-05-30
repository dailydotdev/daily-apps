import { InMemoryCache } from 'apollo-cache-inmemory';
import { CachePersistor } from 'apollo-cache-persist';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';

const cache = new InMemoryCache();

export const persistor = new CachePersistor({
  cache,
  key: 'apollo-cache-persistor',
  storage: {
    async getItem(key) {
      const res = await browser.storage.local.get(key);
      if (!(Number.isNaN(res[key]) || res[key] === undefined)) {
        return res[key];
      }
      return undefined;
    },
    setItem: (key, data) => browser.storage.local.set({ [key]: data }),
    removeItem: key => browser.storage.local.remove(key),
  },
});

const link = createPersistedQueryLink({ useGETForHashedQueries: true })
  .concat(createHttpLink({
    uri: `${process.env.VUE_APP_API_URL}/graphql`,
    useGETForQueries: true,
    credentials: 'include',
  }));

export const apolloClient = new ApolloClient({
  link,
  cache,
});
