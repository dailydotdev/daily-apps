<template>
  <da-modal class="profile-modal invert" @close="$emit('close')">
    <form class="profile__form" ref="form">
      <h3 class="profile__title">Your Profile
        <da-svg v-if="isPremium" src="/graphics/premium.svg" class="premium-badge"/>
      </h3>
      <div class="profile__subtitle micro2">Edit your profile details</div>
      <div class="profile__provider micro2">
        <svgicon :name="provider"></svgicon>
        <span>via {{provider | provider}}</span>
      </div>
      <div class="profile__field multiple">
        <img :src="profileImage" class="profile__image" alt="Your profile image"/>
        <da-text-field class="profile__name" name="name" label="Name" required
                       :maxlength="50" :value="name" @validity="updateFormValidity"/>
      </div>
      <da-text-field class="profile__field profile__email" name="email" label="Email"
                     type="email" required :value="email" :hint="emailHint" ref="email"
                     save-hint-space @validity="updateEmailValidity"/>
      <da-text-field class="profile__field" name="company" label="Company"
                     :value="company" @validity="updateFormValidity"/>
      <da-text-field class="profile__field" name="title" label="Job title"
                     :value="title" @validity="updateFormValidity"/>
      <da-switch class="profile__switch small" name="acceptedMarketing"
                 label="Subscribe to the Weekly Recap" :checked="acceptedMarketing"/>
      <button type="submit" class="profile__submit btn btn-invert btn-big"
              :disabled="disableSubmit" @click.prevent="submitForm" autofocus>
        Save Changes
      </button>
    </form>
    <nav class="profile__nav">
      <button class="btn-icon profile__close" @click="$emit('close')">
        <svgicon name="x"/>
      </button>
      <ul class="profile__links">
        <li class="profile__link profile__get-premium" v-if="!isPremium">
          <button class="lil2" @click="showPremium">Get premium</button>
        </li>
        <li class="profile__link" v-for="link in links" :key="link.text">
          <a :href="link.link" class="micro1">{{link.text}}</a>
        </li>
        <li class="profile__link" v-if="isPremium">
          <a href="mailto:support@daily.dev?subject=Cancel my premium subscription" target="_blank"
             rel="noopener noreferrer" class="micro1">Cancel subscription</a>
        </li>
        <li class=profile__link>
          <button class="micro1" @click="onLogout">Logout</button>
        </li>
      </ul>
      <div class="profile__version micro2">
        // Version {{ version }}
      </div>
    </nav>
  </da-modal>
</template>

<script>
import 'lazysizes';
import { mapGetters, mapMutations } from 'vuex';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import DaSwitch from '@daily/components/src/components/DaSwitch.vue';
import '@daily/components/icons/x';
import DaSvg from './DaSvg.vue';
import { version } from '../common/config';
import updateProfileMixin from '../common/updateProfileMixin';

export default {
  name: 'DaProfile',
  mixins: [updateProfileMixin],

  components: {
    DaModal,
    DaTextField,
    DaSvg,
    DaSwitch,
  },

  data() {
    return {
      version,
      links: [
        { text: 'FAQ', link: 'https://github.com/dailydotdev/daily/blob/master/FAQs.md' },
        {
          text: 'Request a feature',
          link: 'https://github.com/dailydotdev/daily/issues/new?assignees=&labels=Type%3A+Feature&template=---feature-request.md&title=%F0%9F%A7%A9+FEATURE+REQUEST%3A+',
        },
        {
          text: 'Report an issue',
          link: 'https://github.com/dailydotdev/daily/issues/new?assignees=&labels=Type%3A+Bug&template=---bug-report.md&title=%F0%9F%90%9B+BUG%3A+',
        },
        { text: 'Privacy policy', link: 'https://daily.dev/privacy' },
        { text: 'Cookie policy', link: 'https://daily.dev/cookie' },
        { text: 'Terms of Service', link: 'https://daily.dev/terms' },
      ],
    };
  },

  computed: {
    ...mapGetters('user', ['isPremium']),
  },

  methods: {
    showPremium() {
      this.$emit('close');
      setTimeout(() => {
        this.setShowPremium(true);
      }, 50);
    },

    ...mapMutations({
      setShowPremium: 'ui/setShowPremium',
    }),
  },

  mounted() {
    import('@daily/components/icons/google');
    import('@daily/components/icons/github');
    this.updateFormValidity();
  },
};
</script>

<style>
.profile-modal.modal .modal__container {
  width: 640px;
  padding: 0;
  flex-direction: row;
  align-items: stretch;
  color: var(--theme-secondary);
  background: var(--theme-background-highlight);
}

.profile__form {
  display: flex;
  padding: 32px 40px;
  flex-direction: column;
  flex: 1;
}

.profile__nav {
  position: relative;
  display: flex;
  width: 220px;
  padding: 16px;
  flex-direction: column;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: var(--theme-hover);
    opacity: 1;
    pointer-events: none;
  }
}

.profile__close {
  align-self: flex-end;
}

.profile__links, .profile__version {
  padding: 0 16px;
}

.profile__links {
  margin-top: 88px;
  list-style: none;

  & > * {
    margin: 4px 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.profile__link {
  & > * {
    color: var(--theme-secondary);
  }

  &.profile__get-premium {
    & button {
      background: var(--theme-premium);
      padding: 4px 8px;
      border-radius: 4px;
      color: var(--color-salt-10);
    }
  }

  & button {
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
  }
}

.profile__version {
  color: var(--theme-disabled);
  margin-top: 40px;
}

.profile__title {
  display: flex;
  align-items: center;
  color: var(--theme-primary);
  text-transform: uppercase;

  & .premium-badge {
    margin-left: 8px;
  }
}

.profile__subtitle {
  margin-top: 8px;
}

.profile__provider {
  display: flex;
  margin: 24px 0 2px;
  align-self: flex-end;

  & .svg-icon {
    width: 16px;
    height: 16px;
    margin-right: 12px;
  }
}

.profile__field {
  margin: 6px 0;

  &.multiple {
    display: flex;
    flex-direction: row;
  }

  &.show-hint {
    margin-bottom: 10px;
  }
}

.profile__switch {
  margin: 18px 0 8px;
}

.profile__image {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  margin-right: 16px;
}

.profile__name {
  flex: 1;
}

.profile__email {
  margin: 6px 0 8px;
}

.profile__submit {
  margin-top: 24px;
  justify-content: center;
}
</style>
