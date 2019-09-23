const POST_FIELDS = `
    id
    title
    url
    publishedAt
    createdAt
    image
    ratio
    placeholder
    views
    readTime
    publication {
      id
      name
      image
    }
    tags
`;

const fetchLatestQuery = `
    query fetchLatest($params: QueryPostInput) {
        latest(params: $params) {
            ${POST_FIELDS}
        }
    }
`;

const fetchPostsByTagQuery = `
    query fetchPostsByTag($params: PostByTagInput) {
        postsByTag: tag(params: $params) {
            ${POST_FIELDS}
        }
    }
`;

const fetchPostsByPublicationQuery = `
    query fetchPostsByPublication($params: PostByPublicationInput) {
        postsByPublication: tag(params: $params) {
            ${POST_FIELDS}
        }
    }
`;

export default {
    fetchLatestQuery,
    fetchPostsByTagQuery,
    fetchPostsByPublicationQuery,
};