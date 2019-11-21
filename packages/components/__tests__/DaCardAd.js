import { shallowMount } from '@vue/test-utils';
import DaCardAd from '../src/components/DaCardAd.vue';
import ads from '../src/ads';

it('should emit impression event', () => {
  const ad = ads[0];
  const wrapper = shallowMount(DaCardAd, { propsData: { ad } });
  expect(wrapper.emitted().impression[0]).toEqual([ad]);
});

it('should set pixel to an empty array when not defined', () => {
  const ad = ads[0];
  const wrapper = shallowMount(DaCardAd, { propsData: { ad } });
  expect(wrapper.vm.pixel).toEqual([]);
});

it('should set promoted to default when company is not defined', () => {
  const ad = ads[0];
  const wrapper = shallowMount(DaCardAd, { propsData: { ad } });
  expect(wrapper.vm.promoted).toEqual('/* Promoted */');
});

it('should set promoted', () => {
  const ad = ads[1];
  const wrapper = shallowMount(DaCardAd, { propsData: { ad } });
  expect(wrapper.vm.promoted).toEqual('/* Promoted by CodeFund */');
});

it('should set size to small when size is not defined', () => {
  const ad = ads[2];
  const wrapper = shallowMount(DaCardAd, { propsData: { ad } });
  expect(wrapper.vm.size).toEqual('small');
});
