import { createLocalVue, mount } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DaTextField from '../src/components/DaTextField.vue';

const localVue = createLocalVue();

localVue.use(svgicon);

const propsData = {
  label: 'Search',
  placeholder: 'Type whatever',
};

it('should set by default placeholder as label', () => {
  const wrapper = mount(DaTextField, { localVue, propsData });
  expect(wrapper.find('input').element.placeholder)
    .toEqual(propsData.label);
});

it('should set placeholder when focused and show label', () => {
  const wrapper = mount(DaTextField, { localVue, propsData });
  const input = wrapper.find('input');
  input.element.focus();
  expect(input.element.placeholder)
    .toEqual(propsData.placeholder);
  const style = getComputedStyle(wrapper.find('.text-field__label').element);
  expect(style.display).toEqual('');
});

it('should show label when input is set', () => {
  const wrapper = mount(DaTextField, { localVue, propsData });
  const input = wrapper.find('input');
  input.element.value = 'test';
  input.trigger('input');
  const style = getComputedStyle(wrapper.find('.text-field__label').element);
  expect(style.display).toEqual('');
});

it('should have invalid class when input is not valid', () => {
  const props = { ...propsData, required: true };
  const wrapper = mount(DaTextField, { localVue, propsData: props });
  const input = wrapper.find('input');
  input.trigger('blur');
  expect(wrapper.classes()).toContain('invalid');
});

it('should set aria-live when input is not valid', () => {
  const props = { ...propsData, required: true, hint: 'required field' };
  const wrapper = mount(DaTextField, { localVue, propsData: props });
  expect(wrapper.find('.text-field__hint').attributes()['aria-live']).toBeFalsy();
  const input = wrapper.find('input');
  input.trigger('blur');
  expect(wrapper.find('.text-field__hint').attributes()['aria-live']).toEqual('assertive');
});
