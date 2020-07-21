<template>
  <header class="header">
    <a href="https://daily.dev" target="_blank" rel="noopener noreferrer" class="header__logo">
      <svgicon name="logo" class="header__logo__icon"/>
    </a>
    <da-mode-switch class="header__switch"
                    first-icon="user" second-icon="v"
                    :checked="filterChecked" @toggle="$emit('filterToggle')"/>
  </header>
</template>

<script>
import DaModeSwitch from '@daily/components/src/components/DaModeSwitch.vue';

export default {
  name: 'DmHeader',

  components: {
    DaModeSwitch,
  },

  props: {
    filterChecked: {
      type: Boolean,
      required: true,
    },
  },

  mounted() {
    this.loadIcons();
  },

  methods: {
    loadIcons() {
      import('@daily/components/icons/logo');
      import('@daily/components/icons/user');
      import('@daily/components/icons/v');
    },
  },
};
</script>

<style>
.header {
  position: relative;
  display: flex;
  width: 100%;
  height: 64px;
  padding: 0 22px;
  flex-direction: row;
  align-items: center;
  background: var(--theme-background-highlight);
  box-shadow: 0 1px 0 0 var(--theme-shine);
}

.header__logo {
  background: none;
  border: none;
  padding: 0;
}

.header__logo__icon {
  width: 56px;
  height: 56px;
  color: var(--theme-primary);
}

.header__switch {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>
