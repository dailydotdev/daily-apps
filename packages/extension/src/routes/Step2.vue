<template>
  <main>
    <h1>Tell us what you're into</h1>
    <p>
      Pick tags you like. We will do the rest by choosing articles for your feed
      based on your preferences.
      Make sure you select at least 5 tags. Don't worry you can always change it later.
    </p>
    <div class="onboarding__tags onboarding__placeholder">
      <div class="onboarding__tags__search">
        <div class="tags__search__counter lil2" :class="{active: activeCounter}">
          {{ selectedTags.length }}/5
        </div>
        <div class="tags__search__box" :class="{focus}">
          <button class="btn-icon search__box__icon" v-if="focus" @click.prevent="clearQuery"
                  @focus="focus = true" @blur="focus = false">
            <svgicon name="x"/>
          </button>
          <svgicon name="magnifying" class="search__box__icon" v-else/>
          <input class="search__box__input micro1" type="text" placeholder="Search" ref="searchTags"
                 @input="searchTags" @focus="focus = true" @blur="focus = false">
        </div>
      </div>
      <div class="tags__buttons">
        <button v-for="tag in tags" :key="tag.name" class="btn btn-hollow"
                :class="{selected: tag.enabled}" @click="toggleTag(tag)">
          #{{ tag.name }}
        </button>
      </div>
    </div>
    <router-link to="/onboarding/3" class="btn btn-big btn-water-cheese"
                 :aria-disabled="disableButton" :class="{disabled: disableButton}">
      I'm all set
    </router-link>
  </main>
</template>
<script>
import { mapState } from 'vuex';
import '@daily/components/icons/x';
import '@daily/components/icons/magnifying';
import { contentService } from '../common/services';

export default {
  name: 'Step2',

  data() {
    return {
      rawTags: [],
      focus: false,
    };
  },

  computed: {
    ...mapState({
      selectedTags: state => state.feed.tags.filter(t => t.enabled),
    }),

    activeCounter() {
      return this.selectedTags.length > 0;
    },

    disableButton() {
      return this.selectedTags.length < 5;
    },

    tags() {
      return this.rawTags.map((t) => {
        const found = this.selectedTags.find(t2 => t2.name === t.name);
        const enabled = !!(found && found.enabled);
        return { name: t.name, enabled };
      });
    },
  },

  methods: {
    async searchTags(event) {
      const query = event.target.value;
      if (!query.length) {
        this.rawTags = await contentService.fetchPopularTags();
      } else {
        try {
          const res = await contentService.searchTags(query);
          this.rawTags = res.hits;
        } catch (err) {
          // TODO: handle error
          // eslint-disable-next-line
          console.error(err);
        }
      }
    },

    toggleTag(tag) {
      this.$store.dispatch('feed/setEnableTag', { tag, enabled: !tag.enabled })
      // TODO: handle error
      // eslint-disable-next-line
        .catch(console.error);
    },

    clearQuery() {
      this.$refs.searchTags.value = '';
      return this.searchTags({ target: this.$refs.searchTags });
    },
  },

  async mounted() {
    this.rawTags = await contentService.fetchPopularTags();
  },
};
</script>
<style>
.onboarding__tags {
  display: flex;
  width: 468px;
  height: 284px;
  flex-direction: column;
  justify-content: center;
}

.onboarding__tags__search {
  display: flex;
  height: 44px;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;

  & > * {
    margin: 0 8px;
    border-radius: 8px;
    background: var(--theme-background-secondary);
  }
}

.tags__search__counter {
  display: flex;
  width: 60px;
  align-items: center;
  justify-content: center;
  color: var(--theme-secondary);

  &.active {
    color: var(--theme-primary);
    background: var(--theme-background-highlight);
  }
}

.tags__search__box {
  display: flex;
  width: 256px;
  flex-direction: row;
  align-items: center;
  border: solid 1px transparent;

  &:hover {
    background: var(--theme-background-highlight);
  }

  &.focus {
    background: var(--theme-background-primary);
    border-color: var(--theme-primary);
  }
}

.search__box__input {
  flex: 1;
  margin: 0 8px;
  background: none;
  border: none;
  color: var(--theme-primary);
  caret-color: var(--color-water-60);

  &:focus {
    outline: 0;
  }

  &::placeholder {
    color: var(--theme-disabled);
  }
}

.search__box__icon {
  width: 26px;
  height: 26px;
  margin-left: 16px;

  &.btn-icon .svg-icon {
    width: 100%;
    height: 100%;
    margin: 0;
  }
}

.tags__buttons {
  display: flex;
  overflow: hidden;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  margin: 56px -8px -8px;

  & .btn {
    margin: 8px;
    text-transform: none;
    font-weight: 300;
  }
}
</style>
