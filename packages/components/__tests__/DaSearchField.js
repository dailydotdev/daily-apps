import { createLocalVue, mount } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DaSearchField from '../src/components/DaSearchField.vue';

const localVue = createLocalVue();

localVue.use(svgicon);

const propsData = {
  label: 'Search',
  placeholder: 'Type whatever',
  icon: 'magnifying',
};

it('should set by default placeholder as label', () => {
  const wrapper = mount(DaSearchField, { localVue, propsData });
  expect(wrapper.find('input').element.placeholder)
    .toEqual(propsData.label);
});

it('should set placeholder when focused', () => {
  const wrapper = mount(DaSearchField, { localVue, propsData });
  const input = wrapper.find('input');
  input.element.focus();
  expect(input.element.placeholder)
    .toEqual(propsData.placeholder);
});

it('should set placeholder as label when focused and no placeholder given', () => {
  const wrapper = mount(DaSearchField, {
    localVue, propsData: {
      label: 'Search',
      icon: 'magnifying',
    },
  });
  const input = wrapper.find('input');
  input.element.focus();
  expect(input.element.placeholder)
    .toEqual(propsData.label);
});

it('should show the clear button when there is input', () => {
  const wrapper = mount(DaSearchField, { localVue, propsData });
  const input = wrapper.find('input');
  input.element.value = 'test';
  input.trigger('input');
  const style = getComputedStyle(wrapper.find('button').element);
  expect(style.display).toEqual('inline-block');
});

it('should clear input when clicking on clear button', () => {
  const wrapper = mount(DaSearchField, { localVue, propsData });
  const input = wrapper.find('input');
  input.element.value = 'test';
  input.trigger('input');
  wrapper.find('button').trigger('click');
  expect(input.element.value).toEqual('');
});
