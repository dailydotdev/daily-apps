import { mount } from '@vue/test-utils';
import DaDndMessage from '../src/components/DaDndMessage.vue';

it('should emit "dndOff" on dnd-mode link click', () => {
  const wrapper = mount(DaDndMessage);
  wrapper.find('.dnd-message-bar button').trigger('click');
  expect(wrapper.emitted().dndOff).toBeTruthy();
});
