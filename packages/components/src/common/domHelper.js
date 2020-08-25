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

export function getElementIndexFromSiblings(targetElement) {
  let index = 0;
  let element = targetElement.previousElementSibling;
  while (element !== null) {
    element = element.previousElementSibling;
    index += 1;
  }

  return index;
}

export function getPreviousPost(el, insaneMode = false) {
  if (!el.previousElementSibling) return el;

  if (insaneMode) return el.previousElementSibling;

  if (el.previousElementSibling.offsetTop !== el.offsetTop) return el;

  return el.previousElementSibling;
}

export function getNextPost(el, insaneMode = false) {
  if (!el.nextElementSibling) return el;

  if (insaneMode) return el.nextElementSibling;

  if (el.nextElementSibling.offsetTop !== el.offsetTop) return el;

  return el.nextElementSibling;
}

export function getBelowPost(el, insaneMode) {
  if (insaneMode) return getNextPost(el, insaneMode);

  const cardsPerRow = getCardsPerRow();
  const index = getElementIndexFromSiblings(el);
  const feed = getFeedElement(insaneMode);

  if (cardsPerRow + index >= feed.childNodes.length) return el;

  return feed.childNodes[cardsPerRow + index];
}

export function getAbovePost(el, insaneMode) {
  if (insaneMode) return getPreviousPost(el, insaneMode);

  const cardsPerRow = getCardsPerRow();
  const index = getElementIndexFromSiblings(el);
  const feed = getFeedElement(insaneMode);

  if (index - cardsPerRow < 0) return el;

  return feed.childNodes[index - cardsPerRow];
}

export function getFirstPostOnFeed(insaneMode) {
  const feed = getFeedElement(insaneMode);

  if (!feed) return null;

  return feed.firstElementChild;
}
