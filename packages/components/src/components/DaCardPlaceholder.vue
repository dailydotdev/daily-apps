<template>
  <div class="post post-ph card">
    <div class="card__header card__hmargin post__vmargin">
      <div class="post__rounded-image placeholder"/>
    </div>
    <div class="card-ph__container card__hmargin">
      <div class="post__vmargin post-ph__text placeholder"></div>
      <div class="post__vmargin post-ph__text placeholder"></div>
      <div
        class="post__vmargin post-ph__text card-ph__text-medium placeholder"></div>
    </div>
    <div class="card__image placeholder"></div>
    <div class="post__vmargin card__hmargin post-ph__text card-ph__text-small placeholder">
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaCardPlaceholder',
};
</script>

<style>
.card.post-ph {
  & .card__image {
    margin-top: 24px;
    margin-bottom: 4px;
  }

  & .post-ph__text {
    width: 100%;

    &.card-ph__text-medium {
      width: 80%;
    }

    &.card-ph__text-small {
      width: 32%;
    }
  }
}

.card-ph__container {
  display: flex;
  flex-direction: column;
}
</style>
