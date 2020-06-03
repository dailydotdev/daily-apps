<template>
  <da-modal class="bookmark-modal delete-list" @close="$emit('close')">
    <button class="btn-icon modal__close-btn" @click="$emit('close')">
      <svgicon name="x"/>
    </button>
    <h3>Delete list</h3>
    <p>
      Are you sure you want to delete the list <strong>"{{list.name}}"</strong>?
      <br/><br/>
      Note: This action cannot be undone.
    </p>
    <form>
      <div class="bookmark-modal__buttons">
        <button type="button" class="btn btn-big btn-hollow bookmark-modal__cancel"
                @click="$emit('close')">Cancel</button>
        <button type="submit" class="btn btn-big bookmark-modal__confirm"
              :disabled="!valid || loading" @click.prevent="deleteList">Delete</button>
      </div>
    </form>
  </da-modal>
</template>

<script>
import DaModal from '@daily/components/src/components/DaModal.vue';
import '@daily/components/icons/x';
import { BOOKMARK_LISTS_QUERY, REMOVE_BOOKMARK_LIST_MUTATION } from '../graphql/bookmarkList';

export default {
  name: 'DaDeleteList',

  components: {
    DaModal,
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
    async deleteList() {
      this.loading = true;
      const { id } = this.list;
      try {
        await this.$apollo.mutate({
          mutation: REMOVE_BOOKMARK_LIST_MUTATION,
          variables: { id },
          update: (store) => {
            try {
              const data = store.readQuery({ query: BOOKMARK_LISTS_QUERY });
              const index = data.bookmarkLists.findIndex(list => list.id === id);
              if (index > -1) {
                data.bookmarkLists.splice(index, 1);
              }
              store.writeQuery({ query: BOOKMARK_LISTS_QUERY, data });
            } catch (err) {
              // TODO: handle error
            }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            removeBookmarkList: {
              __typename: 'EmptyResponse',
              _: true,
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
.delete-list.bookmark-modal {
  & p {
    margin-bottom: 32px;
  }

  & .bookmark-modal__confirm {
    --button-background: var(--color-ketchup-60);
    --button-color: var(--color-salt-10);
  }
}
</style>
