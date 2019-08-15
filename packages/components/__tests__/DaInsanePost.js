import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DaLineClamp from '../src/components/DaLineClamp.vue';
import DaInsanePost from '../src/components/DaInsanePost.vue';
import posts from '../src/posts';

const localVue = createLocalVue();

localVue.use(svgicon);
localVue.component('da-line-clamp', DaLineClamp);

it('should emit click event', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaInsanePost, { propsData: { post } });
  wrapper.find('.insane__link').trigger('click');
  expect(wrapper.emitted().click[0]).toEqual([post]);
});

it('should emit bookmark event on click', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaInsanePost, { propsData: { post } });
  wrapper.find('.insane__reveal__bookmark').trigger('click');
  expect(wrapper.emitted().bookmark[0]).toEqual([{ post, bookmarked: true }]);
});

it('should emit menu event on click', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaInsanePost, { propsData: { post } });
  wrapper.find('.insane__reveal__menu').trigger('click');
  expect(wrapper.emitted().menu[0][0].post).toEqual(post);
});

it('should set bookmark button title', () => {
  const post = posts[0];
  const wrapper = shallowMount(DaInsanePost, { propsData: { post } });
  expect(wrapper.find('.insane__reveal__bookmark').element.title)
    .toEqual('Bookmark');
});

it('should set bookmark button title when bookmarked', () => {
  const post = posts[1];
  const wrapper = shallowMount(DaInsanePost, { propsData: { post } });
  expect(wrapper.find('.insane__reveal__bookmark').element.title)
    .toEqual('Remove bookmark');
});

it('should set bookmarked class when bookmarked', () => {
  const post = posts[1];
  const wrapper = shallowMount(DaInsanePost, { propsData: { post } });
  expect(wrapper.find('.insane--post').element.classList.contains('bookmarked'))
    .toEqual(true);
});

it('should set tags', () => {
  const post = posts[1];
  const wrapper = mount(DaInsanePost, { localVue, propsData: { post } });
  expect(wrapper.find('.insane__tags span').element.innerHTML)
    .toEqual('#javascript,#webdev,#html,#html5');
});
