import { shallowMount } from '@vue/test-utils';
import DaInsaneAd from '../src/components/DaInsaneAd.vue';
import ads from '../src/ads';

it('should emit impression event', () => {
  const ad = ads[0];
  const wrapper = shallowMount(DaInsaneAd, { propsData: { ad } });
  expect(wrapper.emitted().impression[0]).toEqual([ad]);
});

it('should emit click event', () => {
  const ad = ads[0];
  const wrapper = shallowMount(DaInsaneAd, { propsData: { ad } });
  wrapper.find('.insane__link').trigger('click');
  expect(wrapper.emitted().click[0]).toEqual([ad]);
});

it('should set pixel to an empty array when not defined', () => {
  const ad = ads[0];
  const wrapper = shallowMount(DaInsaneAd, { propsData: { ad } });
  expect(wrapper.vm.pixel).toEqual([]);
});

it('should set promoted to default when company is not defined', () => {
  const ad = ads[0];
  const wrapper = shallowMount(DaInsaneAd, { propsData: { ad } });
  expect(wrapper.vm.promoted).toEqual('/* Promoted */');
});

it('should set promoted', () => {
  const ad = ads[1];
  const wrapper = shallowMount(DaInsaneAd, { propsData: { ad } });
  expect(wrapper.vm.promoted).toEqual('/* Promoted by CodeFund */');
});
