import { storiesOf } from '@storybook/vue';
import {
  withKnobs,
  boolean,
  number,
  text,
} from '@storybook/addon-knobs';

import DaTextField from '../src/components/DaTextField';

storiesOf('DaTextField', module)
  .addDecorator(withKnobs)
  .add('character limit', () => ({
    components: { DaTextField },
    template: '<da-text-field placeholder="Type your query..." label="Search" :disabled="disabled" :maxlength="maxlength"/>',
    props: {
      disabled: {
        default: boolean('disabled', false),
      },
      maxlength: {
        default: number('character limit', 20),
      },
    }
  }))
  .add('icon with email field', () => ({
    components: { DaTextField },
    template: '<da-text-field placeholder="Fill your email" label="Required Email" icon="user" :hint="hint" :disabled="disabled" required type="email"/>',
    props: {
      hint: {
        default: text('hint', ''),
      },
      disabled: {
        default: boolean('disabled', false),
      },
    }
  }))
  .add('hide label', () => ({
    components: { DaTextField },
    template: '<da-text-field placeholder="Type your query..." label="Search" hide-label/>',
  }));

