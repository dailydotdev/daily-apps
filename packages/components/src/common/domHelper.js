export function getCardsPerRow() {
  const feed = document.getElementsByClassName("feed__cards")[0];

  if (!feed) return 0;

  let previousTop = 0;
  let cardsPerRow = 0;

  for (let i = 0; i < feed.childNodes.length; i++) {
    const currentTop = feed.childNodes[i].offsetTop;

    if (previousTop !== currentTop && previousTop > 0) return cardsPerRow + 1;

    if (previousTop === currentTop) cardsPerRow++;

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

export function getLeftPost(el) {
  if (!el.previousElementSibling) return el;

  if (el.previousElementSibling.getBoundingClientRect().y !== el.getBoundingClientRect().y)
    return el;

  return el.previousElementSibling;
}

export function getRightPost(el) {
  if (!el.nextElementSibling) return el;

  if (el.nextElementSibling.getBoundingClientRect().y !== el.getBoundingClientRect().y) return el;

  return el.nextElementSibling;
}

export function getBelowPost(el) {
  const cardsPerRow = getCardsPerRow();
  const index = getElementIndexFromSiblings(el);
  const feed = document.getElementsByClassName("feed__cards")[0];

  if (cardsPerRow + index >= feed.childNodes.length) return el;

  return feed.childNodes[cardsPerRow + index];
}

export function getAbovePost(el) {
  const cardsPerRow = getCardsPerRow();
  const index = getElementIndexFromSiblings(el);
  const feed = document.getElementsByClassName("feed__cards")[0];

  if (index - cardsPerRow < 0) return el;

  return feed.childNodes[index - cardsPerRow];
}

export function getFirstPostOnFeed() {
  const feed = document.getElementsByClassName("feed__cards")[0];

  if (!feed) return null;

  return feed.firstElementChild;
}
