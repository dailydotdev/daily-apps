import { createLocalVue, mount } from '@vue/test-utils';
import icons from '@daily/components/src/icons';
import DaBanner from '../src/components/DaBanner.vue';

const localVue = createLocalVue();
localVue.use(icons);

beforeEach(() => {
  window.ga = jest.fn();
});

it('should emit "close" on button click', () => {
  const wrapper = mount(DaBanner, { localVue });
  wrapper.find('button').trigger('click');
  expect(wrapper.emitted().close).toBeTruthy();
});

it('should call google analytics when title changes', () => {
  mount(DaBanner, { localVue });
  expect(window.ga).toBeCalledTimes(1);
});
