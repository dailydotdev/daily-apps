import {shallowMount, createLocalVue, mount} from '@vue/test-utils';
import DaRank from '../src/components/DaRank.vue';
import DaRankProgress from '../src/components/DaRankProgress.vue';

const localVue = createLocalVue();

localVue.component('da-rank', DaRank);

it('should create dynamically the progress bar according to the rank', () => {
  const wrapper = shallowMount(DaRankProgress, { localVue, propsData: { rank: 0, progress: 0 } });
  expect(wrapper.findAll('.rank-progress__bar path').length).toEqual(3);
});

it('should set bars as completed according to the progress', () => {
  const wrapper = shallowMount(DaRankProgress, { localVue, propsData: { rank: 0, progress: 2 } });
  expect(wrapper.findAll('.rank-progress__bar path.completed').length).toEqual(2);
});

it('should not have a next level badge when has no rank', () => {
  const wrapper = shallowMount(DaRankProgress, { localVue, propsData: { rank: 0, progress: 0 } });
  expect(wrapper.find('.rank-progress__next').element).toBeFalsy();
});

it('should have a next level badge when has rank', () => {
  const wrapper = shallowMount(DaRankProgress, { localVue, propsData: { rank: 1, progress: 0 } });
  expect(wrapper.find('.rank-progress__next').element).toBeTruthy();
});

it('should not have a next level badge when reached final rank', () => {
  const wrapper = shallowMount(DaRankProgress, { localVue, propsData: { rank: 5, progress: 0 } });
  expect(wrapper.find('.rank-progress__next').element).toBeFalsy();
});

it('should add hover class on mouse over', async () => {
  const wrapper = mount(DaRankProgress, { localVue, propsData: { rank: 1, progress: 1 } });
  wrapper.trigger('mouseover');
  await wrapper.vm.$nextTick();
  expect(wrapper.classes()).toContain('hover');
});
