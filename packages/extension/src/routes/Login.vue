<template>
  <div class="page">
    <da-spinner class="login__loading"></da-spinner>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import DaSpinner from '@daily/components/src/components/DaSpinner.vue';

export default {
  name: 'Login',

  components: {
    DaSpinner,
  },

  props: {
    provider: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },

  methods: {
    ...mapActions({
      authenticate: 'user/authenticate',
    }),
  },

  async mounted() {
    // TODO: handle error
    await this.authenticate({ provider: this.provider, code: this.code });
    this.$router.replace('/');
  },
};
</script>
<style>
.login__loading {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>
