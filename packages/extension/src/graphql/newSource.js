import gql from 'graphql-tag';

export const SOURCE_BY_FEED_QUERY = gql`
  query SourceByFeed($data: String!) {
    sourceByFeed(feed: $data) {
      id, name, image, public
    }
  }`;

export const ADD_PRIVATE_SOURCE_MUTATION = gql`
  mutation AddPrivateSource($data: AddPrivateSourceInput!) {
    addPrivateSource(data: $data) {
      id, name, image, public
    }
  }`;
