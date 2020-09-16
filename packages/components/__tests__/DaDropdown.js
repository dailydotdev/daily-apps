import { createLocalVue, mount } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DaDropdown from '../src/components/DaDropdown.vue';

const localVue = createLocalVue();

localVue.use(svgicon);

const propsData = {
  placeholder: 'Waiting for you',
  items: [
    { value: '1', text: 'Option A' },
    { value: '2', text: 'Option B' },
    { value: '3', text: 'Option C' }
  ]
};

it('should set placeholder as trigger text', () => {
  const wrapper = mount(DaDropdown, { localVue, propsData });
  expect(wrapper.find('.dropdown__trigger span').element.innerHTML)
    .toEqual(propsData.placeholder);
});

it('should open menu on click', async () => {
  const wrapper = mount(DaDropdown, { localVue, propsData });
  expect(wrapper.find('.dropdown__menu').element).toBeFalsy();
  wrapper.find('.dropdown__trigger').trigger('click');
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.dropdown__menu').element).toBeTruthy();
});

it('should select the menu option', async () => {
  const wrapper = mount(DaDropdown, { localVue, propsData });
  wrapper.find('.dropdown__trigger').trigger('click');
  await wrapper.vm.$nextTick();
  wrapper.findAll('[role="option"]').at(1).trigger('click');
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.dropdown__trigger span').element.innerHTML)
    .toEqual('Option B');
  expect(wrapper.find('.dropdown__menu').element).toBeFalsy();
});
