<template>
  <da-modal class="bookmark-modal new-source" @close="$emit('close')">
    <button class="btn-icon modal__close-btn" @click="$emit('close')">
      <svgicon name="x"/>
    </button>
    <div v-if="added" class="new-source__header">
      <h3>Source added 🎉</h3>
      <p>
        From now on, new articles from this source will be added to your feed.
        You can find all of your private sources in the sidebar to the left.
        Enjoy
      </p>
      <button class="btn btn-big btn-invert new-source__confirm"
              @click="$emit('close')">
        Ok, got it
      </button>
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
                      @validity="valid = $event" :class="{lock: hasSelectedRSS}"
                      @enter="checkUrl">
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
            class="btn btn-hollow" target="_blank"
            rel="noopener noreferrer">Contact</a>
        </div>
        <span v-else-if="valid === false" class="error">Url is not valid</span>
      </div>
    </div>
    <div class="new-source__footer" v-if="!added && hasSelectedRSS && !existsSource">
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
              Read the <a href="https://daily.dev/content-guidelines" target="_blank"
                          rel="noopener noreferrer">content guidelines</a>
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
import { SOURCES_QUERY } from '../graphql/sidebar';

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
                website: this.source.website,
              },
            },
            update: (store, { data: { addPrivateSource } }) => {
              try {
                const data = store.readQuery({ query: SOURCES_QUERY });
                data.sources.edges.push({ node: addPrivateSource, __typename: 'SourceEdge' });
                store.writeQuery({ query: SOURCES_QUERY, data });
              } catch (err) {
                // TODO: handle error
              }
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
  color: var(--theme-primary);

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
