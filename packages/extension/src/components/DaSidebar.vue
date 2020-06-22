<template>
  <aside class="sidebar" :class="{opened}"
         @mouseleave="close">
    <div class="sidebar__wrapper scrollbar">
      <div class="sidebar__filter">
        <da-mode-switch class="sidebar__filter_switch"
                        first-icon="link" second-icon="hashtag"
                        v-tooltip="filterChecked ? 'View sources list' : 'View tags list'"
                        :checked="filterChecked" @toggle="toggleFilter($event)"/>
      </div>

      <div class="sidebar__element sidebar__search btn btn-menu"
           :class="{selected: searchFocused}">
        <svgicon name="magnifying" class="sidebar__element__image"/>
        <input class="sidebar__input" type="text" :placeholder="searchPlaceholder" ref="search"
               v-on="{ input: filterChecked ? searchTags : searchPublications }"
               @focus="searchFocused = true" @blur="searchFocused = false">
      </div>

      <div class="sidebar__tags" v-if="filterChecked">
        <div class="sidebar__enabled">
          <div class="sidebar__header">My tags</div>
          <div class="sidebar__element btn btn-menu"
               v-for="item in enabledTags" :key="item.name">
            <button class="sidebar__element__button"
                    v-tooltip="'View tag'" @click.prevent="viewTag(item)">
              <span class="invert sidebar__tag shadow1 text-overflow">#{{item.name}}</span>
            </button>
            <button class="sidebar__element__button-hidden btn-icon"
                    v-tooltip="'Remove tag from feed'"
                    @click.prevent.stop="setEnableTag(item, false)">
              <svgicon name="x"/>
            </button>
          </div>
        </div>
        <div class="sidebar__disabled" v-if="disabledTags.length > 0">
          <div class="sidebar__header">{{query.length ? 'More tags' : 'Hot tags'}}</div>
          <div class="sidebar__element off btn btn-menu"
               v-for="item in disabledTags" :key="item.name">
            <button class="sidebar__element__button"
                    v-tooltip="'View tag'" @click.prevent="viewTag(item)">
              <span class="text-overflow">#{{item.name}}</span>
            </button>
            <button class="sidebar__element__button-hidden show btn-icon"
                    v-tooltip="'Add tag to feed'"
                    @click.prevent.stop="setEnableTag(item, true)">
              <svgicon name="plus"/>
            </button>
          </div>
        </div>
      </div>

      <div class="sidebar__sources" v-else>
        <div class="sidebar__enabled">
          <button class="sidebar__element sidebar__sources__act-req btn btn-menu"
                  @click.prevent="activateRequest">
            <svgicon name="plus" class="sidebar__element__image"/>
            <span>Add new source</span>
          </button>
          <div v-if="enabledPrivatePubs.length" class="sidebar__header">My private sources</div>
          <div class="sidebar__element btn btn-menu" v-for="item in enabledPrivatePubs"
               :key="item.id">
            <button class="sidebar__element__button"
                    v-tooltip="'View source'" @click.prevent="viewPublication(item)">
              <img :data-src="item.image" :alt="item.name"
                   class="sidebar__element__image lazyload"/>
              <span class="text-overflow">{{item.name}}</span>
            </button>
            <button class="sidebar__element__button-hidden btn-icon"
                    v-tooltip="'Remove source from feed'"
                    @click.prevent.stop="setEnablePublication(item, false)">
              <svgicon name="x"/>
            </button>
          </div>
          <div class="sidebar__header">My public sources</div>
          <div class="sidebar__element btn btn-menu" v-for="item in enabledPubs"
               :key="item.id">
            <button class="sidebar__element__button"
                    v-tooltip="'View source'" @click.prevent="viewPublication(item)">
              <img :data-src="item.image" :alt="item.name"
                   class="sidebar__element__image lazyload"/>
              <span class="text-overflow">{{item.name}}</span>
            </button>
            <button class="sidebar__element__button-hidden btn-icon"
                    v-tooltip="'Remove source from feed'"
                    @click.prevent.stop="setEnablePublication(item, false)">
              <svgicon name="x"/>
            </button>
          </div>
        </div>
        <div class="sidebar__disabled" v-if="disabledPubs.length > 0">
          <div class="sidebar__header">More sources</div>
          <div class="sidebar__element off btn btn-menu"
               v-for="item in disabledPubs" :key="item.id">
            <button class="sidebar__element__button"
                    v-tooltip="'View source'"
                    @click.prevent="viewPublication(item)">
              <img :data-src="item.image" :alt="item.name"
                   class="sidebar__element__image lazyload"/>
              <span class="text-overflow">{{item.name}}</span>
            </button>
            <button class="sidebar__element__button-hidden show btn-icon"
                    v-tooltip="'Add source to feed'"
                    @click.prevent.stop="setEnablePublication(item, true)">
              <svgicon name="plus"/>
            </button>
          </div>
        </div>
      </div>

    </div>
  </aside>
</template>

<script>
import 'lazysizes';
import {
  mapState, mapActions, mapGetters, mapMutations,
} from 'vuex';
import { NetworkStatus } from 'apollo-client';
import DaModeSwitch from '@daily/components/src/components/DaModeSwitch.vue';
import { SOURCES_QUERY } from '../graphql/sidebar';
import { POPULAR_TAGS_QUERY, SEARCH_TAGS_QUERY } from '../graphql/tags';

export default {
  name: 'DaSidebar',

  components: {
    DaModeSwitch,
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  apollo: {
    rawPublications: {
      query: SOURCES_QUERY,
      fetchPolicy: 'cache-and-network',
      update: data => data.sources.edges.map(e => e.node),
      result(args) {
        return this.dataLoaded(args);
      },
    },
    rawTags: {
      query: POPULAR_TAGS_QUERY,
      fetchPolicy: 'cache-and-network',
      update: data => data.popularTags,
      result(args) {
        return this.dataLoaded(args);
      },
    },
    searchedTags: {
      query: SEARCH_TAGS_QUERY,
      fetchPolicy: 'no-cache',
      variables() {
        return { query: this.query };
      },
      skip() {
        return !this.query.length && !this.filterChecked;
      },
      update: data => data.searchTags.hits,
    },
  },

  data() {
    return {
      opened: false,
      filterChecked: false,
      searchedTags: [],
      searchFocused: false,
      query: '',
      rawPublications: [],
      rawTags: [],
      loaded: false,
    };
  },

  computed: {
    ...mapState('feed', ['tags']),
    ...mapGetters('user', ['isLoggedIn']),
    enabledPrivatePubs() {
      return this.filteredPublications.filter(x => x.enabled && !x.public);
    },
    enabledPubs() {
      return this.filteredPublications.filter(x => x.enabled && x.public);
    },
    disabledPubs() {
      return this.filteredPublications.filter(x => !x.enabled);
    },
    enabledTags() {
      return this.activeTags.filter(x => x.enabled);
    },
    disabledTags() {
      return this.activeTags.filter(x => !x.enabled);
    },
    activeTags() {
      if (this.query.length) {
        return this.searchedTags.map((t) => {
          const found = this.tags.find(t2 => t2.name === t.name);
          const enabled = !!(found && found.enabled);
          return { name: t.name, enabled };
        });
      }
      return this.tags;
    },
    searchPlaceholder() {
      return `Search ${this.filterChecked ? 'Tags' : 'Sources'}`;
    },
    tags() {
      if (!this.rawTags) {
        return [];
      }
      return this.rawTags.map(t => ({
        ...t,
        enabled: !!this.$store.state.feed.enabledTags[t.name],
      }));
    },
    publications() {
      if (!this.rawPublications) {
        return [];
      }
      return this.rawPublications.map(p => ({
        ...p,
        enabled: !this.$store.state.feed.disabledPublications[p.id],
      }));
    },
    filteredPublications() {
      if (!this.query.length) {
        return this.publications;
      }

      return this.publications.filter(
        pub => pub.name.toLowerCase().includes(this.query.toLowerCase()),
      );
    },
  },
  watch: {
    loaded(val) {
      if (val) {
        this.$emit('loaded');
      }
    },
  },
  methods: {
    open() {
      if (this.opened || this.disabled) {
        return;
      }

      ga('send', 'event', 'Sidebar', 'Toggle', 'Open');
      this.setOpened(true);
    },
    close() {
      if (!this.opened) {
        return;
      }

      ga('send', 'event', 'Sidebar', 'Toggle', 'Close');
      this.setOpened(false);
    },
    toggleFilter(checked) {
      ga('send', 'event', 'Sidebar', 'Filter', checked ? 'Tags' : 'Publications');
      this.filterChecked = checked;
      this.query = '';

      this.$refs.search.value = '';
    },
    setEnablePublication(pub, enabled) {
      ga('send', 'event', 'Publications', 'Toggle', enabled ? 'Check' : 'Uncheck');
      // TODO: handle error
      this.$store.dispatch('feed/setEnablePublication', { id: pub.id, enabled });
    },
    // eslint-disable-next-line no-unused-vars
    viewPublication(pub) {
      ga('send', 'event', 'Publications', 'Single');
      this.setFilter({ type: 'publication', info: pub });
    },
    activateRequest() {
      if (this.isLoggedIn) {
        ga('send', 'event', 'Request Source', 'Activate');
        this.setShowNewSource(true);
      } else {
        this.$emit('login');
      }
    },
    setEnableTag(tag, enabled) {
      ga('send', 'event', 'Tags', 'Toggle', enabled ? 'Check' : 'Uncheck');
      // TODO: handle error
      this.$store.dispatch('feed/setEnableTag', { tag: tag.name, enabled });
    },
    viewTag(tag) {
      ga('send', 'event', 'Tags', 'Single');
      this.setFilter({ type: 'tag', info: tag });
    },
    async searchTags(event) {
      if (!this.query.length) {
        ga('send', 'event', 'Tags', 'Search');
      }
      const query = event.target.value;
      this.query = query;
      if (!query.length) {
        this.searchedTags = [];
      }
    },
    setOpened(opened) {
      setTimeout(() => {
        this.opened = opened;
      });
    },
    dataLoaded({ networkStatus, loading }) {
      if (networkStatus === NetworkStatus.ready && !loading && !this.loaded) {
        this.loaded = this.rawPublications.length > 0 && this.rawTags.length > 0;
      }
    },

    ...mapMutations({
      setShowNewSource: 'ui/setShowNewSource',
    }),

    ...mapActions({
      setFilter: 'feed/setFilter',
    }),

    searchPublications(ev) {
      this.query = ev.target.value.trim();
    },
  },

  mounted() {
    import('@daily/components/icons/link');
    import('@daily/components/icons/hashtag');
    import('@daily/components/icons/plus');
    import('@daily/components/icons/x');
    import('@daily/components/icons/v');
    import('@daily/components/icons/magnifying');
  },
};
</script>

<style>
.sidebar {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  width: 264px;
  height: 100%;
  overflow: hidden;
  background: var(--theme-background-primary);
  border-right: 1px solid var(--theme-background-primary);
  box-shadow: var(--theme-shadow-offset) 0 16px 0 rgba(0, 0, 0, .1);
  transform: translateX(-100%);
  transition: transform 0.15s linear;
  will-change: transform;
  z-index: 20;
  contain: layout paint size;

  &.opened {
    transform: none;
  }

  & .text-overflow {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  }
}

.sidebar__wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 8px;
    height: 100%;
    background: var(--theme-background-highlight);
    z-index: -1;
  }
}

.sidebar__filter {
  display: flex;
  padding-top: 48px;
  background: var(--theme-background-highlight);
}

.sidebar__filter_switch {
  margin: 24px auto;
}

.sidebar__sources .text-overflow {
  flex: 1;
  text-align: start;
}

.sidebar__sources .sidebar__element,
.sidebar__element.sidebar__search {
  height: 44px;
}

.sidebar__sources .sidebar__enabled .sidebar__header {
  margin-top: 16px;
}

.sidebar__tags .sidebar__element {
  height: 40px;
}

.sidebar__element {
  --button-color: var(--theme-secondary);
  text-transform: none;
}

.sidebar__element, .sidebar__element .sidebar__element__button {
  & {
    @mixin micro1;
  }
}

.sidebar__element .sidebar__element__button {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none;
  background: none;
  color: var(--button-color);
  cursor: pointer;

  & {
    @mixin micro1;
  }
}

.sidebar__element {
  width: 100%;
  padding: 0 16px;

  & .sidebar__element__button {
    display: flex;
    height: 100%;
    padding: 0;
    min-width: 0;
    flex: 1;
  }

  &.off:hover {
    & .sidebar__element__button {
      color: var(--theme-primary);
    }
  }

  &:hover {
    & .sidebar__element__button-hidden {
      display: flex;
    }
  }

  & .sidebar__element__image {
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }

  & > .sidebar__element__image:first-child,
  & .sidebar__element__button .sidebar__element__image {
    margin-left: 0;
    margin-right: 16px;
  }

  & .sidebar__element__button-hidden {
    display: none;
    margin-left: auto;

    & .svg-icon {
      width: 20px;
      height: 20px;
    }

    &.show {
      display: flex;
    }
  }
}

form.sidebar__element {
  position: relative;
  cursor: text;
  overflow: visible;
  z-index: 2;

  & .sidebar__element__image {
    margin-right: 0;
  }
}

.sidebar__header {
  height: auto;
  margin: 0 16px 8px;
  padding: 0;
  color: var(--theme-disabled);

  & {
    @mixin lil2;
  }
}

.sidebar__enabled {
  border-radius: 0 0 8px 8px;
  padding-bottom: 8px;
  background: var(--theme-background-highlight);
}

.sidebar__disabled {
  padding: 16px 0;
}

.sidebar__tags .sidebar__disabled,
.sidebar__sources .sidebar__disabled {
  padding-bottom: 44px;
}

.sidebar__input {
  width: 100%;
  flex: 1;
  margin: 0 8px;
  color: var(--theme-primary);
  background: none;
  border: none;
  caret-color: var(--color-water-60);
  min-width: 0;

  & {
    @mixin micro1;
  }

  &:focus {
    outline: 0;
  }

  &::placeholder {
    color: var(--theme-secondary);
  }
}

.sidebar__tag {
  padding: 2px 8px;
  color: var(--theme-primary);
  background: var(--theme-background-highlight);
  border-radius: 4px;
}

.sidebar__element.sidebar__search {
  position: fixed;
  bottom: 0;
  background: var(--theme-background-secondary);
  border-top: 1px solid var(--theme-separator);
  z-index: 10001;
  --button-border-radius: 0;

  & .sidebar__element__image {
    margin: 0;
  }

  & .sidebar__input {
    margin-right: 0;
  }
}

.bouncy-flip-enter-active,
.bouncy-flip-leave-active {
  transform-origin: 50% 0;
}

.bouncy-flip-enter-active {
  animation: flipInX 0.5s;
}

.bouncy-flip-leave-active {
  animation: flipInXSimple 0.3s reverse;
}

@keyframes flipInX {
  0% {
    transform: perspective(400px) rotate3d(1, 0, 0, -90deg);
    transition-timing-function: ease-in;
  }

  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, 20deg);
    transition-timing-function: ease-out;
  }

  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, -10deg);
    transition-timing-function: ease-in;
    opacity: 1;
  }

  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, 5deg);
    transition-timing-function: ease-out;
  }

  100% {
    transform: perspective(400px);
  }
}

@keyframes flipInXSimple {
  0% {
    transform: perspective(400px) rotate3d(1, 0, 0, -90deg);
    transition-timing-function: ease-in;
  }
  100% {
    transform: perspective(400px);
  }
}
</style>
