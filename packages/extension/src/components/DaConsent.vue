<template>
  <da-modal class="consent-modal" @close="$emit('close')" ref="modal"
            :close-on-click="false">
    <p>
      To improve Daily we use analytics platforms.
      We kindly ask your approval for tracking your activity here (such as clicks and page views).
      We promise to never misuse it.
      <br><br>
      Do you agree to opt-in?
    </p>
    <div class="consent__buttons">
      <button class="btn btn-big btn-modal btn-invert" @click="$emit('opt-in')">
        Yes, I'd love to
      </button>
      <button class="btn btn-big btn-hollow" @click="$emit('opt-out')" autofocus>
        No
      </button>
    </div>
  </da-modal>
</template>

<script>
import DaModal from '@daily/components/src/components/DaModal.vue';

export default {
  name: 'DaConsent',
  components: {
    DaModal,
  },
};
</script>

<style>
.consent-modal.modal .modal__container {
  width: 480px;
  padding: 40px;
  color: var(--theme-secondary);

  & p {
    margin: 0;
  }

  & .consent__buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 24px;

    & > .btn {
      margin: 0 8px;
    }
  }
}
</style>
