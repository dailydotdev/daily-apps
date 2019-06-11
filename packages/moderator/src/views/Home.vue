<template>
  <div class="home page">
    <dm-header class="home__header" :filterChecked="showApprovals" @filterToggle="toggleFilter"/>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import DmHeader from '../components/DmHeader.vue';
import loggedInGuard from '../router/guards/loggedIn';

export default {
  name: 'Home',
  components: {
    DmHeader,
  },

  beforeRouteEnter: loggedInGuard,

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

    ...mapActions({
      fetchOpenRequests: 'requests/fetchOpenRequests',
    }),
  },

  async mounted() {
    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(async () => {
      window.OneSignal.showNativePrompt();

      await window.OneSignal.sendTags({
        userId: this.$store.state.user.profile.id,
      });
    });

    await this.fetchOpenRequests();
  },
};
</script>

<style>
.home {
  padding: 64px 35px 32px;

  @media (min-width: 536px) {
    padding-left: 70px;
    padding-right: 70px;
  }

  & .page__title {
    margin: 32px 0;
    color: var(--theme-secondary);
    text-transform: uppercase;
  }

  & .cards-list {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: auto;
    grid-column-gap: 32px;
    grid-row-gap: 32px;

    @media (min-width: 720px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1071px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1391px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (min-width: 1671px) {
      grid-template-columns: repeat(5, 1fr);
    }

    @media (min-width: 2031px) {
      grid-template-columns: repeat(6, 1fr);
    }

    @media (min-width: 2351px) {
      grid-template-columns: repeat(7, 1fr);
    }
  }

  & .editable {
    width: 100%;
    margin: 4px 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.home__header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
}

.v-context.context.requests__context {
  width: 200px;

  &:focus {
    outline: none;
  }

  & .btn {
    padding: 12px 16px;
    justify-content: flex-start;
  }
}
</style>
