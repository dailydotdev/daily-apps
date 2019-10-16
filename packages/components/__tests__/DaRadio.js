import { createLocalVue, mount } from '@vue/test-utils';
import DaRadioItem from '../src/components/DaRadioItem.vue';
import DaRadio from '../src/components/DaRadio.vue';

const localVue = createLocalVue();
localVue.component('da-radio-item', DaRadioItem);

it('should not check any children', () => {
  const wrapper = mount(DaRadio,
    { propsData: { localVue, name: 'test', options: { opt1: 'Option 1', opt2: 'Option 2' } } });
  const children = wrapper.findAll('.radio-item');
  expect(children.at(0).vm.checked).toEqual(false);
  expect(children.at(1).vm.checked).toEqual(false);
});

it('should check the right children', () => {
  const wrapper = mount(DaRadio,
    {
      propsData: {
        localVue,
        name: 'test',
        options: { opt1: 'Option 1', opt2: 'Option 2' },
        value: 'opt1',
      },
    });
  const children = wrapper.findAll('.radio-item');
  expect(children.at(0).vm.checked).toEqual(true);
  expect(children.at(1).vm.checked).toEqual(false);
});

it('should emit toggle event when children is selected', () => {
  const wrapper = mount(DaRadio,
    { propsData: { localVue, name: 'test', options: { opt1: 'Option 1', opt2: 'Option 2' } } });
  wrapper.findAll('.radio-item').at(0).trigger('click');
  expect(wrapper.emitted().toggle[0]).toEqual(['opt1']);
});
