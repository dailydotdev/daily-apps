import { storiesOf } from '@storybook/vue';
import { withKnobs, select } from '@storybook/addon-knobs';
import Vue from 'vue';
import VTooltip from 'v-tooltip';

Vue.use(VTooltip);

const buttons = {
  gradient: 'btn-water-cheese',
  water: 'btn-water',
  hollow: 'btn-hollow',
  invert: 'btn-invert',
  nav: 'btn-nav',
  menu: 'btn-menu',
};

const themeKnob = () => ({
  props: {
    theme: {
      default: select('button theme', Object.keys(buttons), 'gradient'),
    },
  },
  computed: {
    cls() {
      return buttons[this.theme];
    },
  },
});

storiesOf('Buttons', module)
  .addDecorator(withKnobs)
  .add('regular', () => ({
    template: '<button class="btn" :class="cls">I\'m a button</button>',
    ...themeKnob(),
  }))
  .add('disabled', () => ({
    template: '<button class="btn" :class="cls" disabled>I\'m disabled :(</button>',
    ...themeKnob(),
  }))
  .add('left icon', () => ({
    template: '<button class="btn" :class="cls"><svgicon icon="user_daily"/><span>Icon to the left of me</span></button>',
    ...themeKnob(),
  }))
  .add('right icon', () => ({
    template: '<button class="btn" :class="cls"><span>Icon to the right</span><svgicon icon="user_daily"/></button>',
    ...themeKnob(),
  }))
  .add('big', () => ({
    template: '<button class="btn btn-big" :class="cls">I\'m a big one</button>',
    ...themeKnob(),
  }))
  .add('only icon', () => ({
    template: '<button class="btn-icon"><svgicon icon="mobile"/></button>',
  }))
  .add('only icon with tooltip', () => ({
    data: () => ({
      content: 'Mobile view',
      placement: 'right',
    }),
    template: '<button v-tooltip="{content, placement}" class="btn-icon"><svgicon icon="mobile"/></button>',
  }));
