const addBookmarksMutation = `
    mutation AddBookmarks($ids: [ID!]!) {
        ids: SetBookmarks(ids: $ids)
    }
`;

const removeBookmarkMutation = `
    mutation ($id: ID!) {
        id: RemoveBookmark(id: $id)
    }
`;

const hidePostMutation = `
    mutation ($id: ID!) {
        id: HidePost(id: $id)
    }
`;

export default {
    addBookmarksMutation,
    removeBookmarkMutation,
    hidePostMutation,
};
