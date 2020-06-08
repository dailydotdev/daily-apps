import gql from 'graphql-tag';

export const SOURCE_BY_FEEDS_QUERY = gql`
query SourceByFeeds($data: [String!]!) {
  sourceByFeeds(feeds: $data) {
    id
    name
    image
    public
  }
}`;

export const ADD_PRIVATE_SOURCE_MUTATION = gql`
mutation AddPrivateSource($data: AddPrivateSourceInput!) {
  addPrivateSource(data: $data) {
    id, name, image, public
  }
}`;
