import { storiesOf } from '@storybook/vue';
import { withKnobs, select } from '@storybook/addon-knobs';

const requireIcons = require.context('../icons', false, /.js$/);
const icons = requireIcons.keys()
  .filter(r => r !== './index.js')
  .map(r => r.match(/\.\/(\w+)\.js/)[1]);

storiesOf('icon', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    template: '<svgicon :name="icon" :key="icon"/>',
    props: {
      icon: {
        default: select('icon', icons, icons[0]),
      },
    },
  }));

