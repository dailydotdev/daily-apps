<template>
  <da-modal class="bookmark-modal integrations" @close="$emit('close')">
    <button class="btn-icon modal__close-btn" @click="$emit('close')">
      <svgicon name="x"/>
    </button>
    <div class="integrations__header">
      <h3>Integrate Daily with +100 apps</h3>
      <p>Choose the feed you want to use for integration</p>
      <da-dropdown v-if="feeds.length" :items="feeds" :selected-index="selectedFeed"
        @selected="selectedFeed = $event" />
      <da-svg src="/graphics/premium.svg" class="premium-badge"/>
    </div>
    <div class="integrations__footer">
      <da-text-field v-if="isPremium" ref="url" class="integration__url-box" label="Feed URL"
                  hide-label :value="selectedFeedUrl" autofocus readonly>
        <template v-slot:right>
          <button class="btn-icon" v-tooltip.top.ignoreClick="copyTooltip"
                  @click="copyFeed" @mouseenter="copyTooltip = 'Copy'">
            <svgicon name="copy"/>
          </button>
        </template>
      </da-text-field>
      <button v-else class="btn btn-big btn-invert integrations__btn" autofocus
              @click="showPremium">
        Show me the link
      </button>
      <p>
        Copy the link above and use it to integrate with +100 awesome apps!
      </p>
      <div class="integration__list">
        <a v-for="item in popularIntegrations" :key="item.title"
            class="integration__list-item" :href="item.url" target="_blank">
          <img :src="item.logo" />
          <div>
            <span class="lil2">{{ item.title }}</span>
            <span class="micro2">{{ item.subtitle }}</span>
          </div>
        </a>
      </div>
    </div>
  </da-modal>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaDropdown from '@daily/components/src/components/DaDropdown.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import '@daily/components/icons/x';
import '@daily/components/icons/copy';
import DaSvg from './DaSvg.vue';
import { POPULAR_INTEGRATIONS_QUERY, RSS_FEEDS_QUERY } from '../graphql/integrations';

export default {
  name: 'DaIntegrations',

  components: {
    DaModal,
    DaDropdown,
    DaTextField,
    DaSvg,
  },

  apollo: {
    popularIntegrations: {
      query: POPULAR_INTEGRATIONS_QUERY,
      fetchPolicy: 'cache-and-network',
    },
    rssFeeds: {
      query: RSS_FEEDS_QUERY,
      fetchPolicy: 'cache-and-network',
      skip() {
        return !this.isPremium;
      },
    },
  },

  data() {
    return {
      copyTooltip: 'Copy',
      rssFeeds: [
        { url: 'https://placeholder.com', name: 'News feed' },
        { url: 'https://placeholder2.com', name: 'Bookmarks' },
      ],
      selectedFeed: 0,
    };
  },

  computed: {
    feeds() {
      return this.rssFeeds.map(f => ({ value: f.url, text: f.name }));
    },
    selectedFeedUrl() {
      if (this.feeds.length) {
        return this.feeds[this.selectedFeed].value;
      }
      return '';
    },
    ...mapGetters('user', ['isPremium']),
  },

  watch: {
    async selectedFeedUrl() {
      await this.$nextTick();
      if (this.$refs.url) {
        const copy = this.$refs.url.$el.querySelector('input');
        copy.setSelectionRange(0, 0);
      }
    },
  },

  methods: {
    copyFeed() {
      const copy = this.$refs.url.$el.querySelector('input');
      copy.select();
      copy.setSelectionRange(0, 99999);
      document.execCommand('copy');
      copy.setSelectionRange(0, 0);
      this.copyTooltip = 'Copied';
    },

    showPremium() {
      this.$emit('close');
      setTimeout(() => {
        this.setShowPremium(true);
      }, 50);
    },

    ...mapMutations({
      setShowPremium: 'ui/setShowPremium',
    }),
  },
};
</script>

<style>
.integrations .modal__container {
  padding: 0;
  width: 500px;
  align-items: stretch;

  & .integrations__header p {
    max-width: none;
  }

  & .integration__url-box {
    margin: 0 0 8px;
  }

  & .dropdown {
    width: 360px;
    margin-top: 8px;
  }

  & .premium-badge {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -9px;
    margin: 0 auto;
  }
}

.integrations__header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 40px 32px;
  background: var(--theme-background-secondary);
}

.integrations__footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  border-top: solid 1px var(--theme-shine);
}

.integration__list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-self: stretch;
  margin: 8px -8px -8px;
}

.integration__list-item {
  display: flex;
  width: 210px;
  flex-direction: row;
  align-items: center;
  margin: 8px;
  padding: 12px;
  border: 1px solid var(--theme-shine);
  border-radius: 8px;

  & img {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    margin-right: 12px;
  }

  & > div {
    display: flex;
    flex-direction: column;
  }

  & span {
    color: var(--theme-secondary);
    text-transform: none;

    &:first-child {
      color: var(--theme-primary);
    }
  }
}

.integrations__btn {
  width: 210px;
  margin-bottom: 24px;
  justify-content: center;
}
</style>
