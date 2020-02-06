import { getElementIndexFromSiblings } from '@daily/components/src/common/domHelper';
import store from '../store';

export const validKeys = { h: 104, j: 106, k: 107, l: 108, '/': 47, b: 98 }

function getPostByElement(posts, elementToFind) {
  return posts.find(post => post.$el === elementToFind);
}

function hoverPost(selectedPost) {
  const insaneMode = store.state.ui.insaneMode;
  const linkType = insaneMode ? 'insane__link' : 'card__link';
  
  selectedPost.$el.getElementsByClassName(linkType)[0].focus();
}

function getTopLeftMostPostEl(posts) {
  const parent = posts[0].$el.parentElement;
  const insaneMode = store.state.ui.insaneMode;
  
  return (insaneMode ? parent : parent.parentElement.firstElementChild).firstElementChild;
}

function getLeftPost(el) {
  const insaneMode = store.state.ui.insaneMode;
  if (!el.parentElement.previousElementSibling || insaneMode) return el;

  const index = getElementIndexFromSiblings(el);

  return el.parentElement.previousElementSibling.childNodes[index];
}

function getRightPost(el) {
  const insaneMode = store.state.ui.insaneMode;
  if (!el.parentElement.nextElementSibling || insaneMode) return el;

  const index = getElementIndexFromSiblings(el);

  return el.parentElement.nextElementSibling.childNodes[index];
}

function getAbovePost(element) {
  if (element.previousElementSibling === null) return element;

  return element.previousElementSibling;
}

function getBelowPost(element) {
  if (element.nextElementSibling === null) return element;

  return element.nextElementSibling;
}

function getNewPostEl(keyCode, currentElement) {
  if (keyCode === validKeys.h) return getLeftPost(currentElement);

  if (keyCode === validKeys.l) return getRightPost(currentElement);

  if (keyCode === validKeys.j) return getBelowPost(currentElement);

  if (keyCode === validKeys.k) return getAbovePost(currentElement);

  return currentElement;
}

function triggerBookmark(post) {
  if (post.ad) return null;

  return post.$emit("bookmark", { post: post.post, bookmarked: !post.post.bookmarked });
}

export function navigateDaily(feedComp, current, keyCode) {
  const posts = feedComp.$refs.posts;
  const postOrAdProp = current && (current.post || current.ad);
  const item = posts.find(article => [article.ad, article.post].indexOf(postOrAdProp) !== -1);

  if (posts.length === 0) return null;

  if (Object.values(validKeys).indexOf(keyCode) === -1) return null;

  if (keyCode === validKeys['/']) return feedComp.$parent.enableSearch();

  if (keyCode === validKeys.b && item) return triggerBookmark(item);

  const el = !item ? getTopLeftMostPostEl(posts) : getNewPostEl(keyCode, item.$el);

  const selectedPost = getPostByElement(posts, el);

  if (selectedPost === item) return selectedPost;

  hoverPost(selectedPost);

  return selectedPost;
}

Object.freeze(validKeys);

export default {
  navigateDaily
}