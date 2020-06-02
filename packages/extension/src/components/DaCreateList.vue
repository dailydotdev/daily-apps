<template>
  <da-modal class="bookmark-modal create-list" @close="$emit('close')">
    <button class="btn-icon bookmark-modal__close" @click="$emit('close')">
      <svgicon name="x"/>
    </button>
    <h3>Create a list</h3>
    <p>
      Lists are where you manage your bookmarks.
      They’re best when organized around a topic — webdev, for example.
    </p>
    <form>
      <da-text-field ref="field" placeholder="e.g. Javascript" label="List name"
                    :maxlength="20" autofocus required @validity="valid = $event"/>
      <button type="submit" class="btn btn-big btn-invert bookmark-modal__confirm"
              :disabled="!valid || loading" @click.prevent="createList">Create</button>
    </form>
  </da-modal>
</template>

<script>
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import '@daily/components/icons/x';
import { BOOKMARK_LISTS_QUERY, CREATE_BOOKMARK_LIST_MUTATION } from '../graphql/bookmarkList';

export default {
  name: 'DaCreateList',

  components: {
    DaModal,
    DaTextField,
  },

  data() {
    return {
      valid: false,
      loading: false,
    };
  },

  methods: {
    async createList() {
      this.loading = true;
      const name = this.$refs.field.currentValue;
      try {
        const res = await this.$apollo.mutate({
          mutation: CREATE_BOOKMARK_LIST_MUTATION,
          variables: { name },
          update: (store, { data: { createBookmarkList } }) => {
            let data;
            try {
              data = store.readQuery({ query: BOOKMARK_LISTS_QUERY });
              data.bookmarkLists.push(createBookmarkList);
            } catch (err) {
              data = { bookmarkLists: [createBookmarkList] };
            }
            store.writeQuery({ query: BOOKMARK_LISTS_QUERY, data });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createBookmarkList: {
              __typename: 'BookmarkList',
              id: -1,
              name,
            },
          },
        });
        this.$emit('complete', res.data.createBookmarkList);
        this.$emit('close');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.create-list.bookmark-modal {
  & .bookmark-modal__confirm {
    width: 180px;
  }
}
</style>
