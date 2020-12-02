import {shallowMount, createLocalVue} from '@vue/test-utils';
import DaRadialProgress from '../src/components/DaRadialProgress.vue';

const localVue = createLocalVue();

it('should create dynamically the progress bar according to the rank', () => {
  const wrapper = shallowMount(DaRadialProgress, { localVue, propsData: { rank: 0, progress: 0 } });
  expect(wrapper.findAll('path').length).toEqual(3);
});

it('should set bars as completed according to the progress', () => {
  const wrapper = shallowMount(DaRadialProgress, { localVue, propsData: { rank: 0, progress: 2 } });
  expect(wrapper.findAll('path.completed').length).toEqual(2);
});

it('should set accessibility attributes', () => {
  const wrapper = shallowMount(DaRadialProgress, { localVue, propsData: { rank: 0, progress: 2 } });
  expect(wrapper.attributes('role')).toEqual('progressbar');
  expect(wrapper.attributes('aria-valuenow')).toEqual('2');
  expect(wrapper.attributes('aria-valuemin')).toEqual('0');
  expect(wrapper.attributes('aria-valuemax')).toEqual('3');
});

