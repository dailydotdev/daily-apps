import { ratioToSize, reviveJSON, dateReviver } from '@daily/services';

const redirectLink = post => `${process.env.VUE_APP_API_URL}/r/${post.id}`;

// eslint-disable-next-line import/prefer-default-export
export const mapPost = (post) => {
  const newPost = {
    ...ratioToSize(reviveJSON(post, dateReviver)),
    url: redirectLink(post),
    publication: post.source,
  };
  delete newPost.source;
  return newPost;
};
