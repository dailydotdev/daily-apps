<template>
  <div class="app">
    <da-header></da-header>
    <div class="content">
      <div class="content__header">
        <h4>/# News for developers #/</h4>
        <a class="header__cta shadow " :href="cta.link" target="_blank"
           @mouseup="ctaClick" :style="cta.style">
          <span class="header__cta__text">// {{cta.text}}</span>
          <img class="header__cta__image" :src="`/logos/${cta.logo}.svg`" v-if="cta.logo"/>
          <svgicon class="header__cta__image" :icon="cta.icon" v-else/>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import DaHeader from '../components/DaHeader.vue';
import ctas from './ctas';

export default {
  components: { DaHeader },

  data() {
    return {
      cta: ctas[Math.floor(Math.random() * ctas.length)],
    };
  },

  methods: {
    ctaClick() {
      // ga('send', 'event', this.cta.name, 'Click');
    },
  },

  mounted() {
    if (this.cta.icon) {
      import(`@daily/components/icons/${this.cta.icon}`);
    }
  }
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

a {
  text-decoration: none;
}

.separator {
  display: block;
  border-left: 1px dotted var(--theme-separator);
  height: 32px;
  width: 1px;
}

.app {
  color: var(--theme-primary);

  & .header {
    position: absolute;
    left: 0;
    top: 0;
  }
}

.content {
  display: flex;
  flex-direction: column;
  margin: 76px 42px 76px 76px;
}

.content__header {
  display: flex;
  flex-direction: row;
  align-items: center;

  & h4 {
    text-transform: uppercase;
    color: var(--theme-secondary);
  }
}

.header__cta {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  border-radius: 8px;
}

.header__cta__text {
  margin: 8px 8px 8px 16px;

  @mixin micro2;
}

.header__cta__image {
  width: 20px;
  height: 20px;
  margin: 8px;
  color: var(--color-salt-10);
}
</style>
