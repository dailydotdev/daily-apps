import { createLocalVue, shallowMount } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DaModeSwitch from '../src/components/DaModeSwitch.vue';

const localVue = createLocalVue();
localVue.use(svgicon);

it('should emit toggle event on click', (done) => {
  const wrapper = shallowMount(DaModeSwitch,
    { localVue, propsData: { firstIcon: 'bookmark', secondIcon: 'bookmark' } });
  wrapper.trigger('click');
  wrapper.find('.mode-switch__handle').trigger('transitionend');
  setTimeout(() => {
    expect(wrapper.emitted().toggle[0]).toEqual([true]);
    done();
  }, 100);
});
