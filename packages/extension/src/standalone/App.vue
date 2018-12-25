<template>
  <div>
    <DaHeader></DaHeader>
  </div>
</template>

<script>
import DaHeader from '../components/DaHeader.vue';

export default {
  components: { DaHeader },
};
</script>

<style>
@import '../../../../node_modules/@daily/components/src/styles/global.pcss';

html {
  background: var(--theme-background-primary);
}

body {
  margin: 0;
}

.separator {
  display: block;
  border-left: 1px dotted var(--theme-separator);
  height: 32px;
  width: 1px;
}
</style>
<style scoped>
div {
  color: var(--theme-primary);
}
</style>
