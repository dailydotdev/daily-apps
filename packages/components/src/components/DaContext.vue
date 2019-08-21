<template>
  <VueContext class="context shadow2" ref="context"
              @close="$emit('close')" @open="onOpen"
              :close-on-click="false">
    <slot></slot>
  </VueContext>
</template>

<script>
import { VueContext } from 'vue-context';

export default {
  name: 'DaContext',
  components: { VueContext },

  methods: {
    open(event, data) {
      event.stopPropagation();
      setTimeout(() => this.$refs.context.open(event, data));
    },
    close() {
      this.$refs.context.close();
    },
    positionMenu({
      top, bottom, left, right,
    }) {
      const el = this.$refs.context.$el;
      const x = left || (right - el.offsetWidth);
      const y = top || (bottom - el.offsetHeight);
      this.$refs.context.positionMenu(y, x);
    },
    onOpen(...args) {
      this.$emit('open', ...args);
    },
  },
};
</script>

<style>
.context .btn {
  height: 40px;
  padding: 0 16px;
  margin: 0;
  cursor: pointer;

  & {
    @mixin nuggets;
  }
}
</style>
<style scoped>
.v-context.context {
  display: flex;
  width: auto;
  flex-direction: column;
  background: var(--theme-background-highlight);
  border-radius: 4px;
  border: none;
}
</style>
