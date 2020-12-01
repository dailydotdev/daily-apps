<template>
  <div
    class="scroll__switch"
    :class="[showed ? 'shown' : '']"
    @click="scrollTop"
  >
    <svgicon name="arrow" class="scroll__switch__icon" />
  </div>
</template>

<script>
export default {
  name: "DaScroll",

  data() {
    return {
      showed: false,
    };
  },

  methods: {
    scrollTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },

  created() {
    this.scroll = (event) => {
      this.showed =
        document.documentElement.scrollTop >
        document.documentElement.scrollHeight / 3;
    };
    this.scroll = this.scroll.bind(this);
  },

  mounted() {
    import("../../icons/arrow");
    window.addEventListener("scroll", this.scroll);
  },
};
</script>

<style>
.scroll__switch {
  height: 48px;
  width: 48px;
  border-radius: 100%;
  bottom: 32px;
  right: 32px;
  opacity: 0;
  transition: 0.35s;
  transform: scale(0.8);
  position: fixed;
  background: var(--theme-primary);
  visibility: hidden;

  &:hover {
    opacity: 1 !important;
    cursor: pointer;
  }

  &.shown {
    opacity: 0.8;
    transform: scale(1);
    visibility: visible;
  }
}

.scroll__switch__icon {
  width: 32px;
  height: 32px;
  color: var(--theme-background-primary);
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 2px;
  right: 0;
}
</style>