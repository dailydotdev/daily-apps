<template>
  <header class="header">
    <button class="header__logo" @click="onBackHome">
      <da-svg src="/graphics/birthdaylogo.svg" class="header__logo__icon"/>
    </button>
    <da-switch class="header__switch" icon="bookmark" :checked="showBookmarks"
               v-tooltip.bottom="showBookmarks ? 'Back to feed' : 'Show your bookmarks'"
               @toggle="toggleBookmarks"></da-switch>
    <div class="space"></div>
    <a class="header__cta btn btn-menu" :class="{'first-time': ctaClicked === false}"
       @click="ctaClick" v-if="!isPremium"
       href="https://daily.dev/birthday-giveaway"
       target="_blank" rel="noopener noreferrer">
      <span class="header__cta__text">Special Birthday Giveaway</span>
      <svgicon class="header__cta__image" icon="gift"/>
    </a>
    <div class="separator"></div>
    <button class="btn-icon btn-terminal" v-tooltip.bottom="'Latest updates'"
            :class="{ 'active': notificationsOpened }" @click="toggleNotifications">
      <svgicon name="terminal"/>
      <span class="header__badge" v-if="showNotificationBadge"></span>
    </button>
    <button class="btn-icon btn-dnd" v-tooltip.bottom="'Do Not Disturb'"
            :class="{ 'active': showDndMenu }" @click="$emit('menu', $event)">
      <svgicon name="timer"/>
    </button>
    <button class="btn-icon btn-layout" v-tooltip.bottom="'Layout Settings'"
            :class="{ 'active': showSettings }" @click="setShowSettings(!showSettings)">
      <svgicon name="layout"/>
    </button>
    <a :href="profileLink" class="header__profile" v-if="isLoggedIn">
      <span class="lil2">{{reputation}}</span>
      <img :src="profileImage" alt="Profile image"/>
      <da-svg v-if="isPremium" src="/graphics/glitter_border.svg" class="glitter-mark"/>
    </a>
    <button class="btn btn-water-cheese header__sign-in" v-else
            @click="$emit('login')">
      <svgicon name="user_daily"/>
      <span>Sign in</span>
    </button>
  </header>
</template>

<script>
import {
  mapState, mapMutations, mapGetters, mapActions,
} from 'vuex';
import DaSvg from './DaSvg.vue';

export default {
  name: 'DaHeader',

  components: {
    DaSvg,
    DaSwitch: () => import('@daily/components/src/components/DaSwitch.vue'),
  },

  computed: {
    ...mapState('ui', [
      'showNotificationBadge', 'notificationsOpened', 'showDndMenu', 'showSettings', 'ctaClicked',
    ]),
    ...mapState('feed', ['showBookmarks']),
    ...mapGetters('user', ['isLoggedIn', 'isPremium']),
    ...mapState({
      notificationsOpened: state => state.ui.showNotifications,
      profileImage(state) {
        if (this.isLoggedIn) {
          return state.user.profile.image;
        }

        return '';
      },
      profileLink(state) {
        if (this.isLoggedIn) {
          return state.user.profile.permalink;
        }

        return '';
      },
      reputation(state) {
        if (this.isLoggedIn) {
          return state.user.profile.reputation;
        }

        return 0;
      },
    }),
  },

  mounted() {
    this.loadIcons();
  },

  methods: {
    loadIcons() {
      import('@daily/components/icons/layout');
      import('@daily/components/icons/bookmark');
      import('@daily/components/icons/user_daily');
      import('@daily/components/icons/terminal');
      import('@daily/components/icons/mobile');
      import('@daily/components/icons/ph');
      import('@daily/components/icons/github');
      import('@daily/components/icons/timer');
    },

    toggleBookmarks(pressed) {
      this.$store.dispatch('feed/setShowBookmarks', pressed);
      ga('send', 'event', 'Header', 'Bookmarks', pressed);
    },

    toggleNotifications() {
      ga('send', 'event', 'Header', 'Terminal', !this.notificationsOpened);
      if (this.notificationsOpened) {
        this.hideNotifications();
      } else {
        this.showNotifications();
      }
    },

    onBackHome() {
      ga('send', 'event', 'Header', 'Home');
      this.backToMainFeed();
    },

    ctaClick() {
      ga('send', 'event', 'CTA', 'Click', 'T-Shirt');
      this.$store.commit('ui/setCtaClicked', true);
    },

    ...mapMutations({
      hideNotifications: 'ui/hideNotifications',
      showNotifications: 'ui/showNotifications',
      setShowSettings: 'ui/setShowSettings',
    }),

    ...mapActions({
      backToMainFeed: 'feed/backToMainFeed',
    }),
  },
};
</script>

<style>
.header {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  width: 100%;
  height: 56px;
  flex-direction: row;
  align-items: center;
  padding: 0 8px;
  background: var(--theme-background-primary);
  border-bottom: 1px solid var(--theme-separator);
  z-index: 30;
  contain: layout size;

  & > * {
    margin: 0 4px;
  }

  & > .btn-icon {
    margin-left: 2px;
    margin-right: 2px;

    & > .svg-icon {
      width: 28px;
      height: 28px;
    }
  }

  & .header__logo {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  & .header__logo__icon {
    width: 114px;
  }

  & .separator {
    margin-left: 8px;
    margin-right: 8px;
  }

  & .header__switch {
    width: var(--da-switch-width);
    height: var(--da-switch-height);
    margin-left: 8px;

    --da-switch-checked-color: var(--color-burger-60);
    --da-switch-checked-background: var(--color-burger-90);

    &:hover {
      --da-switch-checked-color: var(--color-burger-50);
    }

    .bright & {
      --da-switch-checked-background: var(--color-burger-30);

      &:hover {
        --da-switch-checked-color: var(--color-burger-70);
      }
    }
  }

  & .header__sign-in {
    margin-left: 8px;
    margin-right: 0;
  }

  & .space {
    flex: 1;
  }

  & .header__profile {
    position: relative;
    display: flex;
    padding: 0;
    margin: 0 8px 0 12px;
    align-items: center;
    background: var(--theme-background-highlight);
    border: none;
    border-radius: 8px;
    cursor: pointer;

    & span {
      margin: 0 8px 0 12px;
      color: var(--theme-primary);
    }

    & img {
      width: 32px;
      height: 32px;
      overflow: hidden;
      border-radius: 8px;
      object-fit: cover;
    }

    & .glitter-mark {
      top: -8px;
      right: -8px;
      width: 16px;
      height: 16px;

      & #border {
        fill: var(--theme-background-highlight);;
      }

      & #shape {
        fill: var(--theme-premium);
      }
    }
  }
}

.header__badge {
  position: absolute;
  left: 23px;
  bottom: 22px;
  width: 10px;
  height: 10px;
  padding: 2px;
  background: var(--theme-background-highlight);
  border-radius: 100%;

  &:before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: var(--color-water-30);
    border-radius: 100%;
  }
}

.header__cta {
  display: flex;
  height: unset;
  padding: 6px 6px 6px 16px;
  align-items: center;
  margin-left: auto;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  --button-color: var(--theme-secondary);

  &.first-time {
    --button-color: var(--theme-avocado);
  }
}

.header__cta__text {
  margin-right: 10px;

  & {
    @mixin lil2;
  }
}

.header__cta__image {
  width: 28px;
  height: 28px;
  color: var(--color-salt-10);
}

@media (min-width: 1062px) {
  .header .header__switch {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>
