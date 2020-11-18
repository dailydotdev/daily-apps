import { InMemoryCache } from 'apollo-cache-inmemory';
import { CachePersistor } from 'apollo-cache-persist';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

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

const httpLink = createPersistedQueryLink({ useGETForHashedQueries: true })
  .concat(createHttpLink({
    uri: `${process.env.VUE_APP_API_URL}/graphql`,
    useGETForQueries: true,
    credentials: 'include',
  }));

const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_SUBS_URL,
  options: {
    reconnect: true,
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link,
  cache,
});
