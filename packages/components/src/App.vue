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
  background: var(--theme-background-primary);
}

body {
  margin: 16px;
}
</style>
