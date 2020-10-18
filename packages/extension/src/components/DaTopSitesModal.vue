<template>
  <da-modal class="bookmark-modal top-sites-modal" @close="$emit('close')">
    <button class="btn-icon modal__close-btn" @click="$emit('close')">
      <svgicon name="x"/>
    </button>
    <h3>Show Most Visited Sites</h3>
    <p>
      To show your most visited sites, your browser will now ask for more permissions.
      Once approved, it will be kept locally.
    </p>
    <img :src="imgSrc" alt="Demonstration image"/>
    <p>We will never collect your browsing history. We promise.</p>
    <button class="btn btn-big btn-invert bookmark-modal__confirm"
            @click="setShowTopSites(true)">Next</button>
  </da-modal>
</template>

<script>
import { mapActions } from 'vuex';
import DaModal from '@daily/components/src/components/DaModal.vue';
import '@daily/components/icons/x';
import { browserName } from '@/common/browser';

export default {
  name: 'DaTopSitesModal',

  components: {
    DaModal,
  },

  data() {
    return {
      imgSrc: browserName === 'firefox' ? '/graphics/mvs_firefox.jpg' : '/graphics/mvs_google.jpg',
    };
  },

  methods: {
    ...mapActions({
      setShowTopSites: 'ui/setShowTopSites',
    }),
  },
};
</script>

<style>
.top-sites-modal {
  & .modal__container {
    width: unset;
    padding-left: 32px;
    padding-right: 32px;
  }

  & img {
    width: 436px;
    height: 200px;
    margin: 12px 0;
    border-radius: 24px;
    overflow: hidden;
  }

  & .bookmark-modal__confirm {
    width: 240px;
    margin-top: 16px;
  }
}
</style>
