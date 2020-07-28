import { storiesOf } from '@storybook/vue';

import DaInsaneAd from '../src/components/DaInsaneAd.vue';

storiesOf('DaInsaneAd', module)
  .add('default', () => ({
    components: { DaInsaneAd },
    template: '<da-insane-ad :ad="ad"/>',
    data() {
      return {
        ad: {
          link: 'https://github.com/dailydotdev/daily',
          description: 'daily.dev is 100% open-source! Show us your love by starring our page',
          image: 'https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/ads/b46b6f1b2e945b9ef52545ef9ca71969'
        }
      };
    },
  }));

