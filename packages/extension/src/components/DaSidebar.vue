<template>
  <aside class="sidebar" :class="{opened}"
         @mouseleave="close">
    <div class="sidebar__wrapper">
      <div class="sidebar__filter">
        <da-mode-switch class="sidebar__filter_switch"
                        first-icon="link" second-icon="hashtag"
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
                    title="Click to view only this tag" @click.prevent="viewTag(item)">
              <span class="invert sidebar__tag shadow1 text-overflow">#{{item.name}}</span>
            </button>
            <button class="sidebar__element__button-hidden btn-icon"
                    title="Remove this tag" @click.prevent.stop="setEnableTag(item, false)">
              <svgicon name="x"/>
            </button>
          </div>
        </div>
        <div class="sidebar__disabled" v-if="disabledTags.length > 0">
          <div class="sidebar__header">{{query.length ? 'More tags' : 'Hot tags'}}</div>
          <div class="sidebar__element off btn btn-menu"
               v-for="item in disabledTags" :key="item.name">
            <button class="sidebar__element__button"
                    title="Click to view only this tag" @click.prevent="viewTag(item)">
              <span class="text-overflow">#{{item.name}}</span>
            </button>
            <button class="sidebar__element__button-hidden show btn-icon"
                    title="Add this tag"
                    @click.prevent.stop="setEnableTag(item, true)">
              <svgicon name="plus"/>
            </button>
          </div>
        </div>
      </div>

      <div class="sidebar__sources" v-else>
        <div class="sidebar__enabled">
          <div class="sidebar__header">My sources</div>
          <button class="sidebar__element sidebar__sources__act-req btn btn-menu"
                  @click.prevent="activateRequest" v-if="!requestActive">
            <svgicon name="plus" class="sidebar__element__image"/>
            <span>Request source</span>
          </button>
          <form class="sidebar__element btn btn-menu selected" v-else
                @click.prevent="$refs.request.focus()" ref="form">
            <button type="button" class="btn-icon btn-small" @click="cancelRequest">
              <svgicon name="x" class="sidebar__element__image"/>
            </button>
            <input class="sidebar__input" type="url" placeholder="Paste URL" required
                   ref="request" @input="updateFormValidity">
            <button type="submit" class="sidebar__sources__submit btn btn-invert"
                    :disabled="disableSubmit" @click.prevent="submitRequest">
              <svgicon name="v" class="invert"/>
            </button>
            <transition name="bouncy-flip">
              <div class="sidebar__sources__error nuggets" v-if="submitError">
                Something went wrong, try again later
              </div>
            </transition>
          </form>
          <div class="sidebar__element btn btn-menu" v-for="item in enabledPubs"
               :key="item.id">
            <button class="sidebar__element__button"
                    title="Click to view only this source" @click.prevent="viewPublication(item)">
              <img :data-src="item.image" :alt="item.name"
                   class="sidebar__element__image lazyload"/>
              <span class="text-overflow">{{item.name}}</span>
            </button>
            <button class="sidebar__element__button-hidden btn-icon"
                    title="Remove this source"
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
                    title="Click to view only this source"
                    @click.prevent="viewPublication(item)">
              <img :data-src="item.image" :alt="item.name"
                   class="sidebar__element__image lazyload"/>
              <span class="text-overflow">{{item.name}}</span>
            </button>
            <button class="sidebar__element__button-hidden show btn-icon"
                    title="Add this source"
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
import { mapState, mapActions, mapGetters } from 'vuex';
import DaModeSwitch from '@daily/components/src/components/DaModeSwitch.vue';
import { contentService } from '../common/services';

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

  data() {
    return {
      opened: false,
      filterChecked: false,
      requestActive: false,
      disableSubmit: true,
      submitError: false,
      searchedTags: [],
      searchFocused: false,
      query: '',
    };
  },

  computed: {
    ...mapState('feed', ['publications', 'tags']),
    ...mapGetters('user', ['isLoggedIn']),
    enabledPubs() {
      return this.filteredPublications.filter(x => x.enabled);
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
    filteredPublications() {
      if (!this.query.length) {
        return this.publications;
      }

      return this.publications.filter(
        pub => pub.name.toLowerCase().includes(this.query.toLowerCase()),
      );
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
      this.resetRequest();
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
      const index = this.publications.findIndex(p => p.id === pub.id);
      this.$store.dispatch('feed/setEnablePublication', { index, enabled })
      // TODO: handle error
      // eslint-disable-next-line
                .catch(console.error);
    },
    // eslint-disable-next-line no-unused-vars
    viewPublication(pub) {
      ga('send', 'event', 'Publications', 'Single');
      this.setFilter({ type: 'publication', info: pub });
    },
    activateRequest() {
      if (this.isLoggedIn) {
        ga('send', 'event', 'Request Source', 'Activate');
        this.requestActive = true;
        this.$nextTick(() => {
          this.$refs.request.focus();
        });
      } else {
        this.$emit('login');
      }
    },
    cancelRequest() {
      ga('send', 'event', 'Request Source', 'Cancel');
      this.resetRequest();
    },
    resetRequest() {
      if (this.requestActive) {
        this.requestActive = false;
        this.$refs.request.value = '';
        this.submitError = false;
      }
    },
    async submitRequest() {
      ga('send', 'event', 'Request Source', 'Submit');
      try {
        this.submitError = false;
        await contentService.requestPublication(this.$refs.request.value);
        this.resetRequest();
        this.$emit('requested-source');
      } catch {
        this.submitError = true;
      }
    },
    setEnableTag(tag, enabled) {
      ga('send', 'event', 'Tags', 'Toggle', enabled ? 'Check' : 'Uncheck');
      this.$store.dispatch('feed/setEnableTag', { tag, enabled })
      // TODO: handle error
      // eslint-disable-next-line
                .catch(console.error);
    },
    viewTag(tag) {
      ga('send', 'event', 'Tags', 'Single');
      this.setFilter({ type: 'tag', info: tag });
    },
    updateFormValidity() {
      this.disableSubmit = !this.$refs.form.checkValidity();
      this.submitError = false;
    },
    async searchTags(event) {
      if (!this.query.length) {
        ga('send', 'event', 'Tags', 'Search');
      }
      const query = event.target.value;
      this.query = query;
      if (!query.length) {
        this.searchedTags = [];
      } else {
        try {
          const res = await contentService.searchTags(query);
          this.searchedTags = res.hits;
        } catch (err) {
          // TODO: handle error
          // eslint-disable-next-line
                    console.error(err);
        }
      }
    },
    setOpened(opened) {
      setTimeout(() => {
        this.opened = opened;
      });
    },

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

  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: var(--theme-disabled);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--theme-secondary);
  }

  &::-webkit-scrollbar-thumb:active {
    background: var(--theme-primary);
  }
}

.sidebar__filter {
  display: flex;
  padding-top: 48px;
  background: var(--theme-background-highlight);
}

.sidebar__filter_switch {
  margin: 26px auto;
}

.sidebar__sources .sidebar__element,
.sidebar__element.sidebar__search {
  height: 44px;
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

  & .sidebar__sources__submit {
    width: 30px;
    height: 30px;
    padding: 3px;
    border-radius: 8px;

    &:before {
      transition: background-color 0.1s linear;
    }

    & .svg-icon:first-child {
      margin: 0;
    }
  }
}

.sidebar__sources__error {
  position: absolute;
  display: flex;
  left: 0;
  right: 0;
  top: 100%;
  width: 198px;
  height: 48px;
  align-items: center;
  justify-content: center;
  margin: -4px auto 0;
  padding: 0 12px;
  border-radius: 4px;
  color: var(--theme-primary);
  background: var(--color-ketchup-80);
  box-shadow: 0 var(--theme-shadow-offset) 16px 4px rgba(0, 0, 0, 0.32);
  will-change: transform;
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
  z-index: 2;
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
