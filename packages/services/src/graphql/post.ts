const hidePostMutation = `
    mutation ($id: ID!) {
        id: HidePost(id: $id)
    }
`;

export default {
    hidePostMutation,
};
