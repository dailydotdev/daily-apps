import { shallowMount } from '@vue/test-utils';
import DaRadioItem from '../src/components/DaRadioItem.vue';

it('should emit toggle event on click', () => {
  const wrapper = shallowMount(DaRadioItem,
    { propsData: { name: 'test' } });
  wrapper.trigger('click');
  expect(wrapper.emitted().toggle[0]).toEqual([true]);
});
