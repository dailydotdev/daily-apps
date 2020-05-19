<template>
  <div class="banner" :class="theme">
    <span class="lil2 title">{{title}}</span>
    <span class="micro1">{{subtitle}}</span>
    <a class="btn cta" :href="url" target="_blank" @click="ctaClick">{{cta}}</a>
    <button class="btn-icon btn-small" @click="closeClick">
      <svgicon name="x"/>
    </button>
  </div>
</template>

<script>
import '@daily/components/icons/x';

export default {
  name: 'DaBanner',
  props: {
    title: String,
    subtitle: String,
    cta: String,
    url: String,
    theme: String,
  },
  methods: {
    ctaClick() {
      ga('send', 'event', 'Banner', 'CTA');
    },
    closeClick() {
      ga('send', 'event', 'Banner', 'Close');
      this.$emit('close');
    },
  },
  mounted() {
    ga('send', 'event', 'Banner', 'Impression');
  },
};
</script>

<style>
.banner {
  display: flex;
  width: 100%;
  padding: 0 12px;
  color: var(--theme-primary);
  background: var(--theme-background-primary);
  flex-direction: row;
  align-items: center;
  justify-content: center;
  z-index: 31;

  --bacon-onion: linear-gradient(270deg, var(--color-bacon-60) 0%, var(--color-onion-60) 100%);

  & .cta {
    --button-color: var(--theme-primary-invert);
    --button-background: var(--theme-primary);
  }

  &.gradient-bacon-onion {
    background: var(--bacon-onion);
    color: var(--color-salt-10);

    & .cta {
      --button-color: var(--color-pepper-80);
      --button-background: var(--color-salt-10);
    }

    & .btn-icon {
      --button-color: var(--color-pepper-90);
    }
  }

  &.title-bacon .title {
    color: var(--color-bacon-60);
  }

  &.cta-bacon-onion .cta {
    --button-color: var(--color-salt-10);
    --button-background: var(--bacon-onion);
  }

  & span {
    margin: 0 4px;

    &:first-of-type {
      margin-left: auto;
    }

    &:last-of-type {
      margin-right: 0;
    }
  }

  & .cta {
    height: 24px;
    margin-left: 16px;
    --button-border-radius: 8px;
    @mixin nuggets;
  }

  & .btn-icon {
    margin-left: auto;
  }
}
</style>
