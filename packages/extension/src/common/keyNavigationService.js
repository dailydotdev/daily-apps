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

function navigateFeed(code, element, index, insaneMode) {
  if (code === validKeys.h && !insaneMode) return getPreviousPost(element, index);

  if (code === validKeys.l && !insaneMode) return getNextPost(element, index);

  if (code === validKeys.j) return getBelowPost(element, index, insaneMode);

  if (code === validKeys.k) return getAbovePost(element, index, insaneMode);

  return [element, index];
}

export function navigateDaily(keyCode, posts, [hoveredPost, currentIndex], insaneMode) {
  const [foundElement, index] = hoveredPost
    ? navigateFeed(keyCode, hoveredPost.$el, currentIndex, insaneMode)
    : getFirstPostOnFeed(insaneMode);

  const post = posts.find(article => article.$el === foundElement);

  if (post) return [post, index];

  const [nextPostAfterEmptyAdElement, i] = getNextPost(foundElement, currentIndex, insaneMode);

  return [posts.find(article => article.$el === nextPostAfterEmptyAdElement), i];
}

Object.freeze(validKeys);
Object.freeze(validKeysValues);

export default {
  navigate: navigateDaily,
  validKeys,
  validKeysValues,
};
