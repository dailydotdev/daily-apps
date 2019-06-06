<template>
  <div class="home page">
    <dm-header class="home__header" :filterChecked="showApprovals" @filterToggle="toggleFilter"/>
    <router-view></router-view>
  </div>
</template>

<script>
import DmHeader from '../components/DmHeader.vue';

export default {
  name: 'Home',
  components: {
    DmHeader,
  },

  props: {
    showApprovals: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    toggleFilter() {
      if (this.showApprovals) {
        this.$router.replace('/');
      } else {
        this.$router.replace('/approvals');
      }
    },
  },
};
</script>

<style>
.home {
  padding-top: 64px;
}

.home__header {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
