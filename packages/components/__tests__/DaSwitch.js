import { shallowMount } from '@vue/test-utils';
import DaSwitch from '../src/components/DaSwitch.vue';

it('should emit toggle event on click', (done) => {
  const wrapper = shallowMount(DaSwitch, { propsData: { icon: 'bookmark' } });
  wrapper.trigger('click');
  wrapper.find('.handle').trigger('transitionend');
  setTimeout(() => {
    expect(wrapper.emitted().toggle[0]).toEqual([true]);
    done();
  }, 100);
});
