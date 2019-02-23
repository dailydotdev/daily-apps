<template>
  <div class="app">
    <da-header @go="onGoClicked"></da-header>
    <da-sidebar ref="sidebar"></da-sidebar>
    <div class="content">
      <div class="content__header">
        <template v-if="filter">
          <button class="btn content__header__back-home" @click="onBackHome">
            <svgicon icon="arrow"/>
            <span>Back Home</span>
          </button>
          <img :src="filter.info.image" :alt="filter.info.name"
               v-if="filter.type === 'publication'" class="content__header__pub-image"/>
          <h4>// {{ filter.info.name }}</h4>
          <transition name="fade">
            <button class="btn content__header__add-filter" @click="onAddFilter" v-if="!hasFilter">
              <svgicon icon="plus"/>
              <span>Add To Feed</span>
            </button>
          </transition>
        </template>
        <template v-else>
          <h4 v-if="!emptyBookmarks" class="uppercase">/* {{ title }} */</h4>
          <a class="header__cta shadow " :href="cta.link" target="_blank"
             @mouseup="ctaClick" :style="cta.style">
            <span class="header__cta__text">// {{cta.text}}</span>
            <img class="header__cta__image" :src="`/logos/${cta.logo}.svg`" v-if="cta.logo"/>
            <svgicon class="header__cta__image" :icon="cta.icon" v-else/>
          </a>
        </template>
      </div>
      <div class="content__empty-bookmarks" v-if="emptyBookmarks">
        <img src="/bookmark.svg" alt="No bookmarks"/>
        <h1 class="content__empty-bookmarks__title">Nothing is here</h1>
        <p class="content__empty-bookmarks__text">Save article and it will be shown here.</p>
      </div>
      <div class="content__insane" v-if="insaneMode">
        <template v-if="showAd">
          <DaInsaneAd v-for="(item, index) in ads" :key="index" :ad="item"/>
        </template>
        <DaInsanePost v-for="item in posts" :key="item.id" :post="item"
                      @bookmark="onBookmark"/>
      </div>
      <masonry class="content__cards" :cols="cols" :gutter="32" v-else>
        <template v-if="showAd">
          <DaCardAd v-for="(item, index) in ads" :key="index" :ad="item"/>
        </template>
        <DaCardPost v-for="item in posts" :key="item.id" :post="item"
                    @bookmark="onBookmark" @menu="onPostMenu"/>
      </masonry>
    </div>
    <div id="anchor" ref="anchor"></div>
    <DaModal class="go-modal" v-if="showGoModal" @close="showGoModal = false">
      <div class="go-modal__graphics">
        <img svg-inline src="../svg/arrow.svg" alt="Arrow"
             class="go-modal__arrow left first"/>
        <img svg-inline src="../svg/arrow.svg" alt="Arrow"
             class="go-modal__arrow left second"/>
        <img svg-inline src="../svg/arrow.svg" alt="Arrow"
             class="go-modal__arrow left third"/>
        <img svg-inline src="../svg/barcode.svg" alt="QR code"
             class="go-modal__barcode"/>
        <img svg-inline src="../svg/arrow.svg" alt="Arrow"
             class="go-modal__arrow third"/>
        <img svg-inline src="../svg/arrow.svg" alt="Arrow"
             class="go-modal__arrow second"/>
        <img svg-inline src="../svg/arrow.svg" alt="Arrow"
             class="go-modal__arrow first"/>
      </div>
      <h1><a href="https://go.dailynow.co">go.dailynow.co</a></h1>
      <p>Welcome to our community! We value each new member and we hope you will enjoy… </p>
    </DaModal>
    <DaModal class="congrats-modal full" v-if="showCongratsModal"
             @close="showCongratsModal = false" ref="congratsModal">
      <img svg-inline src="../svg/happy_card.svg" alt="Happy card cartoon"
           class="congrats__graphics"/>
      <!--TODO: update to user name-->
      <h1>Good news, Tsahi!</h1>
      <p>Welcome to our community! We value each new member and we hope you will enjoy… </p>
      <button class="btn btn-big" @click="$refs.congratsModal.close()">F*** Yeah!</button>
    </DaModal>
    <DaModal class="request-modal full" v-if="showRequestModal"
             @close="showRequestModal = false" ref="requestModal">
      <img svg-inline src="../svg/source_box.svg" alt="Flying box cartoon"
           class="request__graphics"/>
      <h1 class="overlap">Request sent</h1>
      <p>Your request has been recieved and we’ll be contacting you shortly by email.</p>
      <button class="btn btn-big" @click="$refs.requestModal.close()">OK, I’ll wait</button>
    </DaModal>
    <DaModal class="ready-modal full" v-if="showReadyModal"
             @close="showReadyModal = false" ref="readyModal">
      <img svg-inline src="../svg/all_set.svg" alt="All set"
           class="ready__graphics"/>
      <h1 class="overlap">Hello world</h1>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      <button class="btn btn-big" @click="$refs.readyModal.close()">Use Daily now!</button>
    </DaModal>
  </div>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import DaCardPost from '@daily/components/src/components/DaCardPost.vue';
import DaCardAd from '@daily/components/src/components/DaCardAd.vue';
import DaInsanePost from '@daily/components/src/components/DaInsanePost.vue';
import DaInsaneAd from '@daily/components/src/components/DaInsaneAd.vue';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaHeader from '../components/DaHeader.vue';
import DaSidebar from '../components/DaSidebar.vue';
import ctas from './ctas';
import { monetizationService } from '../common/services';

export default {
  components: {
    DaSidebar, DaHeader, DaCardPost, DaCardAd, DaInsanePost, DaInsaneAd, DaModal,
  },

  data() {
    return {
      cta: ctas[Math.floor(Math.random() * ctas.length)],
      cols: {
        default: 7,
        2050: 6,
        2030: 5,
        1710: 4,
        1390: 3,
        1070: 2,
      },
      ads: [],
      showGoModal: false,
      showCongratsModal: false,
      showRequestModal: false,
      showReadyModal: false,
    };
  },

  methods: {
    ctaClick() {
      // ga('send', 'event', this.cta.name, 'Click');
    },

    updateLines() {
      this.$nextTick(() => this.$refs.sidebar.invalidate());
    },

    onBookmark({ post, bookmarked }) {
      // TODO: analytics
      this.toggleBookmarks({ id: post.id, bookmarked });
    },

    // eslint-disable-next-line
    onPostMenu({ post }) {

    },

    onGoClicked() {
      // TODO: analytics
      this.showGoModal = true;
    },

    onBackHome() {
      // TODO: analytics
      this.clearFilter();
    },

    onAddFilter() {
      // TODO: analytics
      this.addFilterToFeed();
    },

    ...mapActions({
      fetchNextFeedPage: 'feed/fetchNextFeedPage',
      fetchTags: 'feed/fetchTags',
      clearFilter: 'feed/clearFilter',
      addFilterToFeed: 'feed/addFilterToFeed',
    }),

    ...mapMutations({
      toggleBookmarks: 'feed/toggleBookmarks',
    }),
  },

  computed: {
    ...mapState({
      insaneMode(state) {
        return state.ui.insaneMode;
      },
      showBookmarks(state) {
        return state.feed.showBookmarks;
      },
      title(state) {
        let res = '';
        if (state.feed.showBookmarks) {
          res += 'your personal bookmarks';
        } else {
          res += 'news for developers';
        }

        if (state.ui.insaneMode) {
          res += ' - insane mode';
        }

        return res;
      },
      filter(state) {
        return state.feed.filter;
      },
    }),

    ...mapGetters({
      posts: 'feed/feed',
      showAd: 'feed/showAd',
      hasFilter: 'feed/hasFilter',
    }),

    emptyBookmarks() {
      return !this.posts.length && this.showBookmarks;
    },
  },

  watch: {
    posts() {
      this.updateLines();
    },
  },

  created() {
    this.contentObserver = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        if (await this.fetchNextFeedPage() && this.page > 0) {
          // ga('send', 'event', 'Feed', 'Scroll', 'Next Page', this.page);
        }
      }
    }, { root: null, rootMargin: '0px', threshold: 1 });
  },

  async mounted() {
    // TODO: add page view analytics
    // TODO: fetch ads

    import('@daily/components/icons/arrow');
    import('@daily/components/icons/plus');

    if (this.cta.icon) {
      import(`@daily/components/icons/${this.cta.icon}`);
    }

    this.updateLines();

    // TODO: handle error
    monetizationService.fetchAd()
      .then((ads) => {
        this.ads = ads;
      });

    await this.$store.dispatch('feed/fetchPublications');
    await this.fetchNextFeedPage();
    await this.fetchTags();

    this.contentObserver.observe(this.$refs.anchor);
  },
};
</script>

<style>
@import '../../../../node_modules/@daily/components/src/styles/global.pcss';

html {
  background: var(--theme-background-primary);
}

body {
  margin: 0;
}

html, body {
  height: 100%;
}

a {
  text-decoration: none;
}

.separator {
  display: block;
  border-left: 1px dotted var(--theme-separator);
  height: 32px;
  width: 1px;
}

.app {
  position: relative;
  display: flex;
  min-height: 100%;
  flex-direction: column;
  justify-content: stretch;
  color: var(--theme-primary);
}

.content {
  display: flex;
  flex-direction: column;
  margin: 24px 42px 76px 76px;
}

.content__header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;

  & h4 {
    color: var(--theme-secondary);

    &.uppercase {
      text-transform: uppercase;
    }
  }

  & .btn .svg-icon {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }

  & .content__header__back-home {
    background: var(--theme-background-highlight);
    color: var(--theme-secondary);
    margin-right: 16px;

    & .svg-icon {
      color: var(--theme-secondary);
      transform: rotate(-90deg);
    }
  }

  & .content__header__pub-image {
    width: 24px;
    height: 24px;
    margin: 0 8px 0 0;
    border-radius: 4px;
  }

  & .content__header__add-filter {
    margin-left: auto;
    background: var(--color-water-50);
    color: var(--color-salt-10);
  }
}

.header__cta {
  display: flex;
  height: 32px;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  border-radius: 8px;
}

.header__cta__text {
  margin: 0 8px 0 16px;

  @mixin micro2;
}

.header__cta__image {
  width: 20px;
  height: 20px;
  margin: 0 8px;
  color: var(--color-salt-10);
}

.content__cards {
  margin: -32px 0;

  & .card {
    margin: 32px 0;
  }
}

.content__insane {
  border-radius: 8px;
  overflow: hidden;
}

.content__empty-bookmarks {
  display: flex;
  margin-top: 120px;
  flex-direction: column;
  align-items: center;

  & img {
    height: 185px;
  }
}

.content__empty-bookmarks__title {
  margin: 32px 0 8px;
  color: var(--theme-primary);
  text-transform: uppercase;
}

.content__empty-bookmarks__text {
  margin: 8px 0;
  color: var(--theme-secondary);

  @mixin jr;
}

#anchor {
  position: absolute;
  bottom: 100vh;
  left: 0;
  height: 1px;
  width: 1px;
  opacity: 0;
}

.modal .modal__container {
  display: flex;
  width: 427px;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  color: var(--color-salt-10);
  overflow: hidden;

  & h1 {
    margin: 16px 0;
    text-align: center;
    text-transform: uppercase;

    &.overlap {
      margin-top: -32px;
    }

    & a {
      color: var(--color-salt-10);
      outline: none;
    }
  }

  & p {
    margin: 0 48px;
    text-align: center;

    @mixin jr;
  }

  & .btn {
    width: 180px;
    margin-top: 32px;
    color: var(--color-pepper-80);
    background: var(--color-salt-10);
    justify-content: center;
  }
}

.modal.full .modal__container {
  padding-top: 0;
}

.go-modal.modal .modal__container {
  background: linear-gradient(134.72deg, var(--color-cabbage-70) 0%, var(--color-onion-70) 100%);

  & .go-modal__graphics {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 22px;
    align-self: stretch;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      height: 110px;
      margin: auto 0;
      background: linear-gradient(270deg,
      rgba(169, 171, 179, 0) 0%, var(--color-salt-10) 50%, rgba(169, 171, 179, 0) 100%);
      opacity: 0.64;
      mix-blend-mode: overlay;
    }
  }

  & .go-modal__arrow {
    width: 38px;

    &.left {
      transform: rotate(180deg);
    }

    &.first {
      opacity: 0.16;
    }

    &.second {
      opacity: 0.24;
    }

    &.third {
      opacity: 0.32;
    }
  }

  & .go-modal__barcode {
    width: 123px;
    margin: 0 16px;
  }

  & h1 {
    text-transform: none;
  }
}

.congrats-modal.modal .modal__container {
  background: linear-gradient(135deg, var(--color-avocado-70) 0%, var(--color-blue-cheese-90) 100%);

  & .congrats__graphics {
    height: 240px;
  }
}

.request-modal.modal .modal__container {
  background: linear-gradient(315deg, var(--color-water-60) 0%, var(--color-blue-cheese-80) 100%);

  & .request__graphics {
    height: 268px;
  }
}

.ready-modal.modal .modal__container {
  background: linear-gradient(180deg, var(--color-ketchup-40) 0%, var(--color-bacon-80) 100%);

  & .request__graphics {
    height: 268px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
