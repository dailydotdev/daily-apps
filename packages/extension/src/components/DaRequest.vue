<template>
  <da-modal class="request-modal full" @close="$emit('close')" ref="modal">
    <img svg-inline src="../svg/source_box.svg" alt="Flying box cartoon"
         class="request__graphics"/>
    <h1 class="overlap">Request sent</h1>
    <p>Your request has been received. We will review this source and be in touch.</p>
    <button class="btn btn-big btn-modal" @click="$refs.modal.close()">
      OK, thanks
    </button>
  </da-modal>
</template>

<script>
import DaModal from '@daily/components/src/components/DaModal.vue';

export default {
  name: 'DaRequest',
  components: {
    DaModal,
  },
};
</script>

<style>
.request-modal.modal .modal__container {
  background: linear-gradient(315deg, var(--color-water-60) 0%, var(--color-blue-cheese-80) 100%);

  & .request__graphics {
    height: 268px;
  }
}
</style>
