<template>
  <div>
    <DaSwitch icon="bookmark"></DaSwitch>
  </div>
</template>

<script>
import DaSwitch from '@daily/components/src/components/DaSwitch.vue';

export default {
  components: { DaSwitch },
  data() {
    return {};
  },

  mounted() {
    import('@daily/components/icons/bookmark');
  },
};
</script>

<style>
@import '../../../../node_modules/@daily/components/src/styles/global.pcss';

html {
  background: var(--theme-background-primary);
}
</style>
<style scoped>
div {
  color: var(--theme-primary);
}
</style>
