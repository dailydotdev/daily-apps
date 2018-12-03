<template>
  <div class="hello">
    <h1>Daily Components Demo</h1>
    <section>
      <h3>Icons</h3>
      <div class="icons">
        <div v-for="(item, index) in icons" :key="index" class="icons_container">
          <svgicon :icon="item"/>
          <div class="icons_container__text micro1">{{item}}</div>
        </div>
      </div>
    </section>
    <section>
      <h3>Switch</h3>
      <div class="switches">
        <DaSwitch icon="bookmark"></DaSwitch>
        <DaSwitch icon="line" label="With label"></DaSwitch>
        <DaSwitch icon="moon" label="Checked" checked></DaSwitch>
      </div>
    </section>
  </div>
</template>

<script>
import DaSwitch from './DaSwitch.vue';

const requireIcons = require.context('../../icons', false, /.js$/);
const icons = requireIcons.keys().filter(r => r !== './index.js');
icons.forEach(requireIcons);

export default {
  name: 'Demo',
  components: { DaSwitch },
  created() {
    this.icons = icons.map(r => r.substr(2, r.length - 5));
  },
};
</script>

<style scoped>
h1 {
  color: var(--color-salt-90);
}

h3 {
  color: var(--color-salt-10);
}

.icons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: -16px;
}

.icons_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px;

  & .svg-icon, & .icon-selector {
    color: var(--color-salt-90);
  }
}

.icons_container__text {
  color: var(--color-salt-90);
}

.switches {
  display: flex;
  flex-direction: column;
}

.switch {
  margin: 8px 0;
}
</style>
