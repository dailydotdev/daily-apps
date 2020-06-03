<template>
  <da-modal class="premium-modal invert" @close="$emit('close')">
    <button class="btn-icon modal__close-btn" @click="$emit('close')">
      <svgicon name="x"/>
    </button>
    <svgicon name="logo" class="premium-modal__logo"/>
    <h3 class="premium-modal__title">Daily Premium is coming</h3>
    <div class="premium-modal__bar"></div>
    <div class="premium-modal__discount lil2">
      50% pre-launch discount for daily users!
    </div>
    <ul class="premium-modal__perks">
      <li class="premium-modal__perk">
        <svgicon name="v"/>
        <span class="micro1">
          Integrate Daily with +100 apps like Slack, MS Teams, Pocket, Twitter and more!
        </span>
      </li>
      <li class="premium-modal__perk">
        <svgicon name="v"/>
        <span class="micro1">
          Add any source directly to your personal feed
        </span>
      </li>
      <li class="premium-modal__perk">
        <svgicon name="v"/>
        <span class="micro1">
          Manage your bookmarks
        </span>
      </li>
      <li class="premium-modal__perk">
        <svgicon name="v"/>
        <span class="micro1">
          Priority support
        </span>
      </li>
      <li class="premium-modal__perk">
        <svgicon name="v"/>
        <span class="micro1">
          100% Ads-free
        </span>
      </li>
      <li class="premium-modal__perk">
        <svgicon name="v"/>
        <span class="micro1">
          Help us grow
        </span>
      </li>
    </ul>
    <a href="https://daily.dev/premium" class="premium-modal__btn btn btn-big"
        autofocus @click="onClick">Notify me</a>
  </da-modal>
</template>

<script>
import DaModal from '@daily/components/src/components/DaModal.vue';
import '@daily/components/icons/x';
import '@daily/components/icons/v';
import '@daily/components/icons/logo';

export default {
  name: 'DaProfile',

  components: {
    DaModal,
  },

  methods: {
    onClick() {
      ga('send', 'event', 'Premium', 'Click');
    },
  },

  mounted() {
    ga('send', 'event', 'Premium', 'Open');
    setTimeout(() => {
      this.$el.classList.add('loaded');
    });
  },
};
</script>

<style>
.premium-modal {
  --color-bacon: var(--color-bacon-60);

  & .modal__container {
    padding-left: 40px;
    padding-right: 40px;
  }

  & .premium-modal__logo,
  & .premium-modal__title,
  & .premium-modal__bar,
  & .premium-modal__discount {
    margin: 10px 0;
  }

  & .premium-modal__logo {
    margin-top: 0;
  }

  & .premium-modal__discount {
    margin-bottom: 0;
  }

  &.loaded .premium-modal__bar:after {
    transform: none;
  }
}

.bright .premium-modal {
  --color-bacon: var(--color-bacon-40);
}

.premium-modal__logo {
  width: 56px;
  height: 56px;
  color: var(--theme-primary);
}

.premium-modal__title {
  color: var(--theme-primary);
  text-transform: uppercase;
}

.premium-modal__bar {
  position: relative;
  width: 100%;
  max-width: 295px;
  height: 8px;
  overflow: hidden;
  border-radius: 8px;
  background: var(--theme-background-primary);

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 85%;
    border-radius: 8px;
    background: linear-gradient(90deg, var(--color-ketchup-40) 0%, var(--color-bacon) 100%);
    transform: translateX(-100%);
    will-change: transform;
    transition: transform linear 0.3s;
  }
}

.premium-modal__discount {
  max-width: 245px;
  color: var(--color-bacon);
  text-align: center;
}

.premium-modal__perks {
  margin: 24px 0;
  padding: 0;
}

.premium-modal__perk {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 5px 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }

  & .svg-icon {
    color: var(--color-bacon);
    margin-right: 8px;
  }

  & span {
    color: var(--theme-primary);
    flex: 1;
  }
}

.premium-modal__btn {
  width: 190px;
  justify-content: center;
  --button-color: var(--color-salt-10);
  --button-background: linear-gradient(90deg, var(--color-ketchup-40) 0%, var(--color-bacon) 100%);
  --button-focus-border: var(--color-water-20);
}
</style>
