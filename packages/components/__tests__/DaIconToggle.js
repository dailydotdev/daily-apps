import { createLocalVue, shallowMount } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DaIconToggle from '../src/components/DaIconToggle.vue';

const localVue = createLocalVue();
localVue.use(svgicon);

it('should emit toggle event on click', () => {
  const wrapper = shallowMount(DaIconToggle, { localVue, propsData: { icon: 'moon', pressedIcon: 'sun' } });
  wrapper.trigger('click');
  expect(wrapper.emitted().toggle[0]).toEqual([true]);
});
