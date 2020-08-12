import {
  getAbovePost,
  getBelowPost,
  getLeftPost,
  getRightPost,
  getFirstPostOnFeed
} from "@daily/components/src/common/domHelper";
import store from "../store";

export const validKeys = {
  h: 72,
  j: 74,
  k: 75,
  l: 76,
  "/": 191,
  b: 66,
  esc: 27
};

const validKeysValues = Object.values(validKeys);

function navigateFeed(keyCode, currentElement) {
  const insaneMode = store.state.ui.insaneMode;

  if (keyCode === validKeys.h && !insaneMode) return getLeftPost(currentElement);

  if (keyCode === validKeys.l && !insaneMode) return getRightPost(currentElement);

  if (keyCode === validKeys.j && insaneMode) return getBelowPost(currentElement);

  if (keyCode === validKeys.k && insaneMode) return getAbovePost(currentElement);

  return currentElement;
}

function triggerBookmark(post) {
  if (post.ad) return null;

  return post.$emit("bookmark", { post: post.post, bookmarked: !post.post.bookmarked });
}

function findPostInPosts(posts, toFind) {
  if (!toFind) return null;

  const postOrAdProp = toFind.post || toFind.ad;

  return posts.find(article => [article.ad, article.post].indexOf(postOrAdProp) !== -1);
}

function navigateDaily({ keyCode }) {
  if (Object.values(validKeys).indexOf(keyCode) === -1) return null;

  const { daFeedRef, hoveredPost } = store.state.feed;

  const ref = daFeedRef();

  if (keyCode === validKeys.esc) return store.dispatch("feed/backToMainFeed");

  if (keyCode === validKeys["/"]) return ref.$search.enableSearch();

  const currentPost = findPostInPosts(ref.$refs.posts, hoveredPost);

  if (keyCode === validKeys.b && currentPost) return triggerBookmark(currentPost);

  const foundElement = currentPost ? navigateFeed(keyCode, currentPost.$el) : getFirstPostOnFeed();

  const post = ref.$refs.posts.find(post => post.$el === foundElement);

  post.$el.getElementsByClassName("post__link")[0].focus();

  return store.commit("feed/setHoveredPost", post);
}

export function enableKeyBindings() {
  window.addEventListener("keydown", navigateDaily);
}

export function disableKeyBindings() {
  window.removeEventListener("keydown", navigateDaily);
}

Object.freeze(validKeys);

export default {
  enableKeyBindings,
  disableKeyBindings
};
