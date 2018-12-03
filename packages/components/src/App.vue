<template>
  <div id="app">
    <Demo/>
  </div>
</template>

<script>
import Demo from './components/Demo.vue';

export default {
  name: 'app',
  components: {
    Demo,
  },
};
</script>

<style>
@import './styles/global.pcss';

html {
  background: var(--color-pepper-50);
}

body {
  margin: 16px;
}
</style>
