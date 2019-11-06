import { createLocalVue, shallowMount } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DaSwitch from '../src/components/DaSwitch.vue';

const localVue = createLocalVue();
localVue.use(svgicon);

it('should emit toggle event on click', (done) => {
  const wrapper = shallowMount(DaSwitch, { localVue, propsData: { icon: 'bookmark' } });
  wrapper.trigger('click');
  wrapper.find('.switch__handle').trigger('transitionend');
  wrapper.find('.switch__handle').trigger('transitionend');
  setTimeout(() => {
    expect(wrapper.emitted().toggle[0]).toEqual([true]);
    done();
  }, 100);
});
