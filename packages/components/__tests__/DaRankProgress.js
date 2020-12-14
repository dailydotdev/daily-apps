import {shallowMount, createLocalVue, mount} from '@vue/test-utils';
import DaRank from '../src/components/DaRank.vue';
import DaRankProgress from '../src/components/DaRankProgress.vue';
import DaRadialProgress from '../src/components/DaRadialProgress.vue';

const localVue = createLocalVue();

localVue.component('da-rank', DaRank);
localVue.component('da-radial-progress', DaRadialProgress);

it('should create dynamically the progress bar according to the rank', () => {
  const wrapper = mount(DaRankProgress, {localVue, propsData: {rank: 0, progress: 0}});
  expect(wrapper.findAll('.rank-progress__bar path').length).toEqual(3);
});

it('should set bars as completed according to the progress', () => {
  const wrapper = mount(DaRankProgress, {localVue, propsData: {rank: 0, progress: 2}});
  expect(wrapper.findAll('.rank-progress__bar path.completed').length).toEqual(2);
});

it('should create dynamically the progress bar in the last rank if not completed everything', () => {
  const wrapper = mount(DaRankProgress, {localVue, propsData: {rank: 5, progress: 0}});
  expect(wrapper.findAll('.rank-progress__bar path').length).toEqual(7);
});

it('should create only one bar in the last rank if completed everything', () => {
  const wrapper = mount(DaRankProgress, {localVue, propsData: {rank: 5, progress: 7}});
  expect(wrapper.findAll('.rank-progress__bar path').length).toEqual(1);
});

it('should add hover class on mouse over', async () => {
  const wrapper = mount(DaRankProgress, {localVue, propsData: {rank: 1, progress: 1}});
  wrapper.trigger('mouseover');
  await wrapper.vm.$nextTick();
  expect(wrapper.classes()).toContain('hover');
});
