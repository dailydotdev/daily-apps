import { createLocalVue, shallowMount } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DmHeader from '../src/components/DmHeader.vue';

const localVue = createLocalVue();

localVue.use(svgicon);

it('should emit "filterToggle" when switch toggle', () => {
  const wrapper = shallowMount(DmHeader, { localVue, propsData: { filterChecked: false } });
  wrapper.find('.header__switch').vm.$emit('toggle');
  expect(wrapper.emitted().filterToggle[0]).toEqual([]);
});
