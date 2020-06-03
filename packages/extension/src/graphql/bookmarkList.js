import gql from 'graphql-tag';

export const CREATE_BOOKMARK_LIST_MUTATION = gql`
mutation CreateBookmarkList($name: String!) {
  createBookmarkList(name: $name) {
    id, name
  }
}`;

export const RENAME_BOOKMARK_LIST_MUTATION = gql`
mutation RenameBookmarkList($id: ID!, $name: String!) {
  renameBookmarkList(id: $id, name: $name) {
    id, name
  }
}`;

export const REMOVE_BOOKMARK_LIST_MUTATION = gql`
mutation RemoveBookmarkList($id: ID!) {
  removeBookmarkList(id: $id) {
    _
  }
}`;

export const BOOKMARK_LISTS_QUERY = gql`
query BookmarkLists {
  bookmarkLists {
    id, name
  }
}`;
