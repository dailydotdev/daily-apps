import gql from 'graphql-tag';

export const BANNER_QUERY = gql`
  query Banner($lastSeen: DateTime) {
    banner(lastSeen: $lastSeen) {
      timestamp, cta, subtitle, theme, title, url
    }
  }`;

export const USER_READING_RANK_QUERY = gql`
  query UserReadingRank($id: ID!) {
    userReadingRank(id: $id) {
      currentRank, progressThisWeek, readToday
    }
  }
  `;
