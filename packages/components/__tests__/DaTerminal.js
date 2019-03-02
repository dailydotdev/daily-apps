import { shallowMount } from '@vue/test-utils';
import DaTerminal from '../src/components/DaTerminal.vue';

it('should emit close event on click', () => {
  const wrapper = shallowMount(DaTerminal);
  wrapper.find('.close').trigger('click');
  expect(wrapper.emitted().close[0]).toEqual([]);
});
