<template>
    <div class="tooltip-wrapper" v-tooltip="{content, placement, delay: { show: delay, hide: 0, }}">
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
    delay: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style>
    .tooltip-wrapper {
        display: inline-block !important;
    }
</style>
