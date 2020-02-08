import store from '../store';
import {
  getPostByElement,
  getAbovePost,
  getBelowPost,
  getLeftPost,
  getRightPost,
  getTopLeftMostPostEl,
  hoverPost
} from '@daily/components/src/common/domHelper';

export const validKeys = { h: 104,
  j: 106, k: 107, l: 108, '/': 47, b: 98 }

function getNewPostEl(keyCode, currentElement, insaneMode) {
  if (keyCode === validKeys.h && !insaneMode) return getLeftPost(currentElement);

  if (keyCode === validKeys.l && !insaneMode) return getRightPost(currentElement);

  if (keyCode === validKeys.j) return getBelowPost(currentElement);

  if (keyCode === validKeys.k) return getAbovePost(currentElement);

  return currentElement;
}

function triggerBookmark(post) {
  if (post.ad) return null;

  return post.$emit("bookmark", { post: post.post, bookmarked: !post.post.bookmarked });
}

function getCurrentPost(posts, current) {
  if (!current) return null;

  const postOrAdProp = current.post || current.ad;
  
  return posts.find(article => [article.ad, article.post].indexOf(postOrAdProp) !== -1);
}

export function navigateDaily(feedComp, current, keyCode) {
  const posts = feedComp.$refs.posts;
  const insaneMode = store.state.ui.insaneMode;

  if (posts.length === 0) return null;

  const item = getCurrentPost(posts, current);

  if (Object.values(validKeys).indexOf(keyCode) === -1) return null;

  if (keyCode === validKeys['/']) return feedComp.$parent.enableSearch();

  if (keyCode === validKeys.b && item) return triggerBookmark(item);

  const element = !item
    ? getTopLeftMostPostEl(posts, insaneMode)
    : getNewPostEl(keyCode, item.$el, insaneMode);

  const selectedPost = getPostByElement(posts, element);

  if (selectedPost === item) return selectedPost;

  hoverPost(selectedPost, insaneMode);

  return selectedPost;
}

Object.freeze(validKeys);

export default {
  navigateDaily
}
