import { shallowMount, createLocalVue } from '@vue/test-utils';
import VTooltip from 'v-tooltip';
import DaTooltip from '../src/components/DaTooltip.vue';

const localVue = createLocalVue();

localVue.use(VTooltip);

let wrapper;

beforeEach(() => {
  wrapper = shallowMount(DaTooltip, {
    localVue,
    slots: {
      default: ['<div class="slot">test</div>'],
    },
  });
});

it('should render its child component if props are not provided', () => {
  expect(wrapper.find('.tooltip-wrapper')).toBeDefined();
  expect(wrapper.find('.slot').html()).toContain('test');
});
