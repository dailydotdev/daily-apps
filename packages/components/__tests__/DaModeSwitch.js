import { shallowMount } from '@vue/test-utils';
import DaModeSwitch from '../src/components/DaModeSwitch.vue';

it('should emit toggle event on click', (done) => {
  const wrapper = shallowMount(DaModeSwitch,
    { propsData: { firstIcon: 'bookmark', secondIcon: 'bookmark' } });
  wrapper.trigger('click');
  wrapper.find('.mode-switch__handle').trigger('transitionend');
  setTimeout(() => {
    expect(wrapper.emitted().toggle[0]).toEqual([true]);
    done();
  }, 100);
});
