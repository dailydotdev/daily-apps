<template>
  <div class="page onboarding">
    <header class="onboarding__header">
      <svgicon name="logo" class="onboarding__header__logo"/>
      <div class="onboarding__nav">
        <div v-for="index in steps" :key="index" class="onboarding__nav__item"
             :class="{selected: currentStep === index }"></div>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>
<script>
import { trackPageView } from '../common/analytics';

export default {
  name: 'Onboarding',

  data() {
    return {
      steps: 3,
      currentStep: 1,
    };
  },

  beforeRouteEnter(to, from, next) {
    next(vm => vm.updateCurrentStep(to));
  },

  beforeRouteUpdate(to, from, next) {
    this.updateCurrentStep(to);
    next();
  },

  methods: {
    updateCurrentStep(route) {
      const s = route.path.split('/');
      this.currentStep = parseInt(s[s.length - 1], 10);
      trackPageView(`/onboarding/${this.currentStep}`);
    },
  },

  mounted() {
        import('@daily/components/icons/logo');
  },
};
</script>
<style>
.page.onboarding {
  padding: 16px 24px;
  align-items: center;
  background: var(--color-pepper-80);

  & main {
    display: flex;
    height: 597px;
    flex-direction: column;
    align-items: center;
  }

  & h1 {
    color: var(--theme-primary);
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  & p {
    width: 594px;
    color: var(--theme-secondary);
    text-align: center;
    @mixin jr;
  }

  & btn.btn-big {
    height: 48px;
  }
}

.onboarding__header {
  position: relative;
  width: 100%;
  margin-bottom: 40px;
}

.onboarding__nav {
  position: absolute;
  display: flex;
  left: 50%;
  bottom: 0;
  margin: 0 auto;
  flex-direction: row;
  align-items: flex-end;
  transform: translateX(-50%);
}

.onboarding__nav__item {
  width: 8px;
  height: 8px;
  margin: 0 4px;
  background: var(--theme-separator);
  border-radius: 4px;

  &.selected {
    height: 16px;
    background: var(--theme-primary);
  }
}

.onboarding__placeholder {
  margin: auto 0;
}

.onboarding__header__logo {
  width: 80px;
  height: 80px;
  color: var(--theme-primary);
}
</style>
