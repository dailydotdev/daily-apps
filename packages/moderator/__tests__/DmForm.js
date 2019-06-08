import { createLocalVue, shallowMount } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DmForm from '../src/components/DmForm.vue';

const localVue = createLocalVue();

localVue.use(svgicon);

it('should emit "menu" when clicking on menu', () => {
  const wrapper = shallowMount(DmForm, { localVue });
  wrapper.find('.form__header__menu').trigger('click');
  expect(wrapper.emitted().menu.length).toEqual(1);
});

it('should emit "submit" when clicking on approve', () => {
  const wrapper = shallowMount(DmForm, { localVue });
  wrapper.find('.form__header__approve').trigger('click');
  expect(wrapper.emitted().submit[0]).toEqual([]);
});
