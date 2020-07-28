<template>
  <div class="post post-ph insane">
    <div class="insane__sub">
      <div class="post__vmargin post__rounded-image placeholder"></div>
    </div>
    <div class="insane__main">
      <div class="post__vmargin post-ph__text placeholder"></div>
      <div class="post__vmargin post-ph__text card-ph__text-medium placeholder"></div>
      <div
        class="post__vmargin post-ph__text card-ph__text-small  placeholder"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaInsanePlaceholder',
};
</script>

<style>
.insane.post-ph {
  padding-top: 8px;
  padding-right: 8px;

  & .post-ph__text {
    width: 95%;

    &.card-ph__text-medium {
      width: 73%;
    }

    &.card-ph__text-small {
      width: 13%;
    }
  }
}
</style>
