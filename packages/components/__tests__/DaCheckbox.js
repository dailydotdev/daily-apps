import {createLocalVue, shallowMount} from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DaCheckbox from '../src/components/DaCheckbox.vue';

const localVue = createLocalVue();
localVue.use(svgicon);

it('should emit toggle event on click', () => {
  const wrapper = shallowMount(DaCheckbox,
    { localVue, propsData: { name: 'test' } });
  wrapper.trigger('click');
  expect(wrapper.emitted().toggle[0]).toEqual([true]);
});
