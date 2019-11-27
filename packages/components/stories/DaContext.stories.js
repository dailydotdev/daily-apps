import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import DaContext from '../src/components/DaContext.vue';

storiesOf('DaContext', module)
  .add('default', () => ({
    components: { DaContext },
    template: `
    <div>
      <button class="btn-icon" title="Open context menu" @click="openMenu">
        <svgicon name="menu"/>
      </button>
      <DaContext ref="context">
        <button class="btn btn-menu" @click="broken">Broken link</button>
        <button class="btn btn-menu" @click="nsfw">Report NSFW</button>
      </DaContext>
    </div>
    `,
    methods: {
      openMenu(event) {
        this.$refs.context.open(event);
      },
      broken: action('broken'),
      nsfw: action('nsfw'),
    },
  }));

