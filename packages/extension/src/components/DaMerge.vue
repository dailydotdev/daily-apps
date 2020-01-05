<template>
  <da-modal class="merge-modal full" ref="modal" @close="$emit('close')" :close-on-click="false">
    <da-svg :src="`/graphics/merge${theme === 'bright' ? '_bright' : ''}.svg`"
            class="merge__graphics"/>
    <h1>Resolve Conflicts</h1>
    <p>
      Would you like to keep your current bookmarks and merge them with your user?
    </p>
    <div class="merge__buttons">
      <button class="btn btn-big btn-modal btn-invert" @click="$emit('confirm')" autofocus>
        Merge my bookmarks
      </button>
      <button class="btn btn-big btn-hollow" @click="$emit('cancel')">
        No
      </button>
    </div>
  </da-modal>
</template>

<script>
import { mapState } from 'vuex';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaSvg from './DaSvg.vue';

export default {
  name: 'DaMerge',
  components: {
    DaModal,
    DaSvg,
  },

  computed: {
    ...mapState('ui', ['theme']),
  },
};
</script>

<style>
.merge-modal.modal .modal__container {
  color: var(--theme-secondary);

  & .merge__graphics {
    height: 240px;
  }

  & .merge__buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 32px;

    & > .btn {
      width: auto;
      margin: 0 8px;
    }
  }
}
</style>
