<template>
  <aside class="sidebar" :class="{opened, transitioning}">
    <div class="sidebar__content" @mouseleave="readyToClose = true"
         @mouseenter="readyToClose = false">
      <div class="sidebar__content__wrapper">
        <div class="sidebar__filter">
          <da-mode-switch class="sidebar__filter_switch"
                          first-icon="link" second-icon="hashtag"
                          :checked="filterChecked" @toggle="toggleFilter"/>
        </div>
        <div class="sidebar__content__element sidebar__tags__search" v-if="filterChecked">
          <svgicon name="magnifying" class="sidebar__content__element__image no-hover"/>
          <input class="sidebar__input" type="text" placeholder="Search tags" ref="searchTags"
                 @input="updateSearch">
        </div>
        <div class="sidebar__tags" v-if="filterChecked">
          <div class="sidebar__content__enabled">
            <div class="sidebar__content__header">My tags</div>
            <div class="sidebar__content__element" v-for="item in enabledTags" :key="item.name">
              <button class="sidebar__content__element__button"
                      title="Click to view only this tag" @click.prevent="viewTag(item)">
                <span class="invert sidebar__tag shadow1 text-overflow">#{{item.name}}</span>
              </button>
              <button class="sidebar__content__element__button-hidden btn-icon"
                      title="Remove this tag" @click.prevent.stop="setEnableTag(item, false)">
                <svgicon name="x"/>
              </button>
            </div>
          </div>
          <div class="sidebar__content__disabled" v-if="disabledTags.length > 0">
            <div class="sidebar__content__header">More tags</div>
            <div class="sidebar__content__element disabled" v-for="item in disabledTags"
                 :key="item.name">
              <button class="sidebar__content__element__button"
                      title="Click to view only this tag" @click.prevent="viewTag(item)">
                <span class="text-overflow">#{{item.name}}</span>
              </button>
              <button class="sidebar__content__element__button-hidden show btn-icon"
                      title="Add this tag"
                      @click.prevent.stop="setEnableTag(item, true)">
                <svgicon name="plus"/>
              </button>
            </div>
          </div>
        </div>
        <div class="sidebar__sources" v-else>
          <div class="sidebar__content__enabled">
            <div class="sidebar__content__header">My sources</div>
            <template v-if="isLoggedIn">
              <button class="sidebar__content__element sidebar__sources__activate-request"
                      @click.prevent="activateRequest" v-if="!requestActive">
                <svgicon name="plus" class="sidebar__content__element__image no-hover"/>
                <span>Request source</span>
              </button>
              <form class="sidebar__content__element" v-else @click.prevent="$refs.request.focus()"
                    ref="form">
                <button type="button" class="btn-icon btn-small" @click="cancelRequest">
                  <svgicon name="x" class="sidebar__content__element__image"/>
                </button>
                <input class="sidebar__input" type="url" placeholder="Paste URL" required
                       ref="request" @input="updateFormValidity">
                <button type="submit" class="sidebar__sources__submit btn-icon"
                        :class="{invert: !disableSubmit}" :disabled="disableSubmit"
                        @click.prevent="submitRequest">
                  <svgicon name="v" class="invert"/>
                </button>
                <transition name="bouncy-flip">
                  <div class="sidebar__sources__error nuggets" v-if="submitError">
                    Something went wrong, try again later
                  </div>
                </transition>
              </form>
            </template>
            <div class="sidebar__content__element" v-for="item in enabledPubs"
                 :key="item.id">
              <button class="sidebar__content__element__button"
                      title="Click to view only this source" @click.prevent="viewPublication(item)">
                <img :data-src="item.image" :alt="item.name"
                     class="sidebar__content__element__image lazyload"/>
                <span class="text-overflow">{{item.name}}</span>
              </button>
              <button class="sidebar__content__element__button-hidden btn-icon"
                      title="Remove this source"
                      @click.prevent.stop="setEnablePublication(item, false)">
                <svgicon name="x"/>
              </button>
            </div>
          </div>
          <div class="sidebar__content__disabled" v-if="disabledPubs.length > 0">
            <div class="sidebar__content__header">More sources</div>
            <div class="sidebar__content__element disabled" v-for="item in disabledPubs"
                 :key="item.id">
              <button class="sidebar__content__element__button"
                      title="Click to view only this source"
                      @click.prevent="viewPublication(item)">
                <img :data-src="item.image" :alt="item.name"
                     class="sidebar__content__element__image lazyload"/>
                <span class="text-overflow">{{item.name}}</span>
              </button>
              <button class="sidebar__content__element__button-hidden show btn-icon"
                      title="Add this source"
                      @click.prevent.stop="setEnablePublication(item, true)">
                <svgicon name="plus"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidebar__trigger" @mouseenter="open" @mouseleave="close"
         @transitionend="transitioning = false">
      <svgicon icon="hamburger" class="no-hover sidebar__trigger_icon"/>
      <div class="sidebar__trigger__lines" ref="lines">
        <pre v-for="n in lines" class="micro2" :key="n">{{ n }}</pre>
      </div>
      <svg class="sidebar__trigger__collapse" width="10" height="12" viewBox="0 0 10 12"
           xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
          <g>
            <path class="fill" d="M0 0h10v7.826L5 12 0 7.826z"></path>
            <path class="stroke" d="M.5.5v7.092L5 11.35 9.5 7.59V.5h-9z"></path>
          </g>
          <path d="M3 5h4" class="stroke" stroke-linecap="square"></path>
        </g>
      </svg>
    </div>
    <div class="sidebar__trigger__bg"></div>
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
      lines: 1,
      opened: false,
      readyToClose: false,
      transitioning: false,
      filterChecked: false,
      requestActive: false,
      disableSubmit: true,
      submitError: false,
      searchedTags: [],
      query: '',
    };
  },

  computed: {
    ...mapState('feed', ['publications', 'tags']),
    ...mapGetters('user', ['isLoggedIn']),
    enabledPubs() {
      return this.publications.filter(x => x.enabled);
    },
    disabledPubs() {
      return this.publications.filter(x => !x.enabled);
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
  },

  methods: {
    invalidate() {
      requestAnimationFrame(() => {
        const pres = this.$refs.lines.querySelectorAll('pre');
        const lines = Math.ceil(this.$refs.lines.clientHeight / pres[0].clientHeight);
        if (lines > this.lines) {
          this.lines = lines;
        }
      });
    },
    open() {
      if (this.transitioning || this.opened || this.disabled) {
        return;
      }

      ga('send', 'event', 'Sidebar', 'Toggle', 'Open');
      this.readyToClose = false;
      this.setOpened(true);
    },
    close() {
      this.$nextTick(() => {
        if (!this.opened || !this.readyToClose || this.transitioning) {
          return;
        }

        ga('send', 'event', 'Sidebar', 'Toggle', 'Close');
        this.resetRequest();
        this.setOpened(false);
      });
    },
    toggleFilter(checked) {
      ga('send', 'event', 'Sidebar', 'Filter', checked ? 'Tags' : 'Publications');
      this.filterChecked = checked;
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
      ga('send', 'event', 'Request Source', 'Activate');
      this.requestActive = true;
      this.$nextTick(() => {
        this.$refs.request.focus();
      });
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
    async updateSearch(event) {
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

    ...mapActions({
      setFilter: 'feed/setFilter',
    }),
  },

  created() {
    this.setOpened = (opened) => {
      this.transitioning = true;
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          this.opened = opened;
        });
      });
    };
  },

  mounted() {
    import('@daily/components/icons/hamburger');
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
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 20;

  --trigger-width: 36px;
  --content-width: 264px;

  &.opened {
    & .sidebar__content {
      display: block;
    }

    & > * {
      transform: translateX(var(--content-width));
    }
  }

  &.transitioning {
    & .sidebar__content {
      display: block;
    }

    & > * {
      transition: transform 0.2s ease-in;
      will-change: transform;
    }
  }

  & .text-overflow {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  }
}

.sidebar__content {
  display: none;
  position: fixed;
  left: calc(var(--content-width) * -1);
  top: 0;
  width: var(--content-width);
  height: 100%;
  background: var(--theme-background-primary);
  border-right: 1px solid var(--theme-background-primary);
  box-shadow: var(--theme-shadow-offset) 0 16px 0 rgba(0, 0, 0, .1);
}

.sidebar__content__wrapper {
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

.sidebar__trigger {
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  width: var(--trigger-width);
  height: 100%;
  flex-direction: column;
  padding: 68px 0 0 0;

  & > * {
    margin: 8px 0;
  }
}

.sidebar__trigger_icon {
  align-self: center;
}

.sidebar__trigger__bg {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--trigger-width);
  height: 100%;
  background: var(--theme-background-highlight);
  border-right: 1px solid var(--theme-separator);
  z-index: -1;
}

.sidebar__trigger__lines {
  flex: 1;
  overflow: hidden;
  margin-right: 8px;

  & pre {
    color: var(--theme-disabled);
    text-align: right;
    margin: 0;
  }
}

.sidebar__trigger__collapse {
  position: absolute;
  width: 10px;
  height: 12px;
  right: -5px;
  top: 118px;
  margin: 0;

  & .fill {
    fill: var(--theme-background-primary);
  }

  & .stroke {
    stroke: var(--theme-separator);
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

.sidebar__sources .sidebar__content__element,
.sidebar__content__element.sidebar__tags__search {
  height: 44px;
}

.sidebar__tags .sidebar__content__element {
  height: 40px;
}

.sidebar__content__element, .sidebar__content__element .sidebar__content__element__button {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none;
  background: none;
  color: var(--theme-secondary);
  cursor: pointer;

  & {
    @mixin micro1;
  }
}

.sidebar__content__element {
  width: 100%;
  padding: 0 16px;

  & .sidebar__content__element__button {
    display: flex;
    height: 100%;
    padding: 0;
    min-width: 0;
  }

  &.disabled:hover {
    color: var(--theme-primary);

    & .sidebar__content__element__button {
      color: var(--theme-primary);
    }
  }

  &:hover {
    background: var(--theme-background-primary);

    & .sidebar__content__element__button-hidden {
      display: flex;
    }
  }

  & .sidebar__content__element__image {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    margin-right: 16px;
  }

  & .sidebar__content__element__button-hidden {
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

form.sidebar__content__element {
  position: relative;
  background: var(--theme-background-primary);
  cursor: text;

  & .sidebar__content__element__image {
    margin-right: 0;
  }

  & .sidebar__sources__submit {
    padding: 3px;
    background: var(--theme-background-highlight);
    border-radius: 8px;
    transition: background-color 0.1s linear;

    & .svg-icon {
      color: var(--theme-primary);
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

.sidebar__content__header {
  height: auto;
  margin: 0 16px 8px;
  padding: 0;
  color: var(--theme-disabled);

  & {
    @mixin lil2;
  }
}

.sidebar__content__enabled {
  border-radius: 0 0 8px 8px;
  padding-bottom: 8px;
  background: var(--theme-background-highlight);
}

.sidebar__content__disabled {
  padding: 16px 0;
}

.sidebar__tags .sidebar__content__disabled {
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

  & {
    @mixin micro1;
  }

  &:focus {
    outline: 0;
  }

  &::placeholder {
    color: var(--theme-disabled);
  }
}

.sidebar__tag {
  padding: 2px 8px;
  color: var(--theme-primary);
  background: var(--theme-background-highlight);
  border-radius: 4px;
}

.sidebar__tags__search {
  position: fixed;
  bottom: 0;
  background-color: var(--theme-background-secondary);
  border-top: 1px solid var(--theme-separator);

  &:hover {
    background-color: var(--theme-background-highlight);
  }

  & .sidebar__content__element__image {
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
