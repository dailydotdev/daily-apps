import { shallowMount } from '@vue/test-utils';
import DaIconToggle from '../src/components/DaIconToggle.vue';

it('should emit toggle event on click', () => {
  const wrapper = shallowMount(DaIconToggle, { propsData: { icon: 'moon', pressedIcon: 'sun' } });
  wrapper.trigger('click');
  expect(wrapper.emitted().toggle[0]).toEqual([true]);
});
