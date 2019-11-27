<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import 'focus-visible';

export default {};
</script>

<style>
@import '../node_modules/@daily/components/src/styles/global.pcss';

html {
  background: var(--theme-background-primary);
}

body {
  margin: 0;
  overflow-y: scroll;
}

html, body {
  height: 100%;
}

a {
  text-decoration: none;
}

#app {
  height: 100%;
}

.page {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 100%;
  flex-direction: column;
  justify-content: stretch;
  color: var(--theme-primary);
}
</style>
