<template>
  <div class="terminal shadow2">
    <header class="terminal__header">
      <button class="terminal__header__button close" @click="$emit('close')"></button>
      <div class="terminal__header__button"></div>
      <div class="terminal__header__button"></div>
      <div class="terminal__header__title micro2">
        <slot name="title"></slot>
      </div>
    </header>
    <div class="terminal__content micro1">
      <slot name="content"></slot>
      <span class="terminal__content__cursor" v-if="cursor">&nbsp;</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaTerminal',
  props: {
    cursor: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style>
.terminal {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;

  & > * {
    color: var(--color-salt-10);
  }
}

.terminal__header {
  display: flex;
  height: 34px;
  flex-direction: row;
  align-items: center;
  padding: 0 8px;
  background-color: var(--color-pepper-50);

  & > * {
    margin: 0 4px;

    &.terminal__header__title {
      margin: 0 8px;
    }
  }
}

.terminal__header__button {
  width: 10px;
  height: 10px;
  padding: 0;
  border: none;
  border-radius: 100%;
  background: var(--color-pepper-10);

  &.close {
    background: var(--color-ketchup-40);
    cursor: pointer;
  }
}

.terminal__header__title {
  color: var(--color-salt-90);
}

.terminal__content {
  padding: 16px;
  flex: 1;
  background: var(--color-pepper-90);
  overflow-y: auto;
  word-break: break-word;
  scrollbar-width: none;

  & a {
    text-decoration: none;
    cursor: pointer;
  }
}

.terminal__content__cursor {
  background: var(--color-salt-10);
  animation: blink 1s step-start 0s infinite;
}

@keyframes blink {
  50% {
    opacity: 0.0;
  }
}
</style>
