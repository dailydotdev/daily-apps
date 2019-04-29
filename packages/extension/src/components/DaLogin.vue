<template>
  <da-modal class="login-modal invert" @close="$emit('close')">
    <img svg-inline src="../svg/login_bg.svg" class="login__background"
         slot="background" alt="Login background"/>
    <svgicon icon="logo" class="login__logo no-hover"/>
    <h1>Sign in to Daily</h1>
    <div class="login__desc">
      <svgicon icon="link" class="login__desc__icon no-hover"/>
      <p class="login__desc__text">
        Influence content by requesting sources & articles
      </p>
    </div>
    <div class="login__desc">
      <svgicon icon="mobile" class="login__desc__icon no-hover"/>
      <p class="login__desc__text">
        Sync settings and bookmarks across devices & browsers
      </p>
    </div>
    <div class="login__desc">
      <svgicon icon="user" class="login__desc__icon no-hover"/>
      <p class="login__desc__text">
        Help the community by moderating irrelevant content
      </p>
    </div>
    <div class="login__buttons">
      <a :href="getLoginLink('github')" class="btn btn-big btn-water-cheese"
         @click="onLogin('github')">
        <svgicon icon="github"/>
        <span>Sign in with GitHub</span>
      </a>
      <span class="login__buttons__or">Or</span>
      <a :href="getLoginLink('google')" class="btn btn-hollow"
         @click="onLogin('google')">
        <svgicon icon="google"/>
      </a>
    </div>
  </da-modal>
</template>

<script>
import 'lazysizes';
import DaModal from '@daily/components/src/components/DaModal.vue';
import { authService } from '../common/services';

export default {
  name: 'DaLogin',

  components: {
    DaModal,
  },

  methods: {
    getLoginLink(provider) {
      const redirectUri = browser.extension.getURL(`index.html?provider=${provider}`);
      return authService.getAuthorizationUrl(provider, redirectUri);
    },

    onLogin(provider) {
      ga('send', 'event', 'Login', 'Initialized', provider);
    },
  },

  mounted() {
    import('@daily/components/icons/logo');
    import('@daily/components/icons/link');
    import('@daily/components/icons/user');
    import('@daily/components/icons/mobile');
    import('@daily/components/icons/google');
    import('@daily/components/icons/github');
  },
};
</script>

<style>
.login-modal.modal .modal__container {
  padding: 16px 32px 40px;
  color: var(--theme-primary);

  & .login__logo {
    width: 100px;
    height: 100px;
    color: var(--theme-primary);
  }

  & h1 {
    margin: 0 0 12px;
  }

  & .login__desc {
    display: flex;
    width: 100%;
    margin: 12px 0;
    flex-direction: row;
    align-items: center;
  }

  & .login__desc__icon {
    width: 48px;
    height: 48px;
  }

  & .login__desc__text {
    color: var(--theme-secondary);
    text-align: left;
    margin: 0 0 0 16px;
    flex: 1;
  }

  & .login__buttons {
    display: flex;
    flex-direction: row;
    margin-top: 18px;
    align-items: center;

    & .btn.btn-hollow {
      padding: 4px;
      border-color: var(--theme-secondary);

      & .svg-icon {
        margin: 0;
        color: var(--theme-secondary);
      }
    }
  }

  & .login__buttons__or {
    margin: 0 16px;
    color: var(--theme-secondary);

    @mixin lil2;
  }
}

.login__background {
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  margin: auto;
}
</style>
