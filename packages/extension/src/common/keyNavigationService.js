import {
  getPostByElement,
  getAbovePost,
  getBelowPost,
  getLeftPost,
  getRightPost,
  getTopLeftMostPostEl,
  hoverPost,
} from '@daily/components/src/common/domHelper';
import store from '../store';

export const validKeys = {
  h: 104,
  j: 106,
  k: 107,
  l: 108,
  '/': 47,
  b: 98,
};

function getNewPostEl(keyCode, currentElement, insaneMode) {
  if (keyCode === validKeys.h && !insaneMode) return getLeftPost(currentElement);

  if (keyCode === validKeys.l && !insaneMode) return getRightPost(currentElement);

  if (keyCode === validKeys.j) return getBelowPost(currentElement);

  if (keyCode === validKeys.k) return getAbovePost(currentElement);

  return currentElement;
}

function triggerBookmark(post) {
  if (post.ad) return null;

  return post.$emit('bookmark', { post: post.post, bookmarked: !post.post.bookmarked });
}

function getCurrentPost(posts, current) {
  if (!current) return null;

  const postOrAdProp = current.post || current.ad;

  return posts.find(article => [article.ad, article.post].indexOf(postOrAdProp) !== -1);
}

function navigate(keyCode, posts, enableSearch, { current, insaneMode }) {
  if (posts.length === 0) return null;

  const item = getCurrentPost(posts, current);

  if (Object.values(validKeys).indexOf(keyCode) === -1) return null;

  if (keyCode === validKeys['/']) return enableSearch();

  if (keyCode === validKeys.b && item) return triggerBookmark(item);

  const element = !item
    ? getTopLeftMostPostEl(posts, insaneMode)
    : getNewPostEl(keyCode, item.$el, insaneMode);

  const selectedPost = getPostByElement(posts, element);

  if (selectedPost === item) return selectedPost;

  hoverPost(selectedPost);

  return selectedPost;
}

function navigateDaily({keyCode}) {
  const { daFeedRef, hoveredPost } = store.state.feed;
  const options = { insaneMode: daFeedRef.insaneMode, current: hoveredPost };
  const newHoveredPost = navigate(
        keyCode,
        daFeedRef.$refs.posts,
        daFeedRef.$parent.enableSearch,
        options
      );

  store.commit('feed/setHoveredPost', newHoveredPost);
}

export function enableKeyBindings() {
  window.addEventListener('keypress', navigateDaily);
}

export function disableKeyBindings() {
  window.removeEventListener('keypress', navigateDaily);
}

Object.freeze(validKeys);

export default {
  enableKeyBindings,
  disableKeyBindings
}
