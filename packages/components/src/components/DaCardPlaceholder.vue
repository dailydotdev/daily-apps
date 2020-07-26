<template>
  <div class="card card-ph">
    <div class="card__header card__hmargin card__vmargin">
      <div class="card__rounded-image placeholder"/>
    </div>
    <div class="card-ph__container card__hmargin">
      <div class="card__vmargin card-ph__text placeholder"></div>
      <div class="card__vmargin card-ph__text placeholder"></div>
      <div
        class="card__vmargin card-ph__text card-ph__text-medium placeholder"></div>
    </div>
    <div class="card__image placeholder"></div>
    <div class="card__vmargin card__hmargin card-ph__text card-ph__text-small placeholder">
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaCardPlaceholder',
};
</script>

<style>
.card.card-ph {
  background: var(--theme-background-secondary);
  border: none;
  box-shadow: none;

  &:hover, &.hover {
    box-shadow: none;
  }

  & .card__image {
    margin-top: 24px;
    margin-bottom: 4px;
  }
}

.card-ph__text {
  width: 100%;
  height: 12px;
  border-radius: 12px;

  &.card-ph__text-medium {
    width: 80%;
  }

  &.card-ph__text-small {
    width: 32%;
    height: 16px;
  }
}

.card-ph__container {
  display: flex;
  flex-direction: column;
}
</style>
