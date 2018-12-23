<template>
  <transition name="modal">
    <dialog class="modal" ref="dialog">
      <div class="modal__backdrop" @click="close"></div>
      <div class="modal__container">
        <slot></slot>
      </div>
    </dialog>
  </transition>
</template>

<script>
import dialogPolyfill from 'dialog-polyfill/dialog-polyfill';

export default {
  name: 'DaModal',

  created() {
    this.keyup = (event) => {
      if (event.key === 'Escape') {
        this.$emit('close');
        document.body.removeEventListener('keyup', this.keyup);
      }
    };
    this.keyup = this.keyup.bind(this);
  },

  mounted() {
    dialogPolyfill.registerDialog(this.$refs.dialog);
    this.$refs.dialog.showModal();
    document.body.addEventListener('keyup', this.keyup);
  },

  methods: {
    close() {
      this.$refs.dialog.close();
      this.$emit('close');
    },
  },
};
</script>

<style>
/** dialog polyfill **/
dialog {
  position: absolute;
  left: 0; right: 0;
  width: -moz-fit-content;
  width: -webkit-fit-content;
  width: fit-content;
  height: -moz-fit-content;
  height: -webkit-fit-content;
  height: fit-content;
  margin: auto;
  border: solid;
  padding: 1em;
  background: white;
  color: black;
  display: block;
}

dialog:not([open]) {
  display: none;
}

dialog + .backdrop {
  position: fixed;
  top: 0; right: 0; bottom: 0; left: 0;
  background: rgba(0,0,0,0.1);
}

._dialog_overlay {
  position: fixed;
  top: 0; right: 0; bottom: 0; left: 0;
}

dialog.fixed {
  position: fixed;
  top: 50%;
  transform: translate(0, -50%);
}
/********************/

.modal {
  position: fixed;
  display: flex;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 0;
  background: none;
  border: none;
  z-index: 9998;
  transition: opacity .3s ease;
}

.modal__backdrop {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--color-pepper-80);
  opacity: 0.56;
  z-index: -1;
}

.modal__container {
  padding: 40px;
  background: var(--theme-background-highlight);
  border-radius: 16px;
  box-shadow: 0 var(--theme-shadow-offset) 32px 16px rgba(0, 0, 0, 0.32);
  transition: all .3s ease;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal__container,
.modal-leave-active .modal__container {
  transform: scale(1.1);
}
</style>
