import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export const BANNER_QUERY = gql`
  query Banner($lastSeen: DateTime) {
    banner(lastSeen: $lastSeen) {
      timestamp, cta, subtitle, theme, title, url
    }
  }`;
