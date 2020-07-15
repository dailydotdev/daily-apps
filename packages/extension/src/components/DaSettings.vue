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
      <da-switch label="Hide read posts" class="small settings__hide-read-posts"
                 :checked="showOnlyNotReadPosts" @toggle="toggleShowOnlyNotReadPosts"/>
      <da-switch label="Open Links in New Tab" class="small settings__toggle-open-tab"
                 :checked="openNewTab" @toggle="toggleOpenInTab"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
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
      'showTopSites', 'insaneMode', 'spaciness', 'enableCardAnimations', 'showOnlyNotReadPosts', 'openNewTab',
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
    async toggleShowOnlyNotReadPosts(val) {
      ga('send', 'event', 'Settings', 'Click', 'Hide Read Posts');
      this.$store.commit('ui/setShowOnlyNotReadPosts', val);
      this.refreshFeed();
    },
    async toggleOpenInTab(val) {
      ga('send', 'event', 'Settings', 'Click', 'Open New Tab');
      this.$store.commit('ui/setOpenNewTab', val);
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
    ...mapActions({
      refreshFeed: 'feed/refreshFeed',
    }),
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
  flex-wrap: wrap;

  & h5 {
    color: var(--theme-disabled);
    margin-bottom: 16px;
    @mixin lil2;
  }

  & .switch {
    margin: 6px 0;
    /* Handle cases for children from after first row
      - Every child after 1st row has 32px left margin
      - First child of every column has a top margin of 34px
      - Last child of every column has a bottom margin of 0px
    */
    &:nth-child(1n+5) {
      margin-left: 32px;
    }
    &:nth-child(3n+2) {
      margin-top: 34px;
    }
    &:nth-child(3n+4) {
      margin-bottom: 0px;
    }

    /*Handle special case for 1st and 4th element */
    &:first-of-type {
      margin-top: 0px;
    }
    &:nth-child(4) {
      margin-top: 6px;
      margin-bottom: 0px;
    }

  }
}
</style>
