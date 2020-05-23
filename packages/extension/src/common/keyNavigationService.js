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
  esc: 27
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

function navigate(keyCode, posts, search, { current, insaneMode }) {
  if (keyCode === validKeys.esc) return search.clear();

  if (posts.length === 0) return null;

  const item = getCurrentPost(posts, current);

  if (Object.values(validKeys).indexOf(keyCode) === -1) return null;

  if (keyCode === validKeys['/']) return search.enable();

  if (keyCode === validKeys.b && item) return triggerBookmark(item);

  const element = !item
    ? getTopLeftMostPostEl(posts, insaneMode)
    : getNewPostEl(keyCode, item.$el, insaneMode);

  const selectedPost = getPostByElement(posts, element);

  if (selectedPost === item) return selectedPost;

  hoverPost(selectedPost);

  return selectedPost;
}

const clearSearch = (daHome) => {
  daHome.clearSearch();
  daHome.onSearchSubmit();
}

function navigateDaily({ keyCode }) {
  const { daFeedRef, hoveredPost } = store.state.feed;
  const parent = daFeedRef.$parent;
  const search = { enable: parent.enableSearch, clear: () => clearSearch(parent) }
  const options = { insaneMode: daFeedRef.insaneMode, current: hoveredPost };
  const newHoveredPost = navigate(
    keyCode,
    daFeedRef.$refs.posts,
    search,
    options,
  );

  store.commit('feed/setHoveredPost', newHoveredPost);
}

export function enableKeyBindings() {
  window.addEventListener('keydown', navigateDaily);
}

export function disableKeyBindings() {
  window.removeEventListener('keydown', navigateDaily);
}

Object.freeze(validKeys);

export default {
  enableKeyBindings,
  disableKeyBindings,
};
