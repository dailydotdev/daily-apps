<template>
  <div class="settings">
    <da-layout-preview/>
    <div class="separator"></div>
    <div class="settings__column">
      <h5>Layout</h5>
      <da-mode-switch class="small" first-icon="card" second-icon="line"
                      :checked="insaneMode" @toggle="toggleInsane"
                      v-tooltip="insaneMode ? 'Card View' : 'Insane View'"/>
    </div>
    <div class="settings__column">
      <h5>Spaciness</h5>
      <da-radio name="spaciness" :options="spaceOpts" :value="spaciness"
                @toggle="toggleSpaciness"/>
    </div>
    <div class="settings__column">
      <h5>Preferences</h5>
      <da-switch label="Recently visited sites" class="small settings__top-sites"
                 :checked="showTopSites" @toggle="toggleTopSites"/>
      <da-switch label="Light theme" class="small settings__theme"
                 :checked="theme > 0" @toggle="toggleTheme"/>
      <da-switch label="Card animations" class="small settings__animations"
                 :checked="enableCardAnimations" @toggle="toggleCardAnimations"/>
    </div>
    <div class="settings__column">
      <h5>&zwnj;</h5>
      <da-switch label="Hide read posts" class="small settings__hide-read-posts"
                 :checked="showOnlyNotReadPosts" @toggle="toggleShowOnlyNotReadPosts"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { themes } from '@daily/services';
import DaModeSwitch from '@daily/components/src/components/DaModeSwitch.vue';
import DaSwitch from '@daily/components/src/components/DaSwitch.vue';
import DaRadio from '@daily/components/src/components/DaRadio.vue';
import DaLayoutPreview from './DaLayoutPreview.vue';

export default {
  name: 'DaSettings',
  components: {
    DaModeSwitch,
    DaSwitch,
    DaRadio,
    DaLayoutPreview,
  },
  data() {
    return {
      spaceOpts: { eco: 'Eco', roomy: 'Roomy', cozy: 'Cozy' },
    };
  },
  computed: {
    ...mapState('ui', [
      'showTopSites', 'insaneMode', 'spaciness', 'enableCardAnimations', 'showOnlyNotReadPosts',
    ]),
    ...mapState({
      theme: state => themes.indexOf(state.ui.theme),
    }),
  },
  methods: {
    toggleInsane(pressed) {
      this.$store.commit('ui/setInsaneMode', pressed);
      ga('send', 'event', 'Settings', 'Insane', pressed);
    },
    toggleSpaciness(val) {
      this.$store.commit('ui/setSpaciness', val);
      ga('send', 'event', 'Settings', 'Spaciness', val);
    },
    async toggleTopSites(val) {
      ga('send', 'event', 'Settings', 'Click', 'Top Sites');
      // TODO: handle error
      await this.$store.dispatch('ui/setShowTopSites', val);
    },
    toggleShowOnlyNotReadPosts(val) {
      this.$store.commit('ui/setShowOnlyNotReadPosts', val);
      ga('send', 'event', 'Settings', 'Click', 'Hide Read Posts');
    },
    toggleCardAnimations(val) {
      ga('send', 'event', 'Settings', 'Click', 'Card Animations');
      this.$store.commit('ui/setEnableCardAnimations', val);
    },
    toggleTheme(pressed) {
      const newTheme = pressed ? themes[1] : themes[0];
      this.$store.dispatch('ui/setTheme', newTheme);
      ga('send', 'event', 'Settings', 'Theme', this.theme);
    },
  },
  mounted() {
        import('@daily/components/icons/card');
        import('@daily/components/icons/line');
  },
};
</script>

<style>
.settings {
  display: flex;
  height: 156px;
  flex-direction: row;
  align-self: stretch;
  background: var(--theme-background-secondary);
  padding: 24px 16px;
  overflow: hidden;

  & .separator {
    height: 100%;
  }

  & > * {
    margin: 0 16px;
  }

  & .layout-preview {
    align-self: center;
  }
}

.settings__column {
  display: flex;
  flex-direction: column;

  & h5 {
    color: var(--theme-disabled);
    margin-bottom: 16px;
    @mixin lil2;
  }

  & .switch {
    margin: 6px 0;

    &:first-of-type {
      margin-top: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
