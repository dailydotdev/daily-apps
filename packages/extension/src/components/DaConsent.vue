<template>
  <da-modal class="consent-modal" ref="modal" :close-on-click="false">
    <p>
      We have updated our <a href="https://daily.dev/terms">Terms</a>,
      <a href="https://daily.dev/privacy">Privacy</a> and
      <a href="https://daily.dev/cookie">Cookie Policy</a>.
      Take a minute to read them before you proceed.
    </p>
    <div class="consent__buttons">
      <button class="btn btn-big btn-modal btn-invert" @click="$emit('confirm')" autofocus>
        I agree
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

  & a, & a:visited {
    color: var(--color-water-50);
  }
}
</style>
