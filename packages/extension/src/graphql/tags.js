import gql from 'graphql-tag';

export const POPULAR_TAGS_QUERY = gql`
query PopularTags {
    popularTags {
        name
    }
}`;

export const SEARCH_TAGS_QUERY = gql`
query SearchTags($query: String!) {
    searchTags(query: $query) {
        query
        hits { name }
    }
}`;
