import { storiesOf } from '@storybook/vue';
import DaTooltip from '../src/components/DaTooltip.vue';

const wrapperStyle = {
  padding: '30px 90px',
};

storiesOf('DaTooltip', module)
  .add('top', () => ({
    components: {
      DaTooltip,
    },
    data: () => ({
      style: wrapperStyle,
    }),
    template: `
    <div :style="style">
        <da-tooltip placement="top" content="Light Mode">
            <button class="btn-icon"><svgicon icon="sun"/></button>
        </da-tooltip>
    </div>
    `,
  }))
  .add('bottom', () => ({
    components: {
      DaTooltip,
    },
    data: () => ({
      style: wrapperStyle,
    }),
    template: `
    <div :style="style">
        <da-tooltip placement="bottom" content="Light Mode">
            <button class="btn-icon"><svgicon icon="sun"/></button>
        </da-tooltip>
    </div>
    `,
  }))
  .add('left', () => ({
    components: {
      DaTooltip,
    },
    data: () => ({
      style: wrapperStyle,
    }),
    template: `
    <div :style="style">
        <da-tooltip placement="left" content="Light Mode">
            <button class="btn-icon"><svgicon icon="sun"/></button>
        </da-tooltip>
    </div>
    `,
  }))
  .add('right', () => ({
    components: {
      DaTooltip,
    },
    data: () => ({
      style: wrapperStyle,
    }),
    template: `
    <div :style="style">
        <da-tooltip placement="right" content="Light Mode">
            <button class="btn-icon"><svgicon icon="sun"/></button>
        </da-tooltip>
    </div>
    `,
  }));
