import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import tooltip from '../src/directives/tooltip';
import DaLineClamp from '../src/components/DaLineClamp.vue';
import DaCard from '../src/components/DaCard.vue';
import DaCardPost from '../src/components/DaCardPost.vue';
import posts from '../src/posts';

const localVue = createLocalVue();

localVue.use(svgicon);
localVue.directive('tooltip', tooltip);
localVue.component('da-line-clamp', DaLineClamp);
localVue.component('da-card', DaCard);

it('should emit bookmark event on click', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaCardPost, { localVue, propsData: { post } });
  wrapper.find('.card__footer__bookmark').trigger('click');
  expect(wrapper.emitted().bookmark[0]).toEqual([{ post, bookmarked: true }]);
});

it('should emit menu event on click', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaCardPost, { localVue, propsData: { post } });
  wrapper.find('.card__footer__menu').trigger('click');
  expect(wrapper.emitted().menu[0][0].post).toEqual(post);
});

it('should set bookmarked class when bookmarked', () => {
  const post = posts[1];
  const wrapper = shallowMount(DaCardPost, { localVue, propsData: { post } });
  expect(wrapper.element.classList.contains('bookmarked')).toEqual(true);
});

it('should set tags', () => {
  const post = posts[1];
  const wrapper = mount(DaCardPost, { localVue, propsData: { post } });
  expect(wrapper.find('.card__tags span').element.innerHTML)
    .toEqual('#javascript,#webdev,#html,#html5');
});

it('should show notification', () => {
  const post = posts[1];
  const wrapper = shallowMount(DaCardPost, { localVue, propsData: { post } });

  jest.useFakeTimers();

  wrapper.vm.notify('Hello World');
  expect(wrapper.vm.notifying).toEqual(true);
  expect(wrapper.vm.notification).toEqual('Hello World');

  jest.runAllTimers();
  expect(wrapper.vm.notifying).toEqual(false);
});

it('should emit publication event on click', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaCardPost, { localVue, propsData: { post } });
  wrapper.find('.card__footer__publication').trigger('click');
  expect(wrapper.emitted().publication[0]).toEqual([{ pub: post.publication }]);
});
