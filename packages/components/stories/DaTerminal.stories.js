import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import DaTerminal from '../src/components/DaTerminal.vue';

storiesOf('DaTerminal', module)
  .add('default', () => ({
    components: { DaTerminal },
    template: `
    <DaTerminal @close="close">
      <span slot="title">Terminal</span>
      <div slot="content" class="terminal-content">
        <div style="color: var(--color-pepper-10)">Today</div>
        <div style="color: var(--color-salt-10)">Terminal notification</div>
        <a style="color: var(--color-water-50)">Call to action</a>
      </div>
    </DaTerminal>
    `,
    methods: {
      close: action('close'),
    },
  }))
  .add('no cursor', () => ({
    components: { DaTerminal },
    template: `
    <DaTerminal @close="close" :cursor="false">
      <span slot="title">Terminal</span>
      <div slot="content" class="terminal-content">
        <div style="color: var(--color-pepper-10)">Today</div>
        <div style="color: var(--color-salt-10)">Terminal notification</div>
        <a style="color: var(--color-water-50)">Call to action</a>
      </div>
    </DaTerminal>
    `,
    methods: {
      close: action('close'),
    },
  }));

