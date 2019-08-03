<template>
  <main>
    <h1>Thanks, now it’s our turn</h1>
    <p>
      Everyday we will carefully pick articles, discussions and ideas from tons of dev news sources,
      especially for you.
    </p>
    <da-svg src="/graphics/radar.svg" class="onboarding__radar onboarding__placeholder"/>
    <button class="btn btn-big btn-water-cheese" @click="finish">
      Cool, Take me in
    </button>
  </main>
</template>
<script>
import { mapMutations } from 'vuex';
import DaSvg from '../components/DaSvg.vue';

export default {
  name: 'Step3',

  components: {
    DaSvg,
  },

  methods: {
    finish() {
      this.doneOnboarding();
      this.$router.replace('/');
    },

    ...mapMutations('ui', ['doneOnboarding']),
  },
};
</script>
<style>
.onboarding__radar {
  height: 282px;
}
</style>
