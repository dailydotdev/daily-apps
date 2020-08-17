import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      disableSubmit: false,
      emailHint: null,
    };
  },

  computed: {
    ...mapState({
      isLoggedIn(state) {
        return !!state.user.profile;
      },

      name(state) {
        return this.isLoggedIn ? state.user.profile.name : '';
      },

      email(state) {
        return this.isLoggedIn ? state.user.profile.email : '';
      },

      profileImage(state) {
        return this.isLoggedIn ? state.user.profile.image : '';
      },

      company(state) {
        return this.isLoggedIn ? state.user.profile.company : '';
      },

      title(state) {
        return this.isLoggedIn ? state.user.profile.title : '';
      },

      provider(state) {
        return this.isLoggedIn ? state.user.profile.providers[0] : '';
      },

      acceptedMarketing(state) {
        return this.isLoggedIn ? state.user.profile.acceptedMarketing : false;
      },
    }),
  },

  methods: {
    async onLogout() {
      ga('send', 'event', this.$options.name.substr(2), 'Logout');
      this.$emit('close');
      // TODO: handle error
      await this.logout();
    },

    updateFormValidity() {
      this.disableSubmit = !this.$refs.form.checkValidity();
    },

    async submitForm() {
      ga('send', 'event', this.$options.name.substr(2), 'Update');
      const data = Array.from(this.$refs.form.elements).reduce((acc, val) => {
        if (val.name === '') {
          return acc;
        }
        if (val.type === 'checkbox') {
          return Object.assign(acc, { [val.name]: val.checked });
        }
        return Object.assign(acc, { [val.name]: val.value.length ? val.value : null });
      }, {});
      try {
        this.disableSubmit = true;
        await this.updateProfile(data);
        this.disableSubmit = false;
        this.$emit('close');
      } catch (err) {
        if (err && err.response && err.response.data && err.response.data.code === 1 && err.response.data.message === 'email already exists') {
          this.$refs.email.invalid = true;
          this.emailHint = 'This email already exists';
        } else {
          throw err;
        }
      }
    },

    updateEmailValidity(valid) {
      if (valid) {
        this.emailHint = null;
      } else {
        this.emailHint = 'Please enter a valid email';
      }
      this.updateFormValidity();
    },

    ...mapActions({
      logout: 'user/logout',
      updateProfile: 'user/updateProfile',
    }),
  },
};
