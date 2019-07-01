import { storiesOf } from '@storybook/vue';

import DaEditableText from '../src/components/DaEditableText.vue';

storiesOf('DaEditableText', module)
  .add('default', () => ({
    components: { DaEditableText },
    template: '<da-editable-text icon="link" text="Click on me to edit" placeholder="Waiting for you"/>',
  }))
  .add('reset on submit', () => ({
    components: { DaEditableText },
    template: '<da-editable-text icon="link" text="Value resets on submit" placeholder="Waiting for you" :reset-on-submit="true"/>',
  }))
  .add('value as text', () => ({
    components: { DaEditableText },
    template: '<da-editable-text icon="link" text="Value updates the text" placeholder="Waiting for you" :value-as-text="true"/>',
  }))
  .add('initial value', () => ({
    components: { DaEditableText },
    template: '<da-editable-text icon="link" value="Initial value" placeholder="Waiting for you" :value-as-text="true"/>',
  }))
  .add('required', () => ({
    components: { DaEditableText },
    template: '<da-editable-text icon="link" text="Value is required" placeholder="Waiting for you" :required="true"/>',
  }));

