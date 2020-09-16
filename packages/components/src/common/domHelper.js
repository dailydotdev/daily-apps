/**
 * Returns an `HTMLElement` of the `feed` Component
 * @param  {boolean} [insaneMode=false] - `state` property for display mode
 */
export function getFeedElement(insaneMode = false) {
  const feedClass = insaneMode ? 'feed__insane' : 'feed__cards';

  return document.getElementsByClassName(feedClass)[0];
}

/**
 * Returns the value for `cards` per row to identify the jump in `index`
 * when navigating `above` or `below` post
 */
export function getCardsPerRow() {
  const feed = getFeedElement();

  if (!feed) return 0;

  let previousTop = 0;
  let cardsPerRow = 0;

  for (let i = 0; i < feed.childNodes.length; i += 1) {
    const currentTop = feed.childNodes[i].offsetTop;

    if (previousTop !== currentTop && previousTop > 0) return cardsPerRow + 1;

    if (previousTop === currentTop) cardsPerRow += 1;

    previousTop = currentTop;
  }

  return 0;
}

/**
 * Returns the `previousElementSibling` of the currently `hoveredPost` `element`.
 * <pre> If none - return the currently selected values</pre>
 * <pre> If `insaneMode` is true - immediately return the `previousElementSibling`</pre>
 * <pre> If `offsetTop` of the `previousElementSibling` is not equal -
 * it indicates they're not on the same row -
 * leftmost post is the currently selected one</pre>
 * @param  {HTMLElement} el - the currently selected `post` Component's element
 * @param  {number} index - the current index of the `el` parameter from its siblings
 * @param  {boolean} [insaneMode=false] - `state` property for display mode
 */
export function getPreviousPost(el, index, insaneMode = false) {
  if (!el.previousElementSibling) return [el, index];

  if (insaneMode) return [el.previousElementSibling, index - 1];

  if (el.previousElementSibling.offsetTop !== el.offsetTop) return [el, index];

  return [el.previousElementSibling, index - 1];
}

/**
 * Returns the `nextElementSibling` of the currently `hoveredPost` `element`.
 * <pre> If none - return the currently selected values</pre>
 * <pre> If `insaneMode` is true - immediately return the `nextElementSibling`</pre>
 * <pre> If `offsetTop` of the `nextElementSibling` is not equal -
 * it indicates they're not on the same row -
 * rightmost post is the currently selected one</pre>
 * @param  {HTMLElement} el - the currently selected `post` Component's element
 * @param  {number} index - the current index of the `el` parameter from its siblings
 * @param  {boolean} [insaneMode=false] - `state` property for display mode
 */
export function getNextPost(el, index, insaneMode = false) {
  if (!el.nextElementSibling) return [el, index];

  if (insaneMode) return [el.nextElementSibling, index + 1];

  if (el.nextElementSibling.offsetTop !== el.offsetTop) return [el, index];

  return [el.nextElementSibling, index + 1];
}

/**
 * Returns the `post` `element` directly below the currently selected one.
 * <pre>If the sum of current index and cards per row exceeds the length,
 * this indicates there's no item beneath</pre>
 * @param  {HTMLElement} el - the currently selected `post` Component's element
 * @param  {number} index - the current index of the `el` parameter from its siblings
 * @param  {boolean} [insaneMode=false] - `state` property for display mode
 */
export function getBelowPost(el, index, insaneMode = false) {
  if (insaneMode) return getNextPost(el, index, insaneMode);

  const cardsPerRow = getCardsPerRow();
  const feed = getFeedElement(insaneMode);

  if (cardsPerRow + index >= feed.childNodes.length) return [el, index];

  return [feed.childNodes[index + cardsPerRow], index + cardsPerRow];
}

/**
 * Returns the `post` `element` directly above the currently selected one.
 * <pre>If the difference of current index and cards per row falls below 0,
 * this indicates there's no item below as array indexes start at 0</pre>
 * @param  {HTMLElement} el - the currently selected `post` Component's element
 * @param  {number} index - the current index of the `el` parameter from its siblings
 * @param  {boolean} [insaneMode=false] - `state` property for display mode
 */
export function getAbovePost(el, index, insaneMode = false) {
  if (insaneMode) return getPreviousPost(el, index, insaneMode);

  const cardsPerRow = getCardsPerRow();
  const feed = getFeedElement(insaneMode);

  if (index - cardsPerRow < 0) return [el, index];

  return [feed.childNodes[index - cardsPerRow], index - cardsPerRow];
}

/**
 * Returns the `firstElementChild` of the `feed` Component
 * @param  {boolean} [insaneMode=false] - `state` property for display mode
 */
export function getFirstPostOnFeed(insaneMode = false) {
  const feed = getFeedElement(insaneMode);

  if (!feed) return null;

  return [feed.firstElementChild, 0];
}
