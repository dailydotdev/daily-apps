<template>
  <transition name="modal">
    <dialog class="modal" ref="dialog">
      <div class="modal__backdrop" @click="backdropClicked"></div>
      <div class="modal__background">
        <slot name="background"></slot>
      </div>
      <div class="modal__container shadow2">
        <slot></slot>
      </div>
    </dialog>
  </transition>
</template>

<script>
export default {
  name: 'DaModal',

  props: {
    closeOnClick: {
      type: Boolean,
      default: true,
    },
  },

  created() {
    this.keyup = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        if (this.closeOnClick) {
          this.close();
        }
      }
    };
    this.keyup = this.keyup.bind(this);
  },

  async mounted() {
    if (typeof HTMLDialogElement !== 'function') {
      const dialogPolyfill = await import('dialog-polyfill/dialog-polyfill');
      dialogPolyfill.default.registerDialog(this.$refs.dialog);
    }
    if (this.$refs.dialog.showModal) {
      this.$refs.dialog.showModal();
    }
    document.body.addEventListener('keydown', this.keyup);
  },

  methods: {
    close() {
      document.body.removeEventListener('keydown', this.keyup);
      this.$refs.dialog.close();
      this.$emit('close');
    },
    backdropClicked() {
      if (this.closeOnClick) {
        this.close();
      }
    },
  },
};
</script>

<style>
/** dialog polyfill **/
dialog {
  position: absolute;
  left: 0;
  right: 0;
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
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.1);
}

._dialog_overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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

.modal__background, .modal__backdrop {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.modal__backdrop {
  background: var(--color-pepper-80);
  opacity: 0.56;
  z-index: -2;
}

.modal__background {
  z-index: -1;
  pointer-events: none;
}

.modal__container {
  position: relative;
  padding: 40px;
  background: var(--theme-background-highlight);
  border-radius: 16px;
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
