<template>
  <div class="page onboarding">
    <header class="onboarding__header">
      <div v-for="index in steps" :key="index" class="onboarding__nav"
           :class="{selected: currentStep === index }"></div>
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
};
</script>
<style>
.page.onboarding {
  padding: 80px;
  align-items: center;

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
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  height: 16px;
  margin-bottom: 40px;
}

.onboarding__nav {
  width: 8px;
  height: 8px;
  margin: 0 4px;
  background: var(--theme-separator);
  border-radius: 4px;

  &.selected {
    height: 100%;
    background: var(--theme-primary);
  }
}

.onboarding__placeholder {
  margin: auto 0;
}
</style>
