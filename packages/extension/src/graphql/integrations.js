import gql from 'graphql-tag';

export const POPULAR_INTEGRATIONS_QUERY = gql`
query PopularIntegrations {
  popularIntegrations {
    logo, title, subtitle, url
  }
}`;

export const RSS_FEEDS_QUERY = gql`
query RSSFeeds {
  rssFeeds {
    name, url
  }
}`;
