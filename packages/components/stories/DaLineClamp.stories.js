import { storiesOf } from '@storybook/vue';
import { withKnobs, text } from '@storybook/addon-knobs';

import DaLineClamp from '../src/components/DaLineClamp.vue';

storiesOf('DaLineClamp', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    components: { DaLineClamp },
    template: '<da-line-clamp :text="text" style="color: var(--theme-primary)"/>',
    props: {
      text: {
        default: text('text', 'resize the window to see this text truncates! I just need to write a few more words to make this sentence very long'),
      },
    },
  }))
  .add('multi line', () => ({
    components: { DaLineClamp },
    template: '<da-line-clamp :text="text" :lines="2" style="color: var(--theme-primary)"/>',
    props: {
      text: {
        default: text('text', 'this sentence can take up to 2 lines, try to resize this window and see what happens. A few more words to make sure it is long enough'),
      },
    },
  }))
  .add('custom truncate', () => ({
    components: { DaLineClamp },
    template: '<da-line-clamp :text="text" :lines="1" :truncate="truncate" style="color: var(--theme-primary)"/>',
    props: {
      text: {
        default: text('text', 'custom truncate function which on overflow calculates the hidden words'),
      },
    },
    methods: {
      truncate(text, maxLength) {
        const value = this.text.trim().split(' ');
        if (!value) {
          return '';
        }

        const words = [];
        let len = 0;
        for (let i = 0; i < value.length; i += 1) {
          if (len + value[i].length < maxLength) {
            len += value[i].length + 2;
            words.push(value[i]);
          }
        }

        const suffix = words.length < value.length ? ` +${value.length - words.length}` : '';
        const str = words.join(' ');
        return `${str}${suffix}`;
      },
    },
  }));

