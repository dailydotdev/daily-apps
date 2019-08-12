<template>
  <div class="insane insane--ph">
    <div class="ph-text"></div>
    <div class="ph-text"></div>
  </div>
</template>

<script>
export default {
  name: 'DaInsandePlacholder',
};
</script>

<style>
.insane.insane--ph {
  background: var(--theme-background-secondary);
  justify-content: space-between;

  & .ph-text {
    height: 16px;
    border-radius: 4px;

    &:first-child {
      width: 24.6%;
    }

    &:last-child {
      width: 8.2%;
    }
  }
}
</style>
