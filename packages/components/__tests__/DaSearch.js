import { createLocalVue, mount } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DaSearch from '../src/components/DaSearch.vue';

const localVue = createLocalVue();

localVue.use(svgicon);

const propsData = {
  label: 'Search',
  placeholder: 'Type whatever',
};

it('should set by default placeholder as label', () => {
  const wrapper = mount(DaSearch, { localVue, propsData });
  expect(wrapper.find('input').element.placeholder)
    .toEqual(propsData.label);
});

it('should set placeholder when focused', async () => {
  const wrapper = mount(DaSearch, { localVue, propsData });
  const input = wrapper.find('input');
  input.element.focus();
  await wrapper.vm.$nextTick();
  expect(input.element.placeholder)
    .toEqual(propsData.placeholder);
});

it('should set placeholder as label when focused and no placeholder given', () => {
  const wrapper = mount(DaSearch, {
    localVue, propsData: {
      label: 'Search',
    },
  });
  const input = wrapper.find('input');
  input.element.focus();
  expect(input.element.placeholder)
    .toEqual(propsData.label);
});

it('should emit submit event when form is submitted', () => {
  const wrapper = mount(DaSearch, { localVue, propsData });
  wrapper.find('input').element.value = 'hello';
  wrapper.find('form').trigger('submit');
  expect(wrapper.emitted().submit[0]).toEqual(['hello']);
});

it('should emit input event when input is changed', () => {
  const wrapper = mount(DaSearch, { localVue, propsData });
  wrapper.find('input').element.value = 'hello';
  wrapper.find('input').trigger('input');
  expect(wrapper.emitted().input[0]).toEqual(['hello']);
});

it('should reveal autocomplete dropdown', async () => {
  const newProps = { ...propsData, suggestions: [{ title: 'Opt1' }, { title: 'Opt2' }] };
  const wrapper = mount(DaSearch, { localVue, propsData: newProps });
  wrapper.find('input').element.focus();
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.search__autocomplete').element).toBeTruthy();
});

it('should hide autocomplete dropdown on blur', () => {
  const newProps = { ...propsData, suggestions: [{ title: 'Opt1' }, { title: 'Opt2' }] };
  const wrapper = mount(DaSearch, { localVue, propsData: newProps });
  wrapper.find('input').element.focus();
  wrapper.find('input').element.blur();
  expect(wrapper.find('.search__autocomplete').element).toBeFalsy();
});

it('should cycle through autocomplete suggestions', async () => {
  const newProps = { ...propsData, suggestions: [{ title: 'Opt1' }, { title: 'Opt2' }] };
  const wrapper = mount(DaSearch, { localVue, propsData: newProps });
  wrapper.find('input').element.focus();
  await wrapper.vm.$nextTick();
  wrapper.find('input').trigger('keydown.down');
  await wrapper.vm.$nextTick();
  const selected = wrapper.find('.search__autocomplete .selected');
  expect(selected.element.textContent.trim()).toEqual('Opt1');
  expect(selected.element.getAttribute('aria-selected')).toEqual('true');
});

it('should cycle through autocomplete suggestions in reverse order', async () => {
  const newProps = { ...propsData, suggestions: [{ title: 'Opt1' }, { title: 'Opt2' }] };
  const wrapper = mount(DaSearch, { localVue, propsData: newProps });
  const input = wrapper.find('input');
  input.element.focus();
  await wrapper.vm.$nextTick();
  input.trigger('keydown.up');
  await wrapper.vm.$nextTick();
  const selected = wrapper.find('.search__autocomplete .selected');
  expect(selected.element.textContent.trim()).toEqual('Opt2');
  expect(selected.element.getAttribute('aria-selected')).toEqual('true');
});

it('should revert to original query as the first suggestion', async () => {
  const newProps = { ...propsData, suggestions: [{ title: 'Opt1' }, { title: 'Opt2' }] };
  const wrapper = mount(DaSearch, { localVue, propsData: newProps });
  const input = wrapper.find('input');
  input.element.focus();
  input.element.value = 'text';
  input.trigger('input');
  await wrapper.vm.$nextTick();
  input.trigger('keydown.down');
  await wrapper.vm.$nextTick();
  input.trigger('keydown.up');
  await wrapper.vm.$nextTick();
  expect(wrapper.find('.search__autocomplete .selected').element).toBeFalsy();
  expect(input.element.value).toEqual('text');
});

it('should emit blur event when input is out of focus', () => {
  const wrapper = mount(DaSearch, { localVue, propsData });
  const input = wrapper.find('input');
  input.trigger('focus');
  input.trigger('blur');
  expect(wrapper.emitted().blur[0]).toEqual([]);
});

it('should show the clear button when there is input', async () => {
  const wrapper = mount(DaSearch, { localVue, propsData });
  const input = wrapper.find('input');
  input.element.value = 'test';
  input.trigger('input');
  await wrapper.vm.$nextTick();
  const style = getComputedStyle(wrapper.find('.search__container button').element);
  expect(style.display).toEqual('inline-block');
});

it('should clear input when clicking on clear button', () => {
  const wrapper = mount(DaSearch, { localVue, propsData });
  const input = wrapper.find('input');
  input.element.value = 'test';
  input.trigger('input');
  wrapper.find('.search__container button').trigger('click');
  expect(input.element.value).toEqual('');
});
