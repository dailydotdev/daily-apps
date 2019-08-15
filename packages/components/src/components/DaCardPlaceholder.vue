<template>
  <div class="card-ph">
    <div class="card-ph__link">
      <div class="card-ph__image"></div>
      <div class="card-ph__content">
        <div class="card-ph__wrapper">
          <div class="ph-text"></div>
          <div class="ph-text"></div>
        </div>
      </div>
    </div>
    <div class="card-ph__footer">
      <div class="ph-text"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaCardPlaceholder',
};
</script>

<style>
.card-ph {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  contain: layout paint;

  & .ph-text {
    height: 14px;
    border-radius: 4px;
  }
}

.card-ph__link {
  position: relative;
  flex: 1;

  &:before {
    content: '';
    display: block;
    padding-top: 89.36%;
  }
}

.card-ph__image, .card-ph__content {
  position: absolute;
  left: 0;
  width: 100%;
}

.card-ph__image {
  top: 0;
  height: 57.14%;
  background: linear-gradient(180deg, var(--theme-background-secondary) 0%,
  var(--theme-background-primary) 100%);
}

.card-ph__content {
  bottom: 0;
  border-radius: 8px 8px 0 0;
  z-index: 1;

  &:before {
    content: '';
    display: block;
    padding-top: 44%;
  }

  & .ph-text {
    &:last-child {
      margin: 14px 16px;
    }
  }
}

.card-ph__wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 24px;
  justify-content: stretch;
}

.card-ph__footer {
  display: flex;
  height: 48px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  & .ph-text {
    width: 72px;
    margin-bottom: 14px;
  }
}

.card-ph__content, .card-ph__footer {
  background: var(--theme-background-secondary);
}
</style>
