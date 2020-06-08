<template>
  <nav class="bookmark-list scrollbar">
    <div class="bookmark-list__container">
      <div class="bookmark-list__header nuggets">
        My bookmarks
      </div>
      <div class="bookmark-list__list">
        <button class="btn btn-menu" :class="{active: !bookmarkList}"
                @click="setBookmarkList(null)">
          <svgicon name="bookmark"/><span>All Articles</span>
        </button>
        <button class="btn btn-menu" :class="{active: bookmarkList === 'unread'}"
                @click="setBookmarkList('unread')">
          <svgicon name="unread"/><span>Unread</span>
        </button>
      </div>
    </div>
    <div class="bookmark-list__container">
      <div class="bookmark-list__header nuggets">
        <span>My lists</span>
        <button class="btn-icon btn-small" @click="openCreateList('Full')"
                v-tooltip="'Create new list'" v-if="bookmarkLists && bookmarkLists.length">
          <svgicon name="plus"/>
        </button>
      </div>
      <div class="bookmark-list__list">
        <button class="btn btn-menu bookmark-list__create-btn"
                v-if="!bookmarkLists || !bookmarkLists.length"
                @click="openCreateList('Empty')">
          <svgicon name="plus"/><span>Create new list</span>
        </button>
        <div v-for="item in bookmarkLists" :key="item.id" class="btn btn-menu"
            :class="{active: bookmarkList === item.id, hover: selectedListId === item.id}"
            @click="setBookmarkList(item.id)">
          <button class="bookmark-list__list-btn" @click="setBookmarkList(item.id)">
            {{item.name}}
          </button>
          <button class="btn-icon btn-small bookmark-list__menu-btn" @click="openMenu($event, item)"
                  :class="{active: selectedListId === item.id}">
            <svgicon name="menu"/>
          </button>
        </div>
      </div>
    </div>
    <da-context ref="context" class="bookmark-list__context" @open="onMenuOpened"
                @close="selectedList = null">
      <button class="btn btn-menu" @click="openRenameList">Rename</button>
      <button class="btn btn-menu" @click="openDeleteList">Delete</button>
    </da-context>
    <da-create-list v-if="showCreateList"
                    @close="showCreateList = false" />
    <da-rename-list v-if="showRenameList"
                    @close="showRenameList = false" :list="operationList" />
    <da-delete-list v-if="showDeleteList"
                    @close="showDeleteList = false" :list="operationList" />
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { BOOKMARK_LISTS_QUERY } from '../graphql/bookmarkList';

export default {
  name: 'DaBookmarkList',
  components: {
    DaContext: () => import('@daily/components/src/components/DaContext.vue'),
    DaCreateList: () => import('./DaCreateList.vue'),
    DaRenameList: () => import('./DaRenameList.vue'),
    DaDeleteList: () => import('./DaDeleteList.vue'),
  },

  apollo: {
    bookmarkLists: {
      query: BOOKMARK_LISTS_QUERY,
      fetchPolicy: 'cache-and-network',
      skip() {
        return !this.isPremium;
      },
    },
  },

  data() {
    return {
      bookmarkLists: [],
      selectedList: null,
      operationList: null,
      showCreateList: false,
      showRenameList: false,
      showDeleteList: false,
    };
  },

  computed: {
    selectedListId() {
      return this.selectedList && this.selectedList.id;
    },

    ...mapState('feed', ['bookmarkList']),
    ...mapGetters('user', ['isPremium']),
  },

  methods: {
    setBookmarkList(id) {
      let name;
      if (!id) {
        name = 'All';
      } else if (id === 'unread') {
        name = 'Unread';
      } else {
        name = 'Custom';
      }
      ga('send', 'event', 'Bookmark List', name);
      return this.$store.dispatch('feed/setBookmarkList', id);
    },
    openCreateList(mode) {
      if (this.isPremium) {
        ga('send', 'event', 'Bookmark List', 'Create', mode);
        this.showCreateList = true;
      } else {
        this.$store.commit('ui/setShowPremium', true);
      }
    },
    openMenu(event, list) {
      ga('send', 'event', 'Bookmark List', 'Context', 'Open');
      this.selectedList = list;
      this.$refs.context.open(event, list);
    },
    onMenuOpened(event) {
      const rect = event.target.getBoundingClientRect();
      this.$refs.context.positionMenu({ top: rect.bottom + 4, right: rect.right });
    },
    openRenameList() {
      ga('send', 'event', 'Bookmark List', 'Rename');
      this.operationList = this.selectedList;
      this.$refs.context.close();
      this.showRenameList = true;
    },
    openDeleteList() {
      ga('send', 'event', 'Bookmark List', 'Delete');
      this.operationList = this.selectedList;
      this.$refs.context.close();
      this.showDeleteList = true;
    },
  },

  mounted() {
    import('@daily/components/icons/bookmark');
    import('@daily/components/icons/unread');
    import('@daily/components/icons/plus');
    import('@daily/components/icons/menu');
  },
};
</script>

<style>
.bookmark-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 2;
}

.bookmark-list__container {
  padding: 24px 0 8px;
  border-bottom: 1px solid var(--theme-background-highlight);

  &:nth-child(2) {
    border-bottom: none;
  }
}

.bookmark-list__header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 16px 16px;
  color: var(--theme-disabled);
}

.bookmark-list__list {
  & .btn.btn-menu {
    width: 100%;
    height: 44px;
    padding: 10px 16px;
    --button-border-radius: 0 12px 12px 0;
    --button-color: var(--theme-secondary);
    @mixin micro1;
    text-transform: none;

    &:hover, &.hover {
      & .bookmark-list__menu-btn {
        visibility: visible;
      }
    }
  }
}

.bookmark-list__list-btn {
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
  background: none;
  border: none;
  color: var(--button-color);
  cursor: pointer;
}

.bookmark-list__menu-btn {
  visibility: hidden;
}
</style>
