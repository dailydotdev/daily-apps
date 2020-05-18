<template>
  <div class="dnd-message-bar">
    <p class="micro2">Do not disturb.</p>
    <button class="nuggets" @click="$emit('dndOff')">Turn Off</button>
  </div>
</template>

<style>
.dnd-message-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 32px;
  background: var(--theme-primary);
  text-align: center;

  &, & button {
    color: var(--theme-background-primary);
  }

  & p {
    font-style: oblique;
  }

  & button {
    padding: 0;
    margin-left: 8px;
    border: none;
    background: none;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
