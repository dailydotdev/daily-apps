<template>
  <div class="page">
    <da-spinner class="oauth__loading"></da-spinner>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import DaSpinner from '@daily/components/src/components/DaSpinner.vue';
import anonymousGuard from '../router/guards/anonymous';

export default {
  name: 'OAuth',

  components: {
    DaSpinner,
  },

  beforeRouteEnter: anonymousGuard,

  methods: {
    ...mapActions({
      authenticate: 'user/authenticate',
    }),
  },

  async mounted() {
    const { params, query } = this.$route;
    await this.authenticate({ provider: params.provider, code: query.code });
    this.$router.replace('/');
  },
};
</script>

<style>
.oauth__loading {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>
