import {
  getAbovePost,
  getBelowPost,
  getPreviousPost,
  getNextPost,
  getFirstPostOnFeed,
} from '@daily/components/src/common/domHelper';

export const validKeys = {
  h: 72,
  j: 74,
  k: 75,
  l: 76,
  '/': 191,
  b: 66,
  esc: 27,
};

export const validKeysValues = Object.values(validKeys);

function navigateFeed(keyCode, currentElement, insaneMode) {
  if (keyCode === validKeys.h && !insaneMode) return getPreviousPost(currentElement);

  if (keyCode === validKeys.l && !insaneMode) return getNextPost(currentElement);

  if (keyCode === validKeys.j) return getBelowPost(currentElement, insaneMode);

  if (keyCode === validKeys.k) return getAbovePost(currentElement, insaneMode);

  return currentElement;
}

export function navigateDaily(keyCode, posts, hoveredPost, insaneMode) {
  const foundElement = hoveredPost
    ? navigateFeed(keyCode, hoveredPost.$el, insaneMode)
    : getFirstPostOnFeed(insaneMode);

  const post = posts.find(article => article.$el === foundElement);

  if (post) return post;

  const nextPostAfterEmptyAdElement = getNextPost(foundElement, insaneMode);

  return posts.find(article => article.$el === nextPostAfterEmptyAdElement);
}

export function bindEvent(event, callback) {
  window.addEventListener(event, callback);
}

export function unbindEvent(event, callback) {
  window.removeEventListener(event, callback);
}

Object.freeze(validKeys);

export default {
  navigate: navigateDaily,
  bind: bindEvent,
  unbind: unbindEvent,
  validKeys,
  validKeysValues,
};
