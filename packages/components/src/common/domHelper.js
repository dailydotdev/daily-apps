export function getPostByElement(posts, elementToFind) {
  return posts.find(post => post.$el === elementToFind);
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
  if (!el.parentElement.previousElementSibling) return el;

  const index = getElementIndexFromSiblings(el);

  return el.parentElement.previousElementSibling.childNodes[index];
}

export function getRightPost(el) {
  if (!el.parentElement.nextElementSibling) return el;

  const index = getElementIndexFromSiblings(el);

  return el.parentElement.nextElementSibling.childNodes[index];
}

export function getBelowPost(el) {
  if (el.nextElementSibling === null) return el;

  return el.nextElementSibling;
}

export function getAbovePost(el) {
  if (el.previousElementSibling === null) return el;

  return el.previousElementSibling;
}

export function getTopLeftMostPostEl(posts, insaneMode) {
  const parent = posts[0].$el.parentElement;

  let child = (insaneMode ? parent : parent.parentElement.firstElementChild).firstElementChild;
  let result = getPostByElement(posts, child);

  while(!result && child) {
    child = child.nextElementSibling;
    result = getPostByElement(posts, child);
  }

  return child;
}

export function hoverPost(selectedPost) {
  selectedPost.$el.getElementsByClassName(`post__link`)[0].focus();
}

export default {
  getPostByElement,
  getElementIndexFromSiblings,
  getLeftPost,
  getRightPost,
  getBelowPost,
  getAbovePost,
  getTopLeftMostPostEl,
  hoverPost
}
