import gql from 'graphql-tag';

export const FEED_POST_FRAGMENT = gql`
  fragment FeedPost on Post {
    id,title,url,publishedAt,createdAt,image,placeholder,readTime,
    source { id, name, image, public },tags,permalink,numComments,
    commentsPermalink,featuredComments { content, permalink, author { name, image } }
  }`;

export const USER_POST_FRAGMENT = gql`
  fragment UserPost on Post {
    bookmarked,read,bookmarkList { id },upvoted,commented
  }`;

export const FEED_POST_CONNECTION_FRAGMENT = gql`
  fragment FeedPostConnection on PostConnection {
    pageInfo { hasNextPage, endCursor }
    edges {
      node {
        ...FeedPost
        ...UserPost @include(if: $loggedIn)
      }
    }
  }
  ${FEED_POST_FRAGMENT}
${USER_POST_FRAGMENT}`;

export const ANONYMOUS_FEED_QUERY = gql`
  query AnonymousFeed($loggedIn: Boolean! = false, $now: DateTime!, $first: Int, $after: String, $ranking: Ranking, $filters: FiltersInput) {
    feed: anonymousFeed(now: $now, first: $first, after: $after, ranking: $ranking, filters: $filters) {
      ...FeedPostConnection
    }
  }
${FEED_POST_CONNECTION_FRAGMENT}`;

export const FEED_QUERY = gql`
  query Feed($loggedIn: Boolean! = false, $now: DateTime!, $first: Int, $after: String, $ranking: Ranking, $unreadOnly: Boolean) {
    feed(now: $now, first: $first, after: $after, ranking: $ranking, unreadOnly: $unreadOnly) {
      ...FeedPostConnection
    }
  }
${FEED_POST_CONNECTION_FRAGMENT}`;

export const BOOKMARKS_FEED_QUERY = gql`
  query BookmarksFeed($loggedIn: Boolean! = false, $now: DateTime!, $first: Int, $after: String, $unreadOnly: Boolean, $listId: ID) {
    feed: bookmarksFeed(now: $now, first: $first, after: $after, unreadOnly: $unreadOnly, listId: $listId) {
      ...FeedPostConnection
    }
  }
${FEED_POST_CONNECTION_FRAGMENT}`;

export const SOURCE_FEED_QUERY = gql`
  query SourceFeed($loggedIn: Boolean! = false, $now: DateTime!, $first: Int, $after: String, $ranking: Ranking, $source: ID!) {
    feed: sourceFeed(now: $now, first: $first, after: $after, ranking: $ranking, source: $source) {
      ...FeedPostConnection
    }
  }
${FEED_POST_CONNECTION_FRAGMENT}`;

export const TAG_FEED_QUERY = gql`
  query TagFeed($loggedIn: Boolean! = false, $now: DateTime!, $first: Int, $after: String, $ranking: Ranking, $tag: String!) {
    feed: tagFeed(now: $now, first: $first, after: $after, ranking: $ranking, tag: $tag) {
      ...FeedPostConnection
    }
  }
${FEED_POST_CONNECTION_FRAGMENT}`;

export const SEARCH_POSTS_QUERY = gql`
  query SearchPosts($loggedIn: Boolean! = false, $now: DateTime!, $first: Int, $after: String, $query: String!) {
    feed: searchPosts(now: $now, first: $first, after: $after, query: $query) {
      ...FeedPostConnection
      query
    }
  }
${FEED_POST_CONNECTION_FRAGMENT}`;

export const UPVOTE_MUTATION = gql`
  mutation Upvote($id: ID!) {
    upvote(id: $id) {
      _
    }
  }`;

export const CANCEL_UPVOTE_MUTATION = gql`
  mutation CancelUpvote($id: ID!) {
    cancelUpvote(id: $id) {
      _
    }
  }`;

export const COMMENT_ON_POST_MUTATION = gql`
  mutation CommentOnPost($postId: ID!, $content: String!) {
    commentOnPost(postId: $postId, content: $content) {
      permalink
    }
  }`;
