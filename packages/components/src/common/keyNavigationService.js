import { getElementIndexFromSiblings } from './domHelper';
import store from '../../../extension/src/store';

export const validKeys = { h: 104, j: 106, k: 107, l: 108, '/': 47, b: 98 }

export function navigateDaily(feedComp, current, keyCode) {
  const posts = feedComp.$refs.posts;

  if (posts.length === 0) return;

  if (Object.values(validKeys).indexOf(keyCode) === -1) return false;

  if (keyCode === validKeys['/']) return feedComp.$parent.enableSearch();

  if (keyCode === validKeys.b && current) return triggerBookmark(current);

  const el = !current ? getTopLeftMostPostEl(posts) : getNewPostEl(keyCode, current.$el);

  const selectedPost = getPostByElement(posts, el);

  if (selectedPost === current) return selectedPost;

  hoverPost(selectedPost);

  return selectedPost;
}

function getTopLeftMostPostEl(posts) {
  const parent = posts[0].$el.parentElement;
  const insaneMode = store.state.ui.insaneMode;
  
  return (insaneMode ? parent : parent.parentElement.firstElementChild).firstElementChild;
}

function getNewPostEl(keyCode, currentElement) {
  if (keyCode === validKeys.h) return getLeftPost(currentElement);

  if (keyCode === validKeys.l) return getRightPost(currentElement);

  if (keyCode === validKeys.j) return getBelowPost(currentElement);

  if (keyCode === validKeys.k) return getAbovePost(currentElement);

  return currentElement;
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

function getPostByElement(posts, elementToFind) {
  return posts.find(post => post.$el === elementToFind);
}

function getPostIndexByElement(posts, elementToFind) {
  return posts.findIndex(post => post.$el === elementToFind);
}

function hoverPost(selectedPost) {
  const insaneMode = store.state.ui.insaneMode;
  const linkType = insaneMode ? 'insane__link' : 'card__link';
  
  selectedPost.$el.getElementsByClassName(linkType)[0].focus();
}

function triggerBookmark(post) {
  if (post.ad) return;

  return post.$emit("bookmark", { post: post.post, bookmarked: !post.post.bookmarked });
}

Object.freeze(validKeys);

export default {
  navigateDaily
}