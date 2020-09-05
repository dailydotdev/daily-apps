export function getFeedElement(insaneMode = false) {
  const feedClass = insaneMode ? "feed__insane" : "feed__cards";

  return document.getElementsByClassName(feedClass)[0];
}

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

export function getPreviousPost(el, index, insaneMode = false) {
  if (!el.previousElementSibling) return [el, index];

  if (insaneMode) return [el.previousElementSibling, index - 1];

  if (el.previousElementSibling.offsetTop !== el.offsetTop) return [el, index];

  return [el.previousElementSibling, index - 1];
}

export function getNextPost(el, index, insaneMode = false) {
  if (!el.nextElementSibling) return [el, index];

  if (insaneMode) return [el.nextElementSibling, index + 1];

  if (el.nextElementSibling.offsetTop !== el.offsetTop) return [el, index];

  return [el.nextElementSibling, index + 1];
}

export function getBelowPost(el, index, insaneMode) {
  if (insaneMode) return getNextPost(el, index, insaneMode);

  const cardsPerRow = getCardsPerRow();
  const feed = getFeedElement(insaneMode);

  if (cardsPerRow + index >= feed.childNodes.length) return [el, index];

  return [feed.childNodes[index + cardsPerRow], index + cardsPerRow];
}

export function getAbovePost(el, index, insaneMode) {
  if (insaneMode) return getPreviousPost(el, index, insaneMode);

  const cardsPerRow = getCardsPerRow();
  const feed = getFeedElement(insaneMode);

  if (index - cardsPerRow < 0) return [el, index];

  return [feed.childNodes[index - cardsPerRow], index - cardsPerRow];
}

export function getFirstPostOnFeed(insaneMode) {
  const feed = getFeedElement(insaneMode);

  if (!feed) return null;

  return [feed.firstElementChild, 0];
}