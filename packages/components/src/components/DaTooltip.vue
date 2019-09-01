<template>
    <div class="tooltip-wrapper" v-tooltip="{content, placement}">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'DaTooltip',
  props: {
    content: {
      type: String,
      default: '',
    },
    placement: {
      type: String,
      default: '',
    },
  },
};
</script>

<style>
    .tooltip-wrapper {
        display: inline-block !important;
    }
</style>
