<template>
  <main class="approvals">
    <h4 class="page__title">/* Approved requests */</h4>
    <div class="cards-list">
      <dm-form :title="item.userName" :subtitle="item.userEmail"
               @menu="onOpenMenu(item, $event)"
               :menu-opened="selectedRequest && selectedRequest.id === item.id"
               @submit="publishOpenRequest({id: item.id})" :disable-submit="!isRequestReady(item)"
               v-for="item in approvedRequests" :key="item.id">
        <div class="form__input-container">
          <label class="file-upload">
            <input type="file" class="input--file"
                   @input="uploadRequestLogo({id: item.id, file: $event.target.files[0]})"/>
            <span class="file-upload__img" title="Change logo" v-if="item.pubImage">
              <img :src="item.pubImage" alt="Source logo"/>
            </span>
            <span class="btn-icon" title="Change logo" v-else>
              <svgicon icon="plus"/>
            </span>
          </label>
          <da-editable-text class="big" placeholder="Enter source name"
                            text="Name" :value-as-text="true" :required="true" :value="item.pubName"
                            @submit="editOpenRequest({id: item.id, edit: {pubName: $event}})"/>
        </div>
        <da-editable-text class="big" icon="link" placeholder="Enter source website" type="url"
                          :value-as-text="true" :required="true" :value="item.url"
                          @submit="editOpenRequest({id: item.id, edit: {url: $event}})"/>
        <da-editable-text class="big" icon="card" placeholder="Enter source RSS" type="url"
                          text="RSS feed" :value-as-text="true" :value="item.pubRss"
                          @submit="editOpenRequest({id: item.id, edit: {pubRss: $event}})"/>
        <da-editable-text class="big" icon="bookmark" placeholder="Enter source id"
                          text="Source ID" :value-as-text="true" :required="true"
                          :value="item.pubId"
                          @submit="editOpenRequest({id: item.id, edit: {pubId: $event}})"/>
        <da-editable-text class="big" icon="twitter" placeholder="Enter source twitter"
                          text="Twitter handle" :value-as-text="true" :value="item.pubTwitter"
                          @submit="editOpenRequest({id: item.id, edit: {pubTwitter: $event}})"/>
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
  name: 'Approvals',

  mixins: [requestsListMixin],

  computed: {
    ...mapGetters('requests', ['approvedRequests']),
  },

  methods: {
    isRequestReady(req) {
      return req.pubId && req.pubName && req.pubRss && req.pubImage;
    },

    ...mapActions({
      uploadRequestLogo: 'requests/uploadRequestLogo',
      publishOpenRequest: 'requests/publishOpenRequest',
    }),
  },

  mounted() {
    import('@daily/components/icons/link');
    import('@daily/components/icons/card');
    import('@daily/components/icons/plus');
    import('@daily/components/icons/bookmark');
    import('@daily/components/icons/twitter');
  },
};
</script>

<style>
.input--file {
  display: none;
}

.file-upload {
  display: inline-flex;
  margin-left: 8px;

  & .file-upload__img {
    display: inline-flex;
    padding: 3px;
    background: none;
    border: none;
    cursor: pointer;
  }

  & img {
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }
}

.form__input-container {
  display: flex;
  flex-direction: row;
  align-items: center;

  & .editable {
    margin-top: 0;
    margin-left: 8px;
    flex: 1;
  }
}
</style>
