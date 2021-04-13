<template>
  <header class="header">
    <button class="header__logo" @click="onBackHome">
      <da-svg src="/graphics/icon.svg" class="header__logo__icon"/>
      <transition name="fade">
        <da-svg src="/graphics/logo_text.svg" class="header__logo__text long" v-if="!showGreeting"/>
      </transition>
    </button>
    <da-greeting @show="showGreeting = true" @hide="showGreeting = false"/>
    <div class="space"></div>
    <a class="header__cta btn btn-menu" :class="{'first-time': ctaClicked !== 2}"
       @click="ctaClick" v-if="!isPremium && !showMinimalUi"
       href="https://daily.dev/monthly-prize"
       target="_blank" rel="noopener noreferrer">
      <span class="header__cta__text">Win epic prizes</span>
      <svgicon class="header__cta__image" icon="gift"/>
    </a>
    <div class="separator" v-if="!showMinimalUi"></div>
    <button class="btn-icon btn-bookmarks" v-tooltip.bottom="'Bookmarks'"
            :class="{ 'active': showBookmarks }" @click="toggleBookmarks(!showBookmarks)"
            v-if="!showMinimalUi">
      <svgicon name="bookmark"/>
    </button>
    <button class="btn-icon btn-dnd" v-tooltip.bottom="'Do Not Disturb'"
            :class="{ 'active': showDndMenu }" @click="$emit('menu', $event)"
            v-if="!showMinimalUi">
      <svgicon name="timer"/>
    </button>
    <button class="btn-icon btn-layout" v-tooltip.bottom="'Layout Settings'"
            :class="{ 'active': showSettings }" @click="setShowSettings(!showSettings)"
            v-if="!showMinimalUi">
      <svgicon name="layout"/>
    </button>
    <a :href="profileLink" class="header__profile" v-if="isLoggedIn">
      <span class="lil2">{{reputation}}</span>
      <img :src="profileImage" alt="Profile image"/>
      <da-svg v-if="isPremium" src="/graphics/glitter_border.svg" class="glitter-mark"/>
    </a>
    <button class="btn header__sign-in" v-else
            :class="showMinimalUi ? 'btn-menu' : 'btn-water-cheese'"
            @click="$emit('login')">
      <svgicon name="user_daily"/>
      <span>Sign in</span>
    </button>
    <button class="rank-btn" @click="$emit('rank', $event)" :class="{ signal: showOnboarding }">
      <div class="rank-btn__inner" v-if="showOnboarding">
        <da-rank :rank="1"/>
      </div>
      <da-rank-progress v-else :rank="rank" :progress="rankProgress"
        :show-rank-animation="readingRankLevelUp && neverShowRankModal"
        @rank-animation-end="confirmedRankLevelUp"/>
    </button>
  </header>
</template>

<script>
import {
  mapState, mapMutations, mapGetters, mapActions,
} from 'vuex';
import DaRank from '@daily/components/src/components/DaRank.vue';
import DaRankProgress from '@daily/components/src/components/DaRankProgress.vue';
import { STEPS_PER_RANK } from '@daily/components/src/common/rank';
import DaSvg from './DaSvg.vue';
import DaGreeting from './DaGreeting.vue';

export default {
  name: 'DaHeader',

  components: {
    DaSvg,
    DaRank,
    DaRankProgress,
    DaGreeting,
  },

  data() {
    return {
      showGreeting: false,
    };
  },

  computed: {
    ...mapState('ui', ['showDndMenu', 'showSettings', 'ctaClicked', 'neverShowRankModal']),
    ...mapGetters('ui', ['showMinimalUi', 'showOnboarding']),
    ...mapState('feed', ['showBookmarks']),
    ...mapGetters('user', ['isLoggedIn', 'isPremium']),
    ...mapState('user', ['readingRank', 'readingRankLevelUp']),
    ...mapState({
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

      rank(state) {
        if (this.readingRankLevelUp && this.neverShowRankModal) {
          return state.user.readingRank.nextRank;
        }
        return state.user.readingRank && state.user.readingRank.rank;
      },

      rankProgress(state) {
        if (this.readingRankLevelUp && this.neverShowRankModal) {
          return STEPS_PER_RANK[this.rank - 1];
        }
        return state.user.readingRank && state.user.readingRank.shownProgress;
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
      import('@daily/components/icons/mobile');
      import('@daily/components/icons/ph');
      import('@daily/components/icons/github');
      import('@daily/components/icons/timer');
    },

    toggleBookmarks(pressed) {
      this.$store.dispatch('feed/setShowBookmarks', pressed);
      ga('send', 'event', 'Header', 'Bookmarks', pressed);
    },

    onBackHome() {
      ga('send', 'event', 'Header', 'Home');
      this.backToMainFeed();
    },

    ctaClick() {
      ga('send', 'event', 'CTA', 'Click', 'T-Shirt');
      this.$store.commit('ui/setCtaClicked', 2);
    },

    ...mapMutations({
      setShowSettings: 'ui/setShowSettings',
      confirmedRankLevelUp: 'user/confirmedRankLevelUp',
    }),

    ...mapActions({
      backToMainFeed: 'feed/backToMainFeed',
    }),
  },
};
</script>

<style>
.header {
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
    display: flex;
    position: relative;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  & .header__logo__icon {
    width: 32px;
  }

  & .header__logo__text {
    width: 63px;
    margin-left: 4px;

    &.fade-enter-active, &.fade-leave-active {
      position: absolute;
      left: 100%;
    }
  }

  & .separator {
    margin-left: 8px;
    margin-right: 8px;
  }

  & .header__sign-in {
    margin-left: 8px;
    margin-right: 0;

    &.btn-menu {
      --button-color: var(--theme-secondary);
    }
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

  & .btn-bookmarks {
    width: var(--da-switch-width);
    height: var(--da-switch-height);
    margin-left: 8px;

    &:hover {
      --button-color: var(--color-burger-50);
    }

    &.active {
      --button-color: var(--color-burger-60);
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
  padding: 4px;
  align-items: center;
  margin-left: auto;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  --button-color: var(--theme-secondary);

  &.first-time {
    --button-color: var(--theme-premium);
  }

  & > .header__cta__text {
    display: none;
    margin-right: 8px;

    & {
      @mixin lil2;
    }
  }

  & > .svg-icon.header__cta__image {
    width: 28px;
    height: 28px;
    margin: 0;
  }

  @media (min-width: 1316px) {
    padding-left: 16px;

    & > .header__cta__text {
      display: inline-block;
    }
  }
}

@keyframes rank-attention {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.rank-btn {
  position: absolute;
  display: flex;
  left: 0;
  right: 0;
  top: 16px ;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background: var(--theme-background-primary);
  border: none;
  border-radius: 100%;
  cursor: pointer;
  z-index: 30;

  &.signal {
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: var(--theme-hover);
      border-radius: 100%;
      z-index: -1;
      transition: background 0.1s linear;
      animation: rank-attention 2s infinite ease-in-out;
    }

    &:hover {
      &:before {
        background: var(--theme-active);
      }
    }
  }
}

.rank-btn__inner {
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  background: var(--theme-primary);
  border-radius: 100%;
  box-shadow: 0 8px 16px 2px var(--theme-active);

  --stop-color1: var(--theme-background-primary);
  --stop-color2: var(--theme-background-primary);
}
</style>
