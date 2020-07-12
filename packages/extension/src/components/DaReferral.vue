<template>
  <da-modal class="referral" @close="$emit('close')">
    <div class="referral__inst">
      <h3>Invite people</h3>
      <div class="referral__desc micro2">Share your 💌 for daily.dev with your developer friends and
        help us grow.
      </div>
      <template v-if="!isLoggedIn">
        <da-text-field ref="url" class="referral__field" label="Referral link"
                       hide-label :value="link" readonly/>
        <button class="btn btn-invert btn-big referral__cta" @click="copyLink"
                :class="{ completed: copied }">
          <svgicon name="copy"/>
          <span>Copy link</span>
          <span class="completed-text">Copied!</span>
        </button>
      </template>
      <template v-else>
        <da-text-field ref="email" class="referral__field small-margin" type="email" label="Email"
                       icon="mail" autofocus required @enter="sendInvite"
                       @validity="validEmail = $event" :hint="emailHint" save-hint-space/>
        <button class="btn btn-invert btn-big referral__cta small-margin" @click="sendInvite"
                :class="{ completed: sent }" :disabled="sending">
          <span>{{ sending ? 'Sending...' : 'Send invite' }}</span>
          <span class="completed-text">Sent!</span>
        </button>
      </template>
      <div class="micro2 referral__or" :class="{ 'switch-margin': !isLoggedIn }">
        or
        <template v-if="!isLoggedIn"> share via</template>
      </div>
      <a class="referral__twitter" target="_blank" :href="tweet"
         @click="onTwitter" v-if="!isLoggedIn">
        <img src="/logos/twitter.svg"/>
        <span>Twitter</span>
      </a>
      <button class="btn btn-hollow btn-big referral__cta" @click="copyLink"
              :class="{ completed: copied }" v-else>
        <svgicon name="copy"/>
        <span>Copy link</span>
        <span class="completed-text">Copied!</span>
      </button>
    </div>
    <div class="referral__cover">
      <img :src="cover" v-if="cover"/>
      <a class="referral__cover__link" target="_blank" href="https://twitter.com/dailydotdev">
        <svgicon name="twitter"/>
        <span>@dailydotdev</span>
      </a>
    </div>
  </da-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import '@daily/components/icons/mail';
import '@daily/components/icons/copy';
import '@daily/components/icons/twitter';
import { fetchTimeout } from '../common/fetch';

export default {
  name: 'DaReferral',

  components: {
    DaModal,
    DaTextField,
  },

  data() {
    return {
      copied: false,
      sent: false,
      sending: false,
      link: 'https://app.dailynow.co/get?r=share',
      cover: null,
      validEmail: false,
      emailHint: '',
    };
  },

  computed: {
    tweet() {
      const text = 'Daily makes it extremely easy to stay updated with the latest dev news.\n'
        + 'It’s a 100% open-source browser extension, free (forever), and doesn’t even require a signup. A must-have tool for every busy developer. @dailydotdev\n';
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.link)}`;
    },

    ...mapGetters('user', ['isLoggedIn']),
  },

  watch: {
    async link() {
      await this.$nextTick();
      if (this.$refs.url) {
        const copy = this.$refs.url.$el.querySelector('input');
        copy.setSelectionRange(0, 0);
      }
    },
    validEmail(val) {
      if (val) {
        this.emailHint = '';
      }
    },
  },

  methods: {
    async copyLink() {
      ga('send', 'event', 'Referral', 'Click', 'Copy');
      await navigator.clipboard.writeText(this.link);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 1000);
    },

    onTwitter() {
      ga('send', 'event', 'Referral', 'Click', 'Twitter');
    },

    async sendInvite() {
      if (this.sent || this.sending) {
        return;
      }
      if (!this.validEmail) {
        this.emailHint = 'Please enter a valid email';
        return;
      }
      ga('send', 'event', 'Referral', 'Click', 'Email');
      const email = this.$refs.email.currentValue;
      this.sending = true;
      await fetchTimeout(`${process.env.VUE_APP_API_URL}/v1/referrals/invite`, 5000, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      this.sending = false;
      this.$refs.email.updateValue('');
      this.$refs.email.updateInvalid(true);
      this.sent = true;
      setTimeout(() => {
        this.sent = false;
      }, 1000);
    },
  },

  mounted() {
    ga('send', 'event', 'Referral', 'Impression', undefined, { nonInteraction: true });
  },

  async created() {
    const res = await fetchTimeout(`${process.env.VUE_APP_API_URL}/v1/referrals/link`, 5000, { credentials: 'same-origin' });
    const data = await res.json();
    this.link = data.link;
    this.cover = data.cover;
  },
};
</script>

<style>
.referral.modal .modal__container {
  width: 720px;
  padding: 0;
  flex-direction: row;
  align-items: stretch;

  & h3 {
    text-transform: uppercase;
  }

  & h3, & h5 {
    color: var(--theme-primary);
  }

  & .btn .completed-text {
    display: none;
  }

  & .btn.completed {
    --button-color: var(--color-pepper-90);
    --button-background: var(--color-avocado-70);
    --button-border: none;
    pointer-events: none;

    & .svg-icon, & span {
      display: none;
    }

    & .completed-text {
      display: inline-block;
    }
  }
}

.referral__inst,
.referral__cover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.referral__inst {
  width: 400px;
  padding: 32px;
  background: var(--theme-background-secondary);
}

.referral__cover {
  position: relative;
  flex: 1;
  border-left: 1px solid var(--theme-separator);

  & img {
    width: 100%;
    object-fit: cover;
  }

  &:before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: linear-gradient(0deg, var(--color-pepper-90) 0%, rgba(0, 0, 0, 0) 100%);
  }
}

.referral__desc, .referral__or {
  margin: 8px 0 12px;
  color: var(--theme-secondary);
}

.referral__or.switch-margin {
  margin: 12px 0 8px;
}

.referral__field, .referral__cta, .referral__twitter {
  margin: 12px 0;
}

.referral__field {
  align-self: stretch;

  &.small-margin {
    margin-bottom: 4px;
  }
}

.referral__or, .referral__twitter {
  align-self: center;
}

.referral__cta {
  justify-content: center;
  align-self: stretch;
}

.referral__cta.small-margin {
  margin-top: 4px;
}

.referral__twitter {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px;
  border-radius: 8px;
  color: var(--theme-secondary);
  background: var(--theme-background-highlight);

  & img {
    width: 20px;
    height: 20px;
  }

  & span {
    margin: 0 6px;
  }
}

.referral__cover__link {
  position: absolute;
  left: 12px;
  bottom: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--color-salt-10);
  font-size: 10px;
  font-style: oblique;
  letter-spacing: 0.33px;
  line-height: 18px;
  z-index: 2;

  & .svg-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    color: var(--color-salt-10);
  }
}
</style>
