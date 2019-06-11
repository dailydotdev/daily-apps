<template>
  <main class="requests">
    <h4 class="page__title">/* Pending requests */</h4>
    <div class="cards-list">
      <dm-form :title="item.userName" :subtitle="item.userEmail"
               @menu="onOpenMenu(item, $event)"
               :menu-opened="selectedRequest && selectedRequest.id === item.id"
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
import requestsListMixin from '../common/requestsListMixin';

export default {
  name: 'Requests',

  mixins: [requestsListMixin],

  computed: {
    ...mapGetters('requests', ['pendingRequests']),
  },

  methods: {
    ...mapActions({
      approveOpenRequest: 'requests/approveOpenRequest',
    }),
  },

  mounted() {
    import('@daily/components/icons/link');
  },
};
</script>
