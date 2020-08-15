import {
  getAbovePost,
  getBelowPost,
  getPreviousPost,
  getNextPost,
  getFirstPostOnFeed,
} from '@daily/components/src/common/domHelper';
import store from '../store';

export const validKeys = {
  h: 72,
  j: 74,
  k: 75,
  l: 76,
  '/': 191,
  b: 66,
  esc: 27,
};

const validKeysValues = Object.values(validKeys);

function navigateFeed(keyCode, currentElement, insaneMode) {
  if (keyCode === validKeys.h && !insaneMode) return getPreviousPost(currentElement);

  if (keyCode === validKeys.l && !insaneMode) return getNextPost(currentElement);

  if (keyCode === validKeys.j) return getBelowPost(currentElement, insaneMode);

  if (keyCode === validKeys.k) return getAbovePost(currentElement, insaneMode);

  return currentElement;
}

function triggerBookmark(article) {
  if (article.ad) return null;

  return article.$emit('bookmark', { post: article.post, bookmarked: !article.post.bookmarked });
}

function navigateDaily({ keyCode }) {
  if (validKeysValues.indexOf(keyCode) === -1) return null;

  const { daFeedRef, hoveredPost } = store.state.feed;

  const ref = daFeedRef();

  if (keyCode === validKeys.esc) return store.dispatch('feed/backToMainFeed');

  if (keyCode === validKeys['/']) return ref.$parent.enableSearch();

  if (keyCode === validKeys.b && hoveredPost) return triggerBookmark(hoveredPost);

  const { insaneMode } = store.state.ui;

  const foundElement = hoveredPost
    ? navigateFeed(keyCode, hoveredPost.$el, insaneMode)
    : getFirstPostOnFeed(insaneMode);

  let post = ref.$refs.posts.find(article => article.$el === foundElement);

  if (!post) {
    const nextPostAfterEmptyAdElement = getNextPost(foundElement, insaneMode);

    post = ref.$refs.posts.find(article => article.$el === nextPostAfterEmptyAdElement);
  }

  post.$el.getElementsByClassName('post__link')[0].focus();

  return store.commit('feed/setHoveredPost', post);
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
