<template>
  <da-modal class="profile-modal invert" @close="$emit('close')">
    <form class="profile__form" ref="form">
      <h3 class="profile__title">Your Profile</h3>
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
        <li class="profile__link" v-for="link in links" :key="link.text">
          <a :href="link.link" class="micro1">{{link.text}}</a>
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
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import '@daily/components/icons/x';
import { version } from '../common/config';
import updateProfileMixin from '../common/updateProfileMixin';

export default {
  name: 'DaProfile',
  mixins: [updateProfileMixin],

  components: {
    DaModal,
    DaTextField,
  },

  data() {
    return {
      version,
      links: [
        { text: 'FAQ', link: 'https://github.com/dailydotdev/daily/blob/master/FAQs.md' },
        { text: 'Request a feature', link: 'https://github.com/dailydotdev/daily/issues/new?assignees=&labels=Type%3A+Feature&template=---feature-request.md&title=%F0%9F%A7%A9+FEATURE+REQUEST%3A+' },
        { text: 'Report an issue', link: 'https://github.com/dailydotdev/daily/issues/new?assignees=&labels=Type%3A+Bug&template=---bug-report.md&title=%F0%9F%90%9B+BUG%3A+' },
        { text: 'Privacy policy', link: 'https://daily.dev/privacy' },
        { text: 'Cookie policy', link: 'https://daily.dev/cookie' },
        { text: 'Terms of Service', link: 'https://daily.dev/terms' },
      ],
    };
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
  background: var(--theme-background-primary);
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
    opacity: var(--theme-hover-opacity);
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
  color: var(--theme-primary);
  text-transform: uppercase;
}

.profile__subtitle {
  margin-top: 8px;
}

.profile__provider {
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
