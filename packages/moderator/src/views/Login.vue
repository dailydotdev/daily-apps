<template>
  <div class="login page">
    <a :href="getLoginLink('github')" class="btn btn-big btn-water-cheese">
      <svgicon name="github"/>
      <span>Sign in with GitHub</span>
    </a>
    <span class="login__or">Or</span>
    <a :href="getLoginLink('google')" class="btn btn-hollow">
      <svgicon name="google"/>
    </a>
  </div>
</template>

<script>
import { authService } from '../common/services';
import anonymousGuard from '../router/guards/anonymous';

export default {
  name: 'Login',

  beforeRouteEnter: anonymousGuard,
  methods: {
    getLoginLink(provider) {
      const redirectUri = window.location.origin;
      return authService.getAuthorizationUrl(provider, redirectUri);
    },
  },

  async mounted() {
    import('@daily/components/icons/google');
    import('@daily/components/icons/github');
  },
};
</script>

<style>
.login {
  flex-direction: row;
  align-items: center;
  justify-content: center;

  & .btn.btn-hollow {
    padding: 4px;
    --button-color: var(--theme-secondary);
    --button-border: 1px solid var(--theme-secondary);

    & .svg-icon {
      margin: 0;
    }
  }

  & .login__or {
    margin: 0 16px;
    color: var(--theme-secondary);

    @mixin lil2;
  }
}
</style>
