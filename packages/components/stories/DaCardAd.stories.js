import { storiesOf } from '@storybook/vue';

import DaCardAd from '../src/components/DaCardAd.vue';

storiesOf('DaCardAd', module)
  .add('default', () => ({
    components: { DaCardAd },
    template: '<da-card-ad :ad="ad"/>',
    data() {
      return {
        ad: {
          link: 'https://github.com/dailydotdev/daily',
          description: 'daily.dev is 100% open-source! Show us your love by starring our page',
          image: 'https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/ads/b46b6f1b2e945b9ef52545ef9ca71969'
        }
      };
    },
  }))
  .add('BSA', () => ({
    components: { DaCardAd },
    template: '<da-card-ad :ad="ad"/>',
    data() {
      return {
        ad: {
          link: 'https://github.com/dailydotdev/daily',
          description: 'daily.dev is 100% open-source! Show us your love by starring our page',
          image: 'https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/ads/b46b6f1b2e945b9ef52545ef9ca71969',
          source: 'BSA',
          backgroundColor: 'white',
        }
      };
    },
  }));

