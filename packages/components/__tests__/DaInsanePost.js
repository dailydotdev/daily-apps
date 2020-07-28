import {shallowMount, mount, createLocalVue} from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import tooltip from '../src/directives/tooltip';
import DaInsanePost from '../src/components/DaInsanePost.vue';
import posts from '../src/posts';
import mdyDateFilter from '../src/common/mdyDateFilter';

const localVue = createLocalVue();

localVue.use(svgicon);
localVue.filter('mdyDate', mdyDateFilter);
localVue.directive('tooltip', tooltip(localVue));

it('should emit click event', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaInsanePost, {localVue, propsData: {post}});
  wrapper.find('.post__link').trigger('click');
  expect(wrapper.emitted().click[0]).toEqual([post]);
});

it('should emit bookmark event on click', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaInsanePost, {localVue, propsData: {post}});
  wrapper.find('.post__bookmark').trigger('click');
  expect(wrapper.emitted().bookmark[0]).toEqual([{
    post,
    bookmarked: true,
    event: expect.anything(),
  }]);
});

it('should emit menu event on click', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaInsanePost, {localVue, propsData: {post}});
  wrapper.find('.post__menu').trigger('click');
  expect(wrapper.emitted().menu[0][0].post).toEqual(post);
});

it('should set bookmarked class when bookmarked', () => {
  const post = posts[1];
  const wrapper = shallowMount(DaInsanePost, {localVue, propsData: {post}});
  expect(wrapper.element.classList.contains('bookmarked')).toEqual(true);
});

it('should set read time', () => {
  const post = posts[1];
  const wrapper = mount(DaInsanePost, {localVue, propsData: {post}});
  expect(wrapper.find('.post__metadata > *:last-child').element.innerHTML)
    .toEqual('2m read time');
});

it('should show publication date with proper formatting', () => {
  const post = posts[1];
  const wrapper = mount(DaInsanePost, {localVue, propsData: {post}});
  expect(wrapper.find('.post__metadata > *:first-child').element.innerHTML)
    .toEqual('Jun 12, 2018');
});

it('should show notification', () => {
  const post = posts[1];
  const wrapper = shallowMount(DaInsanePost, { localVue, propsData: { post } });

  jest.useFakeTimers();

  wrapper.vm.notify('Hello World');
  expect(wrapper.vm.notifying).toEqual(true);
  expect(wrapper.vm.notification).toEqual('Hello World');

  jest.runAllTimers();
  expect(wrapper.vm.notifying).toEqual(false);
});

it('should emit publication event on click', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaInsanePost, {localVue, propsData: {post}});
  wrapper.find('.post__pub').trigger('click');
  expect(wrapper.emitted().publication[0]).toEqual([{pub: post.publication}]);
});

it('should emit upvote event on click', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaInsanePost, { localVue, propsData: { post } });
  wrapper.find('.post__buttons button:first-child').trigger('click');
  expect(wrapper.emitted().upvote[0]).toEqual([{ post, upvoted: true }]);
});
