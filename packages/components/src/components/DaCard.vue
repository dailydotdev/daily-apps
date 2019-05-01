<template>
  <div class="card" :class="cls">
    <a :href="url" target="_blank" class="card__link" @click="$emit('click')">
      <div class="card__background" :style="imgStyle">
        <img class="card__background__image lazyload"
             :data-lowsrc="placeholder"
             :data-src="image"/>
      </div>
      <div class="card__content card__hover">
        <h5 class="card__title">
          <da-line-clamp :text="title" :lines="lines"/>
        </h5>
        <slot name="content"></slot>
      </div>
    </a>
    <div class="card__footer card__hover shadow1">
      <slot name="footer"></slot>
    </div>
    <slot name="other"></slot>
  </div>
</template>

<script>
import 'lazysizes/plugins/blur-up/ls.blur-up';
import 'lazysizes';
import DaLineClamp from './DaLineClamp.vue';

export default {
  name: 'DaCard',

  components: {
    DaLineClamp,
  },

  props: {
    size: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    placeholder: String,
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageBackground: {
      type: String,
      default: 'none',
    },
    lines: {
      type: Number,
      default: 3,
    },
  },

  computed: {
    imgStyle() {
      return {
        background: this.imageBackground,
      };
    },

    cls() {
      return {
        [this.size]: true,
      };
    },
  },

  methods: {
    truncateTitle(text) {
      return text[0];
    },
  },
};
</script>
<style>
.card {
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &.small {
    & .card__link:before {
      padding-top: 89.36%;
    }

    & .card__background {
      height: 57.14%;
    }
  }

  &.large {
    & .card__link:before {
      padding-top: 110.63%;
    }

    & .card__background {
      height: 65.38%;
    }
  }

  & .ls-blur-up-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  & .ls-blur-up-img {
    opacity: 1;
    transition: opacity 200ms;
  }

  & .ls-blur-up-img.ls-inview.ls-original-loaded {
    opacity: 0;
  }
}

.card__link {
  position: relative;
  flex: 1;

  &:before {
    content: '';
    display: block;
    padding-top: 100.71%;
  }
}

.card__background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 62%;
  border-radius: 8px;
  overflow: hidden;
}

.card__background__image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .2s linear;
  transform-origin: center;
}

.card__content {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: var(--theme-background-highlight);
  border-radius: 8px 8px 0 0;
  z-index: 1;

  &:before {
    content: '';
    display: block;
    padding-top: 44%;
  }
}

.card__title {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: 24px;
  color: var(--theme-primary);
  text-align: center;
  word-break: break-word;
}

.card__footer {
  display: flex;
  height: 48px;
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
  background: var(--theme-background-highlight);
  border-radius: 0 0 8px 8px;

  & > * {
    margin: 0 4px;
  }
}

.card__hover {
  transition: transform 0.2s ease-in;
  transform-origin: center;
}

.card:hover,
.card.hover {
  & .card__background__image {
    transform: translate3d(0, 4px, 0) scale(1.05);
  }
}

.animate-cards .card:hover,
.animate-cards .card.hover {
  & .card__hover {
    transform: translate3d(0, -16px, 0) scale(1.03);
  }
}
</style>
