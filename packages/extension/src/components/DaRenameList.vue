<template>
  <da-modal class="bookmark-modal rename-list" @close="$emit('close')">
    <button class="btn-icon modal__close-btn" @click="$emit('close')">
      <svgicon name="x"/>
    </button>
    <h3>Rename <span>"{{list.name}}"</span></h3>
    <form>
      <da-text-field ref="field" placeholder="e.g. Javascript" label="List name"
                    :maxlength="20" autofocus required @validity="valid = $event"
                    :value="list.name" />
      <div class="bookmark-modal__buttons">
        <button type="button" class="btn btn-big btn-hollow bookmark-modal__cancel"
                @click="$emit('close')">Cancel</button>
        <button type="submit" class="btn btn-big btn-invert bookmark-modal__confirm"
              :disabled="!valid || loading" @click.prevent="renameList">Rename List</button>
      </div>
    </form>
  </da-modal>
</template>

<script>
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import '@daily/components/icons/x';
import { BOOKMARK_LISTS_QUERY, RENAME_BOOKMARK_LIST_MUTATION } from '../graphql/bookmarkList';

export default {
  name: 'DaRenameList',

  components: {
    DaModal,
    DaTextField,
  },

  props: {
    list: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      valid: true,
      loading: false,
    };
  },

  methods: {
    async renameList() {
      this.loading = true;
      const name = this.$refs.field.currentValue;
      const { id } = this.list;
      try {
        await this.$apollo.mutate({
          mutation: RENAME_BOOKMARK_LIST_MUTATION,
          variables: { id, name },
          update: (store) => {
            try {
              const data = store.readQuery({ query: BOOKMARK_LISTS_QUERY });
              const index = data.bookmarkLists.findIndex(list => list.id === id);
              if (index > -1) {
                data.bookmarkLists[index].name = name;
              }
              store.writeQuery({ query: BOOKMARK_LISTS_QUERY, data });
            } catch (err) {
              // TODO: handle error
            }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            renameBookmarkList: {
              __typename: 'BookmarkList',
              id,
              name,
            },
          },
        });
        this.$emit('close');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.rename-list.bookmark-modal {
  & h3 span {
    color: var(--theme-secondary);
    text-transform: none;
  }
}
</style>
