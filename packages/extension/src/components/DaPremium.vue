<template>
  <da-modal class="premium-modal invert" @close="$emit('close')">
    <button class="btn-icon modal__close-btn" @click="$emit('close')">
      <svgicon name="x"/>
    </button>
    <da-svg src="/graphics/premium_glitter.svg" class="premium-glitter-badge"/>
    <da-switch class="small" @toggle="annually = $event" :checked="annually"
               label="Billed annually"/>
    <div class="premium-modal__price-container">
      <div class="premium-modal__price"><sup class="quarter">$</sup>{{selectedPricing.price}}</div>
      <div class="premium-modal-price-details">
        <div class="jr" v-show="selectedPricing.discount">Save {{selectedPricing.discount}}</div>
        <div class="jr">/ month</div>
      </div>
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
    <div class="premium-modal__buttons">
      <a href="https://daily.dev/premium" class="btn btn-hollow btn-big"
         @click="onLearnClick">Learn more</a>
      <a :href="selectedPricing.url" class="premium-modal__btn btn btn-big"
         autofocus @click="onClick" v-if="isLoggedIn">Upgrade now</a>
      <button class="premium-modal__btn btn btn-big"
         autofocus @click="onLoginClick" v-else>Upgrade now</button>
    </div>
    <div class="premium-modal__note nuggets" v-if="!isLoggedIn">
      Make sure to sign up before upgrading
    </div>
  </da-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaSwitch from '@daily/components/src/components/DaSwitch.vue';
import '@daily/components/icons/x';
import '@daily/components/icons/v';
import '@daily/components/icons/logo';
import DaSvg from './DaSvg.vue';

export default {
  name: 'DaProfile',

  components: {
    DaModal,
    DaSvg,
    DaSwitch,
  },

  data() {
    return {
      annually: true,
      pricing: {
        annually: {
          price: 4,
          url: 'https://r.daily.dev/checkout?sub=annually',
          discount: '33%',
        },
        monthly: {
          price: 6,
          url: 'https://r.daily.dev/checkout?sub=monthly',
        },
      },
    };
  },

  computed: {
    selectedPricing() {
      if (this.annually) {
        return this.pricing.annually;
      }
      return this.pricing.monthly;
    },

    ...mapGetters('user', ['isLoggedIn']),
  },

  methods: {
    onLearnClick() {
      ga('send', 'event', 'Premium', 'Learn');
    },

    onLoginClick() {
      this.$emit('close');
      this.$emit('login');
    },

    onClick() {
      ga('send', 'event', 'Premium', 'Click');
    },
  },

  mounted() {
    ga('send', 'event', 'Premium', 'Open');
  },
};
</script>

<style>
.premium-modal {
  --color-bacon: var(--color-bacon-60);

  & .modal__container {
    padding-left: 40px;
    padding-right: 40px;
    align-items: flex-start;
  }

  & .premium-glitter-badge {
    margin-bottom: 24px;
  }

  & .premium-modal__price-container,
  & .switch {
    margin: 8px 0;
  }

  & .switch {
    --da-switch-checked-background: var(--color-bacon-30);
    --da-switch-checked-color: var(--theme-premium);

    & .switch__label {
      color: var(--theme-primary);
    }
  }
}

.bright .premium-modal {
  --color-bacon: var(--color-bacon-40);
}

.premium-modal__perks {
  margin: 16px 0;
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

.premium-modal__price-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.premium-modal__price {
  color: var(--theme-primary);
  font-size: 64px;
  line-height: 72px;
  font-weight: bold;

  & sup {
    vertical-align: top;
  }
}

.premium-modal-price-details {
  margin-left: 12px;
  color: var(--theme-secondary);

  & :first-child {
    color: var(--theme-premium);
  }
}

.premium-modal__buttons {
  display: flex;
  flex-direction: row;
  align-self: stretch;
  justify-content: space-between;
  margin-top: 8px;
}

.premium-modal__note {
  margin-top: 16px;
  color: var(--theme-secondary);
  align-self: center;
}
</style>
