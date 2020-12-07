<template>
  <div class="scroll-btn" :class="[show ? 'show' : '']" @click="scrollTop">
    <svgicon name="arrow" class="scroll-btn__icon" />
  </div>
</template>

<script>
import '../../icons/arrow';

export default {
  name: 'DaScroll',

  data() {
    return {
      show: false,
    };
  },

  methods: {
    scrollTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },

  created() {
    this.scroll = () => {
      this.show = document.documentElement.scrollTop
        >= window.innerHeight / 2;
    };
    this.scroll = this.scroll.bind(this);
  },

  mounted() {
    window.addEventListener('scroll', this.scroll, { passive: true });
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.scroll);
  },
};
</script>

<style>
.scroll-btn {
  height: 64px;
  width: 64px;
  border-radius: 100%;
  bottom: 32px;
  right: 32px;
  opacity: 0;
  position: fixed;
  background: var(--theme-primary);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.2);
  transform: translateY(15px);
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  cursor: pointer;
  pointer-events: none;

  &.show {
    opacity: 0.8;
    transform: translateY(0);
    pointer-events: all;
  }

  &.show:hover {
    opacity: 1;
  }
}

.scroll-btn__icon {
  width: 40px;
  height: 40px;
  color: var(--theme-background-primary);
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 5px;
  right: 0;
}
</style>
