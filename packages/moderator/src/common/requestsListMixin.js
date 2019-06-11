import { mapState, mapActions } from 'vuex';
import DaEditableText from '@daily/components/src/components/DaEditableText.vue';
import DmForm from '../components/DmForm.vue';

export default {
  components: {
    DaEditableText,
    DmForm,
    DaContext: () => import('@daily/components/src/components/DaContext.vue'),
  },

  data() {
    return {
      selectedRequest: null,
    };
  },

  computed: {
    ...mapState('requests', ['reasons']),
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
      declineOpenRequest: 'requests/declineOpenRequest',
    }),
  },
};
