import { storiesOf } from '@storybook/vue';

import DaDropdown from '../src/components/DaDropdown.vue';

storiesOf('Dropdown', module)
  .add('regular', () => ({
    template: `
      <da-dropdown style="width: 160px;" :placeholder="'Placeholder'" :items="items" />
    `,
    components: {
      DaDropdown,
    },

    data() {
      return {
        items: [
          { value: '1', text: 'Daily' },
          { value: '2', text: 'Twitter' },
          { value: '3', text: 'Facebook' },
          { value: '4', text: 'DEV' },
          { value: '5', text: 'Reddit' },
        ]
      };
    },
  }));