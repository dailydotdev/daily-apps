import gql from 'graphql-tag';

export const ADD_BOOKMARKS_MUTATION = gql`
  mutation AddBookmarks($data: AddBookmarkInput!) {
    addBookmarks(data: $data) {
      _
    }
  }`;

export const ADD_BOOKMARK_TO_LIST_MUTATION = gql`
  mutation AddBookmarkToList($id: ID!, $listId: ID) {
    addBookmarkToList(id: $id, listId: $listId) {
      _
    }
  }`;

export const REMOVE_BOOKMARK_MUTATION = gql`
  mutation RemoveBookmark($id: ID!) {
    removeBookmark(id: $id) {
      _
    }
  }`;
