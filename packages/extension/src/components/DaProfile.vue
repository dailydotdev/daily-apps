<template>
  <da-modal class="profile-modal" @close="$emit('close')">
    <header class="profile__header shadow1">
      <img :src="profileImage" class="profile__header__image" alt="Profile image"/>
      <div class="profile__header__info">
        <div class="profile__header__info__name double">{{name}}</div>
        <div class="profile__header__info__provider jr">
          <svgicon :name="provider"></svgicon>
          <span>via {{provider | provider}}</span>
        </div>
      </div>
      <div class="separator"></div>
      <button class="profile__header__logout btn quarter" @click="onLogout">
        Log out
      </button>
    </header>
    <footer class="profile__footer">
      <a target="_blank" href="https://github.com/dailydotdev/daily/issues/new">Report an issue</a>
      <a target="_blank" href="https://www.daily.dev/privacy">Privacy Policy</a>
      <a target="_blank" class="caption" href="https://www.daily.dev/cookie">
        Cookie Policy
      </a>
      <div class="profile__footer__row">
        <a target="_blank" href="https://www.daily.dev/terms">
          Terms of Service</a>
        <div class="caption">// Version {{ version }}</div>
      </div>
    </footer>
  </da-modal>
</template>

<script>
import 'lazysizes';
import { mapState, mapActions } from 'vuex';
import DaModal from '@daily/components/src/components/DaModal.vue';
import { version } from '../common/config';

export default {
  name: 'DaProfile',

  components: {
    DaModal,
  },

  data() {
    return {
      version,
    };
  },

  computed: {
    ...mapState({
      isLoggedIn(state) {
        return !!state.user.profile;
      },

      name(state) {
        return this.isLoggedIn ? state.user.profile.name.split(' ')[0] : '';
      },

      profileImage(state) {
        return this.isLoggedIn ? state.user.profile.image : '';
      },

      provider(state) {
        return this.isLoggedIn ? state.user.profile.providers[0] : '';
      },
    }),
  },

  methods: {
    async onLogout() {
      ga('send', 'event', 'Profile', 'Logout');
      this.$emit('close');
      // TODO: handle error
      await this.logout();
    },

    ...mapActions({
      logout: 'user/logout',
    }),
  },

  mounted() {
    import('@daily/components/icons/google');
    import('@daily/components/icons/github');
  },
};
</script>

<style>
.profile-modal.modal .modal__container {
  width: 460px;
  padding: 0;
  align-items: stretch;

  & .separator {
    height: 100%;
    margin-left: auto;
    margin-right: 24px;
  }
}

.profile__header {
  display: flex;
  height: 104px;
  flex-direction: row;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--theme-background-secondary);
}

.profile__header__image {
  width: 56px;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  object-fit: cover;
}

.profile__header__info {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 16px;
}

.profile__header__info__name {
  color: var(--theme-primary);
}

.profile__header__info__provider {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--theme-secondary);

  & .svg-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
}

.profile__header__logout {
  background: none;
  border: none;
  padding: 0;
}

.profile__footer {
  margin: 40px;
}

.profile__footer {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  color: var(--theme-disabled);

  & {
    @mixin micro1;
  }

  & > * {
    margin: 4px 0;
  }

  & a {
    color: var(--theme-secondary);
    @mixin micro1;

    &:hover {
      color: var(--theme-primary);
    }
  }
}

.profile__footer__row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
