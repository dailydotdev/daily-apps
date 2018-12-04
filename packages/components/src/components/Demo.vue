<template>
  <div class="demo">
    <h1>
      <svgicon icon="logo" class="title__icon"/>
      Daily Components Demo
    </h1>
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
      <h3>Logos</h3>
      <div class="icons">
        <div v-for="(item, index) in logos" :key="index" class="icons_container">
          <img :src="`/logos/${item}.svg`"/>
          <div class="icons_container__text micro1">{{item}}</div>
        </div>
      </div>
    </section>
    <section>
      <h3>Switch</h3>
      <div class="switches">
        <DaSwitch icon="bookmark"></DaSwitch>
        <DaSwitch icon="link" label="With label"></DaSwitch>
        <DaSwitch icon="moon" label="Checked" checked></DaSwitch>
      </div>
    </section>
    <section>
      <h3>Icon Toggle</h3>
      <DaIconToggle pressed-icon="sun" icon="moon"/>
    </section>
    <section>
      <h3>Spinner</h3>
      <DaSpinner/>
    </section>
  </div>
</template>

<script>
import DaSwitch from './DaSwitch.vue';
import DaIconToggle from './DaIconToggle.vue';
import DaSpinner from './DaSpinner';

const requireIcons = require.context('../../icons', false, /.js$/);
const icons = requireIcons.keys().filter(r => r !== './index.js');
icons.forEach(requireIcons);

const logos = require.context('../../logos', false, /.svg$/).keys();

export default {
  name: 'Demo',
  components: { DaSpinner, DaIconToggle, DaSwitch },
  created() {
    this.icons = icons.map(r => r.substr(2, r.length - 5));
    this.logos = logos.map(l => l.substr(2, l.length - 6));
  },
};
</script>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
}

h1 {
  display: flex;
  margin: 16px 0;
  flex-direction: row;
  align-items: center;
  color: var(--color-salt-90);
}

.title__icon {
  width: 40px;
  height: 40px;
  margin-right: 16px;
  color: var(--color-salt-90);
}

section {
  margin: 16px 0;
}

h3 {
  margin: 16px 0;
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
  width: 110px;
  margin: 16px 0;
  flex-direction: column;
  align-items: center;

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
  margin: -16px 0;
}

.switch {
  margin: 16px 0;
  width: 180px;
}
</style>
