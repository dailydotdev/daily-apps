<template>
  <main class="requests">
    <h4 class="page__title">/* Pending requests */</h4>
    <div class="cards-list">
      <dm-form :title="item.userName" :subtitle="item.userEmail"
               @menu="onOpenMenu(item, $event)" :menu-opened="selectedRequest === item.id"
               @submit="approveOpenRequest({id: item.id})"
               v-for="item in pendingRequests" :key="item.id">
        <da-editable-text class="big" icon="link" placeholder="Enter the website" type="url"
                          :value-as-text="true" :required="true" :value="item.url"
                          @submit="editOpenRequest({id: item.id, edit: {url: $event}})"/>
      </dm-form>
    </div>
    <da-context ref="context" class="requests__context"
                @open="onMenuOpened" @close="selectedRequest = null">
      <button class="btn btn-menu"
              @click="onContextMenuClicked(item.id)"
              v-for="item in reasons" :key="item.id">{{item.title}}
      </button>
    </da-context>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DaEditableText from '@daily/components/src/components/DaEditableText.vue';
import DmForm from '../components/DmForm.vue';

export default {
  name: 'Requests',

  components: {
    DaEditableText,
    DmForm,
    DaContext: () => import('@daily/components/src/components/DaContext.vue'),
  },

  data() {
    return {
      selectedRequest: null,
      requests: [],
      reasons: [{
        id: 'exists',
        title: 'Already exists',
      }, {
        id: 'non-english',
        title: 'Non-English',
      }, {
        id: 'not-active',
        title: 'Not active',
      }, {
        id: 'personal',
        title: 'Personal blog',
      }, {
        id: 'rss',
        title: 'No RSS',
      }],
    };
  },

  computed: {
    ...mapGetters('requests', ['pendingRequests']),
  },

  methods: {
    onOpenMenu(req, event) {
      this.$refs.context.open(event, req);
    },

    onMenuOpened(event, req) {
      const rect = event.target.getBoundingClientRect();
      this.$refs.context.positionMenu({ top: rect.bottom + 8, right: rect.right });
      this.selectedRequest = req;
    },

    onContextMenuClicked(reason) {
      this.declineOpenRequest({ id: this.selectedRequest.id, reason });
      this.$refs.context.close();
    },

    ...mapActions({
      editOpenRequest: 'requests/editOpenRequest',
      approveOpenRequest: 'requests/approveOpenRequest',
      declineOpenRequest: 'requests/declineOpenRequest',
    }),
  },

  mounted() {
    import('@daily/components/icons/link');
  },
};
</script>

<style>
.requests {
  & .editable {
    width: 100%;
  }
}

.v-context.context.requests__context {
  width: 200px;

  &:focus {
    outline: none;
  }

  & .btn {
    padding: 12px 16px;
    justify-content: flex-start;
  }
}
</style>
