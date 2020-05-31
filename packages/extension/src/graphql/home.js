import gql from 'graphql-tag';

export const BANNER_QUERY = gql`
query Banner($lastSeen: DateTime) {
  banner(lastSeen: $lastSeen) {
    timestamp, cta, subtitle, theme, title, url
  }
}`;

export const LATEST_NOTIFICATIONS_QUERY = gql`
query LatestNotifications {
  latestNotifications {
    timestamp, html
  }
}`;
