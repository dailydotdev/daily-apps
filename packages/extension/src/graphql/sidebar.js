import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export const SOURCES_QUERY = gql`
  query Sources {
    sources(first: 500) {
      edges { node { id, image, name, public } }
    }
  }`;
