<template>
  <main>
    <h1>Welcome home, meet your new-tab!</h1>
    <p>
      Daily is the world’s leading dev news curator made with &#60;3 by developers for developers.
      It is a new-tab, dev-centered feed. From now on, you can use your time better.
    </p>
    <div class="onboarding__consents">
      <div class="onboarding__consent" v-if="isFirefox">
        <da-switch class="small" @toggle="analyticsConsent = $event"/>
        <div>I would like to improve Daily by opting-in for analytics data collection (such
          as clicks and page views)
        </div>
      </div>
      <div class="onboarding__consent">
        <da-switch class="small" @toggle="termsConsent = $event"/>
        <div>I agree to the
          <a href="https://www.dailynow.co/eula" target="_blank">Terms</a>,
          <a href="https://www.dailynow.co/privacy" target="_blank">Privacy</a> and
          <a href="https://www.dailynow.co/cookie" target="_blank">Cookie Policy</a>.
        </div>
      </div>
    </div>
    <da-svg src="/graphics/tab.svg" class="onboarding__tab onboarding__placeholder"/>
    <button class="btn btn-big btn-water-cheese" :disabled="!termsConsent" @click="proceed">
      Got it
    </button>
  </main>
</template>
<script>
import DaSwitch from '@daily/components/src/components/DaSwitch.vue';
import DaSvg from '../components/DaSvg.vue';
import initializeAnalytics from '../common/analytics';
import { ANALYTICS_CONSENT_KEY, TERMS_CONSENT_KEY, setCache } from '../common/cache';
import { browserName } from '../common/browser';

export default {
  name: 'Step1',

  components: {
    DaSwitch,
    DaSvg,
  },

  data() {
    return {
      termsConsent: false,
      analyticsConsent: false,
      isFirefox: browserName === 'firefox',
    };
  },

  methods: {
    proceed() {
      setCache(TERMS_CONSENT_KEY, this.termsConsent);
      if (this.isFirefox) {
        setCache(ANALYTICS_CONSENT_KEY, this.analyticsConsent);
        initializeAnalytics(this.analyticsConsent, null);
      }
      this.$router.push({ path: '/onboarding/2' });
    },
  },
};
</script>
<style>
.onboarding__tab {
  height: 293px;
}

.onboarding__consents {
  max-width: 594px;
  margin: -8px 0;
}

.onboarding__consent {
  display: flex;
  margin: 8px 0;
  flex-direction: row;
  align-items: center;
  color: var(--theme-primary);

  @mixin nuggets;

  & div {
    margin-left: 12px;
    flex: 1;
    text-align: left;
  }

  & a, & a:visited {
    color: var(--color-water-50);
  }
}
</style>
