<template>
  <header class="header">
    <a href="https://www.dailynow.co" target="_blank" class="btn-icon">
      <svgicon icon="logo" class="header__logo"/>
    </a>
    <div class="separator"></div>
    <da-icon-toggle class="header__theme" pressed-icon="moon" icon="sun" title="Change theme"
                    :pressed="theme > 0" @toggle="switchTheme"/>
    <da-icon-toggle class="header__insane" pressed-icon="card" icon="line" title="Change layout"
                    :pressed="insaneMode" @toggle="toggleInsane"/>
    <da-switch class="header__switch" icon="bookmark" :checked="showBookmarks"
               @toggle="toggleBookmarks"></da-switch>
    <div class="space"></div>
    <template v-if="showTopSites">
      <a v-for="(item, index) in topSites" :key="index" class="btn-icon header__top-site"
         :href="item.url" :title="item.title" @mouseup="mouseUp('Top Sites')">
        <img :src="getIconUrl(item.url)" class="top-site__image"/>
      </a>
      <div class="separator"></div>
    </template>
    <a class="btn-icon" href="https://github.com/elegantmonkeys/daily" target="_blank"
       title="Feedback us on GitHub!">
      <svgicon icon="github"/>
    </a>
    <a class="btn-icon" href="https://www.producthunt.com/posts/daily-7" target="_blank"
       title="Check us on Product Hunt!">
      <svgicon icon="ph"/>
    </a>
    <div class="separator"></div>
    <button class="btn-icon" title="Daily Go" @click="$emit('go')">
      <svgicon icon="mobile"/>
    </button>
    <button class="btn-icon relative btn-terminal" title="Notifications"
            :class="{ 'active': notificationsOpened }" @click="toggleNotifications">
      <svgicon icon="terminal"/>
      <span class="header__badge" v-if="showNotificationBadge"></span>
    </button>
    <button class="btn-icon header__profile" v-if="logged" @click="$emit('profile')">
      <img :src="profileImage" alt="Profile image"/>
    </button>
    <button class="btn btn-water-cheese header__sign-in" v-else
            @click="$emit('login')">
      <svgicon icon="user_daily"/>
      <span>Sign in</span>
    </button>
  </header>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { themes } from '@daily/services';

export default {
  name: 'DaHeader',

  components: {
    DaIconToggle: () => import('@daily/components/src/components/DaIconToggle.vue'),
    DaSwitch: () => import('@daily/components/src/components/DaSwitch.vue'),
  },

  data() {
    return {
      topSites: [],
    };
  },

  computed: {
    ...mapState({
      theme(state) {
        return themes.indexOf(state.ui.theme);
      },

      insaneMode(state) {
        return state.ui.insaneMode;
      },

      showTopSites(state) {
        return state.ui.showTopSites;
      },

      showBookmarks(state) {
        return state.feed.showBookmarks;
      },

      showNotificationBadge(state) {
        return state.ui.showNotificationBadge;
      },

      notificationsOpened(state) {
        return state.ui.showNotifications;
      },

      logged(state) {
        return !!state.user.profile;
      },

      profileImage(state) {
        if (this.logged) {
          return state.user.profile.image;
        }

        return '';
      },
    }),
  },

  mounted() {
    this.loadIcons();
    this.getTopSites()
      .then((sites) => {
        this.topSites = sites.slice(0, 5);
      });
  },

  methods: {
    loadIcons() {
      import('@daily/components/icons/logo');
      import('@daily/components/icons/sun');
      import('@daily/components/icons/moon');
      import('@daily/components/icons/card');
      import('@daily/components/icons/line');
      import('@daily/components/icons/bookmark');
      import('@daily/components/icons/user_daily');
      import('@daily/components/icons/terminal');
      import('@daily/components/icons/mobile');
      import('@daily/components/icons/ph');
      import('@daily/components/icons/github');
    },

    async getTopSites() {
      try {
        if ('topSites' in browser) {
          return await browser.topSites.get();
        }
        return [];
      } catch {
        return [];
      }
    },

    getIconUrl(url) {
      return `https://app.dailynow.co/icon?url=${url}&size=20`;
    },

    mouseUp(data) {
      ga('send', 'event', 'Header', 'Click', data);
    },

    switchTheme(pressed) {
      const newTheme = pressed ? themes[1] : themes[0];
      this.$store.dispatch('ui/setTheme', newTheme);
      ga('send', 'event', 'Header', 'Theme', this.theme);
    },

    toggleInsane(pressed) {
      this.$store.commit('ui/setInsaneMode', pressed);
      ga('send', 'event', 'Header', 'Insane', pressed);
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

    ...mapMutations({
      hideNotifications: 'ui/hideNotifications',
      showNotifications: 'ui/showNotifications',
    }),
  },
};
</script>

<style>
.header {
  position: relative;
  display: flex;
  width: 100%;
  height: 48px;
  flex-direction: row;
  align-items: center;
  padding: 0 8px;
  background: var(--theme-background-highlight);
  border-bottom: 1px solid var(--theme-separator);
  z-index: 30;

  & > * {
    margin: 0 4px;
  }

  & .header__logo {
    width: 40px;
    height: 40px;
    color: var(--theme-primary);
  }

  & .separator {
    margin-left: 8px;
    margin-right: 8px;
  }

  & .header__switch {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: var(--da-switch-width);
    height: var(--da-switch-height);
    margin: auto;

    --da-switch-checked-color: var(--color-burger-60);
    --da-switch-checked-background: var(--color-burger-90);
  }

  & .header__sign-in {
    margin-left: 8px;
    margin-right: 0;
  }

  & .header__top-site {
    border-radius: 50%;
    border: 1px solid var(--theme-background-primary);
    overflow: hidden;
  }

  & .top-site__image {
    width: 20px;
    height: 20px;
  }

  & .space {
    flex: 1;
  }

  & .btn-icon.relative {
    position: relative;
  }

  & .btn-icon.active .svg-icon {
    color: var(--theme-primary);
  }

  & .header__profile {
    width: 30px;
    height: 30px;
    margin: 0 8px 0 14px;
    border-radius: 4px;
    overflow: hidden;

    & img {
      width: 100%;
      height: 100%;
    }
  }
}

.header__badge {
  position: absolute;
  left: 14px;
  bottom: 13px;
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
</style>
