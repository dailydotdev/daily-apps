<template>
  <da-modal class="new-rank-modal" @close="close">
    <div class="new-rank-modal__rank" v-if="isLoggedIn && rankAnimationEnded">
      <da-radial-progress class="new-rank-modal__progress" :progress="steps" :max-degrees="270"
                          :steps="steps"/>
      <img :src="profileImage" alt="Profile image" class="new-rank-modal__profile"/>
      <da-rank class="new-rank-modal__badge" :rank="nextRank"/>
      <div class="new-rank-modal__badge-background"/>
    </div>
    <da-rank-progress class="new-rank-modal__rank-progress" v-else
                      :progress="steps" :rank="currentRank" :enable-hover="false"
                      :show-rank-animation="animatingRank" fill-by-default
                      @rank-animation-end="onRankAnimationEnd"/>
    <h1>{{ title }}</h1>
    <p>
      You earned the {{ rankName.toLowerCase() }} rank
      <template v-if="!isLoggedIn">
        <br><br>Add your new rank to your profile by signing up
      </template>
    </p>
    <button class="btn btn-big btn-invert new-rank-modal__confirm"
            v-if="isLoggedIn" @click="close">Awesome!
    </button>
    <div class="new-rank-modal__login" v-else>
      <a :href="getLoginLink('github')" class="btn btn-big btn-invert"
         @click="onLogin('github')">
        <svgicon name="github"/>
        <span>Sign in with GitHub</span>
      </a>
      <span class="new-rank-modal__login__or lil2">Or</span>
      <a :href="getLoginLink('google')" class="btn btn-hollow"
         @click="onLogin('google')">
        <svgicon name="google"/>
      </a>
    </div>
    <da-checkbox name="hide" :checked="neverShowRankModal" @toggle="neverShowRankModal = $event">
      Never show this popup again
    </da-checkbox>
    <transition name="confetti-transition" slot="background">
      <da-svg src="/graphics/confetti.svg" class="new-rank-modal__background"
              :class="{override: overrideConfettiColor}" v-show="rankAnimationEnded"/>
    </transition>
  </da-modal>
</template>

<script>
import '@daily/components/icons/google';
import '@daily/components/icons/github';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaRadialProgress from '@daily/components/src/components/DaRadialProgress.vue';
import DaRank from '@daily/components/src/components/DaRank.vue';
import DaRankProgress from '@daily/components/src/components/DaRankProgress.vue';
import DaCheckbox from '@daily/components/src/components/DaCheckbox.vue';
import { mapGetters, mapState } from 'vuex';
import {
  RANK_NAMES,
  rankToColor,
  rankToGradientStopBottom,
  rankToGradientStopTop,
  STEPS_PER_RANK,
} from '@daily/components/src/common/rank';
import { authService } from '../common/services';
import DaSvg from './DaSvg.vue';

export default {
  name: 'DaNewRankModal',

  components: {
    DaModal,
    DaRadialProgress,
    DaRank,
    DaCheckbox,
    DaRankProgress,
    DaSvg,
  },

  data() {
    return {
      animatingRank: false,
      rankAnimationEnded: false,
      neverShowRankModal: false,
    };
  },

  computed: {
    rankName() {
      return RANK_NAMES[this.nextRank - 1];
    },
    overrideConfettiColor() {
      return this.nextRank < RANK_NAMES.length;
    },
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState({
      profileImage(state) {
        if (this.isLoggedIn) {
          return state.user.profile.image;
        }

        return '';
      },
      nextRank(state) {
        if (!state.user.readingRank || !state.user.readingRank.nextRank) {
          return 0;
        }
        return state.user.readingRank.nextRank;
      },
      currentRank(state) {
        if (this.animatingRank) {
          return state.user.readingRank.nextRank;
        }
        if (!state.user.readingRank || !state.user.readingRank.rank) {
          return 0;
        }
        return state.user.readingRank.rank;
      },
      steps(state) {
        if (!this.animatingRank) {
          return state.user.readingRank.shownProgress;
        }
        if (!this.nextRank) {
          return 0;
        }
        return STEPS_PER_RANK[this.nextRank - 1];
      },
      title(state) {
        if (this.isLoggedIn) {
          const firstName = state.user.profile.name.split(' ')[0];
          if (this.nextRank === 1) {
            return `Wow, ${firstName}!`;
          }
          if (this.nextRank === 2) {
            return `You rock, ${firstName}!`;
          }
          if (this.nextRank === 3) {
            return `That's epic, ${firstName}!`;
          }
          if (this.nextRank === 4) {
            return `Fantastic, ${firstName}!`;
          }
          return `Legendary, ${firstName}!`;
        }
        return 'Good job!';
      },
    }),
  },

  watch: {
    rank() {
      this.updateColors();
    },
  },

  methods: {
    getLoginLink(provider) {
      const redirectUri = browser.extension.getURL('index.html');
      return authService.getAuthorizationUrl(provider, redirectUri);
    },

    onLogin(provider) {
      ga('send', 'event', 'Login', 'Initialized', provider);
      this.close();
    },

    updateColors() {
      if (this.nextRank > 0) {
        this.$el.style.setProperty('--rank-color', rankToColor(this.nextRank));
        this.$el.style.setProperty('--rank-stop-color1', rankToGradientStopBottom(this.nextRank));
        this.$el.style.setProperty('--rank-stop-color2', rankToGradientStopTop(this.nextRank));
      }
    },

    onRankAnimationEnd() {
      this.rankAnimationEnded = true;
    },

    animateRank() {
      if (document.visibilityState === 'hidden') {
        document.addEventListener('visibilitychange', () => setTimeout(() => this.animateRank(), 1000), { once: true });
      } else {
        this.animatingRank = true;
      }
    },

    close() {
      this.$emit('close', this.neverShowRankModal);
    },
  },

  mounted() {
    this.updateColors();
    setTimeout(() => this.animateRank(), 1000);
  },
};
</script>

<style>
.new-rank-modal .modal__background {
  z-index: 1;
}

.new-rank-modal .modal__container {
  border: 4px solid var(--rank-color);
  width: 432px;
  padding: 48px 56px 32px;

  & h1 {
    margin: 32px 0 0;
    color: var(--theme-primary);
  }

  & p {
    margin: 8px 0 0;
    color: var(--theme-secondary);
  }

  & .checkbox {
    margin-top: 24px;
  }

  & .new-rank-modal__rank-progress, & .new-rank-modal__progress {
    width: 180px;
    height: 180px;
    z-index: 1;
  }
}

.new-rank-modal__rank {
  position: relative;
}

.new-rank-modal__progress {
  --radial-progress-step: var(--theme-active);
  --radial-progress-completed-step: var(--rank-color);
}

.new-rank-modal__profile {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 120px;
  height: 120px;
  margin: auto;
  border-radius: 100%;
}

.new-rank-modal__badge {
  position: absolute;
  right: -12px;
  bottom: -12px;
  width: 80px;
  height: 80px;
  z-index: 1;
  border-radius: 100%;
  background: var(--theme-background-highlight);

  --stop-color1: var(--rank-stop-color1);
  --stop-color2: var(--rank-stop-color2);
}

.new-rank-modal__confirm, .new-rank-modal__login {
  margin-top: 40px;
}

.new-rank-modal__confirm {
  width: 190px;
  justify-content: center;
}

.new-rank-modal__login {
  display: flex;
  flex-direction: row;
  align-items: center;

  & .btn.btn-invert {
    flex: 1;
  }

  & .btn.btn-hollow {
    padding: 4px;
    --button-color: var(--theme-secondary);
    --button-border: 1px solid var(--theme-secondary);

    & .svg-icon {
      margin: 0;
    }
  }

  & .new-rank-modal__login__or {
    margin: 0 16px;
    color: var(--theme-secondary);
  }
}

.new-rank-modal__background {
  position: absolute;
  width: 821px;
  height: 444px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;

  &.override svg path {
    fill: var(--rank-color);
  }
}

.confetti-transition-enter-active, .confetti-transition-leave-active {
  transform-origin: center;
  transition: opacity 0.2s linear, transform 0.2s ease-out;
  will-change: opacity, transform;
}

.confetti-transition-enter, .confetti-transition-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
