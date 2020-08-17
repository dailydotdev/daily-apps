<template>
  <da-modal class="confirm-acc-modal invert" @close="$emit('close')" :close-on-click="false">
    <form class="confirm-acc__form" ref="form">
      <h3 class="confirm-acc__title">Account Details</h3>
      <div class="confirm-acc__subtitle micro2">Please confirm your details below</div>
      <img :src="profileImage" class="confirm-acc__image" alt="Your profile image"/>
        <da-text-field class="confirm-acc__field confirm-acc" name="name" label="Name" required
          :maxlength="50" :value="name" @validity="updateFormValidity"/>
      <da-text-field class="confirm-acc__field confirm-acc__email" name="email" label="Email"
        type="email" required :value="email" :hint="emailHint" ref="email"
        save-hint-space @validity="updateEmailValidity"/>
      <da-text-field class="confirm-acc__field" name="company" label="Company"
        :value="company" @validity="updateFormValidity"/>
      <da-text-field class="confirm-acc__field" name="title" label="Job title"
        :value="title" @validity="updateFormValidity"/>
      <da-switch class="confirm-acc__switch small" name="acceptedMarketing"
                 label="Subscribe to the Weekly Recap" :checked="acceptedMarketing"/>
      <div class="confirm-acc__buttons">
        <button type="button" class="confirm-acc__logout btn btn-hollow btn-big"
          @click="onLogout">
          Cancel
        </button>
        <button type="submit" class="confirm-acc__submit btn btn-invert btn-big"
          :disabled="disableSubmit" @click.prevent="submitForm">
          Confirm
        </button>
      </div>
    </form>
  </da-modal>
</template>

<script>
import 'lazysizes';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import DaSwitch from '@daily/components/src/components/DaSwitch.vue';
import updateProfileMixin from '../common/updateProfileMixin';

export default {
  name: 'DaConfirmAccount',
  mixins: [updateProfileMixin],

  components: {
    DaModal,
    DaTextField,
    DaSwitch,
  },

  mounted() {
    this.updateFormValidity();
  },
};
</script>

<style>
.confirm-acc-modal.modal .modal__container {
  width: 400px;
  padding: 0;
  color: var(--theme-secondary);
  background: var(--theme-background-highlight);
}

.confirm-acc__form {
  display: flex;
  width: 100%;
  padding: 32px 40px;
  flex-direction: column;
}

.confirm-acc__title {
  color: var(--theme-primary);
  text-transform: uppercase;
}

.confirm-acc__subtitle {
  margin: 8px 0 6px;
}

.confirm-acc__title, .confirm-acc__subtitle, .confirm-acc__image {
  align-self: center;
}

.confirm-acc__field {
  margin: 6px 0;

  &.show-hint {
    margin-bottom: 10px;
  }
}

.confirm-acc__image {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  margin: 18px 0;
}

.confirm-acc__email {
  margin: 6px 0 8px;
}

.confirm-acc__buttons {
  display: flex;
  margin-top: 24px;
  flex-direction: row;
  justify-content: space-between;
}

.confirm-acc__switch {
  margin: 18px 0 8px;
}

.confirm-acc__submit {
  width: 216px;
  justify-content: center;
}

.confirm-acc__logout {
  width: 88px;
  justify-content: center;
}
</style>
