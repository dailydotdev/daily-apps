<template>
  <da-modal class="bookmark-modal new-source" @close="$emit('close')">
    <button class="btn-icon modal__close-btn" @click="$emit('close')">
      <svgicon name="x"/>
    </button>
    <div v-if="added" class="new-source__header">
      <h3>Source added 🎉</h3>
      <p>
        From now on new articles from this source will be added to your feed. Enjoy
      </p>
    </div>
    <div v-else class="new-source__header">
      <h3>Add new source</h3>
      <p>
        Have an idea for a new source?
        Insert its link below to add it to your feed.
      </p>
      <form>
        <da-text-field ref="field" placeholder="Paste blog / rss url" label="Source url"
                      autofocus type="url" required hide-label
                      @validity="valid = $event" :class="{lock: hasSelectedRSS}">
            <template v-slot:right>
              <button v-if="!hasSelectedRSS" type="submit"
                  class="text-field__right-slot btn btn-invert"
                  :disabled="!valid || loading" @click.prevent="checkUrl">
                <svgicon name="v" />
              </button>
              <svgicon v-else class="text-field__right-slot" name="rss" />
            </template>
        </da-text-field>
      </form>
      <div class="new-source__status">
        <div v-if="existsSource" class="new-source__exists">
          <img :src="existsSource.image" alt="Source logo" />
          <span class="micro1">{{ existsSource.name }}</span>
          <span class="micro2">Already exists</span>
        </div>
        <span v-else-if="hasSelectedRSS && source.rss.length === 1">
          Please confirm the details below
        </span>
        <span v-else-if="hasSelectedRSS">
          {{ source.rss.length }} RSS feeds selected
        </span>
        <span v-else-if="scraped && source.rss.length > 1">
          {{ source.rss.length }} RSS feeds found
        </span>
        <da-spinner v-else-if="loading"/>
        <div v-else-if="failed === true" class="new-source__contact error">
          <span>{{ error }}</span>
          <a href="mailto:hi@daily.dev?subject=Failed to add new source"
            class="btn btn-hollow" target="_blank">Contact</a>
        </div>
        <span v-else-if="valid === false" class="error">Url is not valid</span>
      </div>
    </div>
    <div class="new-source__footer" v-if="added">
      <div class="new-source__added">
        <div>
          <div class="lil2">Private Card view</div>
          <svg width="120" viewBox="0 0 120 144" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><mask id="a" fill="#fff"><path d="m2.66666667 0h10.66666663c1.4727594 0 2.6666667 1.19390733 2.6666667 2.66666667v10.66666663c0 1.4727594-1.1939073 2.6666667-2.6666667 2.6666667h-10.66666663c-1.47275934 0-2.66666667-1.1939073-2.66666667-2.6666667v-10.66666663c0-1.47275934 1.19390733-2.66666667 2.66666667-2.66666667z" fill="#fff" fill-rule="evenodd"/></mask><mask id="b" fill="#fff"><path d="m0 0h16v16h-16z" fill="#fff" fill-rule="evenodd"/></mask><g fill="none" fill-rule="evenodd"><path d="m4 0h112c2.209139 0 4 1.790861 4 4v60h-120v-60c0-2.209139 1.790861-4 4-4z" fill="#1c1e21"/><g transform="translate(0 60)"><path d="m4 0h112c2.209139 0 4 1.790861 4 4v76c0 2.209139-1.790861 4-4 4h-112c-2.209139 0-4-1.790861-4-4v-76c0-2.209139 1.790861-4 4-4z" fill="#303237"/><path d="m0 55h120v1h-120z" fill="#1c1e21"/><path d="m1 66c.55228475 0 1 .4477153 1 1v6c0 .5522847-.44771525 1-1 1s-1-.4477153-1-1v-6c0-.5522847.44771525-1 1-1z" fill="#ff258e"/><g fill="#5f646d"><rect height="8" rx="2" width="88" x="16" y="12"/><rect height="8" rx="2" width="72" x="24" y="24"/><rect height="8" rx="2" width="24" x="32" y="66"/></g><g mask="url(#a)" transform="translate(8 62)"><path d="m0 0h16v16h-16z" fill="#fff"/><image height="16" mask="url(#b)" width="16" :xlink:href="source.logo"/></g></g></g></svg>
        </div>
        <div>
          <div class="lil2">Private List view</div>
          <svg width="146" viewBox="0 0 146 114" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><mask id="a" fill="#fff"><path d="m2.66666667 0h10.66666663c1.4727594 0 2.6666667 1.19390733 2.6666667 2.66666667v10.66666663c0 1.4727594-1.1939073 2.6666667-2.6666667 2.6666667h-10.66666663c-1.47275934 0-2.66666667-1.1939073-2.66666667-2.6666667v-10.66666663c0-1.47275934 1.19390733-2.66666667 2.66666667-2.66666667z" fill="#fff" fill-rule="evenodd"/></mask><mask id="b" fill="#fff"><path d="m0 0h16v16h-16z" fill="#fff" fill-rule="evenodd"/></mask><g fill="none" fill-rule="evenodd"><g transform="translate(0 82)"><path d="m4 0h138c2.209139 0 4 1.790861 4 4v24c0 2.209139-1.790861 4-4 4h-138c-2.209139 0-4-1.790861-4-4v-24c0-2.209139 1.790861-4 4-4z" fill="#1c1e21"/><g fill="#25282c"><path d="m124.666667 8h10.666666c1.47276 0 2.666667 1.19390733 2.666667 2.6666667v10.6666666c0 1.4727594-1.193907 2.6666667-2.666667 2.6666667h-10.666666c-1.47276 0-2.666667-1.1939073-2.666667-2.6666667v-10.6666666c0-1.47275937 1.193907-2.6666667 2.666667-2.6666667z"/><rect height="8" rx="2" width="64" x="8" y="12"/></g></g><g transform="translate(0 42)"><path d="m4 0h138c2.209139 0 4 1.790861 4 4v24c0 2.209139-1.790861 4-4 4h-138c-2.209139 0-4-1.790861-4-4v-24c0-2.209139 1.790861-4 4-4z" fill="#303237"/><path d="m145 12c.552285 0 1 .4477153 1 1v6c0 .5522847-.447715 1-1 1s-1-.4477153-1-1v-6c0-.5522847.447715-1 1-1z" fill="#ff258e"/><rect fill="#5f646d" height="8" rx="2" width="64" x="8" y="12"/><g mask="url(#a)" transform="translate(122 8)"><path d="m0 0h16v16h-16z" fill="#fff"/><image height="16" mask="url(#b)" width="16" :xlink:href="source.logo"/></g></g><path d="m4 0h138c2.209139 0 4 1.790861 4 4v24c0 2.209139-1.790861 4-4 4h-138c-2.209139 0-4-1.790861-4-4v-24c0-2.209139 1.790861-4 4-4z" fill="#1c1e21"/><g fill="#25282c"><rect height="8" rx="2" width="64" x="8" y="12"/><path d="m124.666667 8h10.666666c1.47276 0 2.666667 1.19390733 2.666667 2.6666667v10.6666666c0 1.4727594-1.193907 2.6666667-2.666667 2.6666667h-10.666666c-1.47276 0-2.666667-1.1939073-2.666667-2.6666667v-10.6666666c0-1.47275937 1.193907-2.6666667 2.666667-2.6666667z"/></g></g></svg>
        </div>
      </div>
      <button class="btn btn-big btn-invert new-source__confirm"
              @click="$emit('close')">
        Ok, got it
      </button>
    </div>
    <div class="new-source__footer" v-else-if="hasSelectedRSS && !existsSource">
      <div class="new-source__name">
        <img :src="source.logo" alt="Source logo" @error="replaceImage" />
        <da-text-field ref="name" placeholder="Source name" label="Source name"
                      :value="source.name" autofocus required hide-label
                      :maxlength="50" @validity="validName = $event" />
      </div>
      <div class="new-source__submit">
        <div>
          <div class="new-source__submit__info">
            <h3>Public</h3>
            <p>
              We will review your request to make sure it qualifies the standards.<br/><br/>
              If the source is approved, it will be added to the public sources list.
              We will update you by email.<br/><br/>
              Read the <a href="https://daily.dev/content-guidelines" target="_blank">content guidelines</a>
            </p>
          </div>
          <button class="btn btn-big btn-hollow"
                  :disabled="loading || !validName" @click="requestSource">
            Request
          </button>
        </div>
        <div>
          <div class="new-source__submit__info">
            <h3>Private <da-svg src="/graphics/premium.svg" class="premium-badge"/></h3>
            <p>
              Personalize your feed with  custom private sources of your choice.<br/><br/>
              This source will be added to your feed <strong>immediately</strong>.
            </p>
          </div>
          <button class="btn btn-big" :disabled="loading || !validName"
                  @click="addPrivate">
            Add now
          </button>
        </div>
      </div>
    </div>
    <div class="new-source__footer no-padding" v-else-if="scraped && source.rss.length > 1">
      <da-radio name="rss" :options="rssOpts" :value="selectedRSS"
                @toggle="selectedRSS = $event" />
      <button class="btn btn-big btn-invert new-source__confirm"
              @click="selectRSS" :disabled="loading">Continue</button>
    </div>
  </da-modal>
</template>

<script>
import Vue from 'vue';
import { mapMutations, mapGetters } from 'vuex';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import DaSpinner from '@daily/components/src/components/DaSpinner.vue';
import '@daily/components/icons/x';
import '@daily/components/icons/v';
import DaSvg from './DaSvg.vue';
import { SOURCE_BY_FEED_QUERY, ADD_PRIVATE_SOURCE_MUTATION } from '../graphql/newSource';
import { contentService } from '../common/services';
import { fetchTimeout } from '../common/fetch';

export default {
  name: 'DaNewSource',

  components: {
    DaModal,
    DaTextField,
    DaSpinner,
    DaSvg,
    DaRadio: () => import('@daily/components/src/components/DaRadio.vue'),
  },

  data() {
    return {
      valid: null,
      loading: false,
      hint: null,
      failed: false,
      error: null,
      source: null,
      scraped: false,
      hasSelectedRSS: false,
      validName: null,
      existsSource: null,
      added: false,
      selectedRSS: '0',
    };
  },

  computed: {
    rssOpts() {
      if (this.source) {
        return this.source.rss.reduce((acc, rss, i) => ({ ...acc, [i]: rss.title }), {});
      }
      return null;
    },
    ...mapGetters('user', ['isPremium']),
  },

  methods: {
    async checkIfSourceExists(url) {
      const exists = await this.$apollo.query({
        query: SOURCE_BY_FEED_QUERY,
        variables: { data: url },
        fetchPolicy: 'no-cache',
      });
      if (exists.data.sourceByFeed) {
        this.existsSource = exists.data.sourceByFeed;
      }
    },

    async scrapeUrl(url) {
      try {
        this.loading = true;
        this.failed = false;
        this.scraped = false;
        this.source = null;
        this.existsSource = null;
        this.selectedRSS = '0';
        const res = await fetchTimeout(`${process.env.VUE_APP_API_URL}/scrape/source?url=${url}`, 20000, { credentials: 'same-origin' });
        const data = await res.json();
        if (data.type === 'website') {
          if (!data.rss.length) {
            this.error = 'Could not find RSS feed';
            this.failed = true;
          } else {
            this.source = data;
            if (data.rss.length === 1) {
              this.hasSelectedRSS = true;
              await this.checkIfSourceExists(data.rss[0].url);
            }
            this.scraped = true;
          }
        } else {
          this.failed = true;
          this.error = 'Failed to fetch information';
        }
      } catch (err) {
        this.failed = true;
        this.error = 'Failed to fetch information';
      } finally {
        this.loading = false;
      }
    },

    async checkUrl() {
      await this.scrapeUrl(this.$refs.field.currentValue);
    },

    toggleRSS(index, enabled) {
      Vue.set(this.source.rss, index, { ...this.source.rss[index], enabled });
    },

    async selectRSS() {
      this.loading = true;
      try {
        await this.checkIfSourceExists(this.source.rss[this.selectedRSS].url);
        this.source.rss = [this.source.rss[this.selectedRSS]];
        this.hasSelectedRSS = true;
      } finally {
        this.loading = false;
      }
    },

    async requestSource() {
      ga('send', 'event', 'Request Source', 'Submit');
      this.loading = true;
      try {
        await contentService.requestPublication(this.source.rss[0].url);
        this.$emit('close');
        this.$emit('requested-source');
      } finally {
        this.loading = false;
      }
    },

    async addPrivate() {
      ga('send', 'event', 'Add Private', 'Submit');
      if (!this.isPremium) {
        this.$emit('close');
        setTimeout(() => {
          this.setShowPremium(true);
        }, 50);
      } else {
        this.loading = true;
        try {
          await this.$apollo.mutate({
            mutation: ADD_PRIVATE_SOURCE_MUTATION,
            variables: {
              data: {
                name: this.$refs.name.currentValue,
                image: this.source.logo,
                rss: this.source.rss[0].url,
              },
            },
          });
          this.added = true;
        } finally {
          this.loading = false;
        }
      }
    },

    replaceImage() {
      const placeholder = 'https://res.cloudinary.com/daily-now/image/upload/logos/placeholder.jpg';
      if (this.source.logo !== placeholder) {
        this.source.logo = placeholder;
      }
    },

    ...mapMutations({
      setShowPremium: 'ui/setShowPremium',
    }),
  },

  mounted() {
    import('@daily/components/icons/open_link');
    import('@daily/components/icons/rss');
  },
};
</script>

<style>
.new-source.bookmark-modal .modal__container {
  padding: 0;
  width: 500px;

  & .text-field__right-slot.btn {
    width: 30px;
    height: 30px;
    padding: 3px;
    --button-border-radius: 8px;
  }

  & .text-field__right-slot.svg-icon {
    color: var(--color-avocado-40);

    .bright & {
      color: var(--color-avocado-70);
    }
  }

  & .text-field {
    margin-bottom: 16px;

    &.lock, &.lock * {
      pointer-events: none;
    }
  }

  & .new-source__name .text-field {
    margin: 0;
    flex: 1;
  }
}

.new-source__status {
  height: 24px;
  align-self: stretch;
  color: var(--theme-secondary);

  & .error {
    color: var(--color-ketchup-30);
  }

  & {
    @mixin micro2;
  }

  & .spinner {
    margin: 0 auto;
  }
}

.new-source__exists {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;

  & > * {
    margin: 0 8px;

    &:last-child {
      margin-left: auto;
      color: var(--theme-primary);
    }
  }

  & img {
    width: 24px;
    height: 24px;
    overflow: hidden;
    border-radius: 4px;
  }

  & span {
    color: var(--theme-secondary);
  }
}

.new-source__header {
  padding-top: 40px;
  padding-bottom: 24px;
}

.new-source__header, .new-source__footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  padding-left: 32px;
  padding-right: 32px;
}

.new-source__contact {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  & span {
    flex: 1;
  }

  & .btn {
    height: 100%;
    padding: 4px 15px;
    --button-border-radius: 8px;
    @mixin nuggets;
  }
}

.new-source__footer {
  padding-bottom: 32px;
  background: var(--theme-background-secondary);
  border-top: solid 1px var(--theme-shine);

  &.no-padding {
    padding-left: 0;
    padding-right: 0;
  }

  & .radio {
    width: 100%;
    margin: 0;
    padding: 8px 32px;
    border-bottom: solid 1px var(--theme-shine);

    & .radio-item {
      height: 40px;
      margin: 0;
    }
  }
}

.new-source__confirm {
  margin-top: 16px;
  justify-content: center;
  width: 210px;
}

.new-source__name {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  margin: 32px 0 24px;

  & img {
    width: 54px;
    height: 54px;
    overflow: hidden;
    margin-right: 16px;
    border-radius: 8px;
  }
}

.new-source__submit {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  align-self: stretch;

  & > * {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 0 12px;

    &:first-child {
      margin-left: 0;

      & .new-source__submit__info {
        & h3 {
          color: var(--theme-secondary);
        }

        & p {
          color: var(--theme-disabled);
        }
      }
    }

    &:last-child {
      margin-right: 0;

      & .new-source__submit__info {
        position: relative;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 8px;
          background: var(--theme-premium);
          opacity: var(--theme-active-opacity);
        }

        & h3, & p {
          position: relative;
          color: var(--theme-primary);
          z-index: 1;
        }

        .bright & {
          &:before {
            opacity: var(--theme-focus-opacity);
          }

          & h3, & p, & strong {
            color: var(--color-bacon-60);
          }
        }
      }

      & .btn {
        --button-color: var(--color-salt-10);
        --button-background: var(--theme-premium);
      }
    }
  }

  & .new-source__submit__info {
    padding: 16px;
    flex: 1;

    & h3 {
      text-transform: none;
    }

    & p {
      text-align: left;
      font-size: 10px;
      letter-spacing: 0.33px;
      line-height: 14px;
      font-style: italic;
    }

    & a {
      color: var(--color-water-40);
    }

    & .premium-badge {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }
  }

  & .btn {
    margin-top: 24px;
    align-self: stretch;
    justify-content: center;
  }
}

.new-source__added {
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-self: stretch;
  margin: 32px 0 16px;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    margin: 0 12px;

    &:first-child {
      margin-left: 0;

      & svg {
        margin-top: 32px;
      }
    }

    &:last-child {
      margin-right: 0;

      & svg {
        margin-top: 48px;
      }
    }
  }
}
</style>
