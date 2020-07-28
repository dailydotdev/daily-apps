export function getPostByElement(posts, elementToFind) {
  return posts.find(post => post.$el === elementToFind);
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

  while (!result && child) {
    child = child.nextElementSibling;
    result = getPostByElement(posts, child);
  }

  return child;
}

export function hoverPost(selectedPost) {
  selectedPost.$el.getElementsByClassName('post__link')[0].focus();
}
