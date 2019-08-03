<template>
  <da-modal class="congrats-modal full" @close="$emit('close')" ref="modal">
    <da-svg src="/graphics/happy_card.svg" class="congrats__graphics"/>
    <h1>Good news, {{ userFirstName }}!</h1>
    <p>Welcome to our community! We value each new member and we hope you will enjoy… </p>
    <button class="btn btn-big btn-modal btn-invert" @click="$refs.modal.close()">
      F*** Yeah!
    </button>
  </da-modal>
</template>

<script>
import { mapState } from 'vuex';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaSvg from './DaSvg.vue';

export default {
  name: 'DaCongrats',
  components: {
    DaModal,
    DaSvg,
  },
  computed: {
    ...mapState({
      userFirstName(state) {
        if (!state.user.profile) {
          return '';
        }

        return state.user.profile.name.split(' ')[0];
      },
    }),
  },
};
</script>

<style>
.congrats-modal.modal .modal__container {
  background: linear-gradient(135deg, var(--color-avocado-70) 0%, var(--color-blue-cheese-90) 100%);

  & .congrats__graphics {
    height: 240px;
  }
}
</style>
