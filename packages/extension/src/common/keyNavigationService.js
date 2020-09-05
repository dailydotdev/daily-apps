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

/**
 * Handles which `domHelper` to trigger based on the valid `keyCode` passed as first parameter.
 * <pre> Returns an array of which `index` `0` is the actual `post` or `ad` `Vue.Component` and `index` `1` as its actual index from its siblings in the DOM Element for `feed` 
 * @param  {number} code - `keyCode` property from `keydown` event
 * @param  {HTMLElement} element - the currently selected `post` Component's element
 * @param  {number} index - the current index of the `el` parameter from its siblings
 * @param  {boolean} insaneMode - `state` property for display mode
 */
function navigateFeed(code, element, index, insaneMode) {
  if (code === validKeys.h && !insaneMode) return getPreviousPost(element, index);

  if (code === validKeys.l && !insaneMode) return getNextPost(element, index);

  if (code === validKeys.j) return getBelowPost(element, index, insaneMode);

  if (code === validKeys.k) return getAbovePost(element, index, insaneMode);

  return [element, index];
}

/**
 * Returns an array of which `index` `0` is the actual `post` or `ad` `Vue.Component` and `index` `1` as its actual index from its siblings in the DOM Element for `feed`
 * <pre>If the first item on `feed` element is still being loaded (specifically the `ad`) and the feat has been triggered, it will fetch the next `post` `Vue.Component`
 * @param  {number} keyCode - `keyCode` property from `keydown` event
 * @param  {Vue.Component[]} posts - `ref` from Feed Component
 * @param  {[Vue.Component, number]} [hoveredPost
 * @param  {number} currentIndex] - `state` property that holds the current `hoveredPost` Component and its `index` from DOM
 * @param  {boolean} insaneMode - `state` property for display mode
 */
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
