import { mount } from '@vue/test-utils';
import '../src/filters';
import CardTitle from './fixtures/CardTitle';
import CardTags from './fixtures/CardTags';

describe('card title filter', () => {
  it('should not manipulate titles shorter than 102 chars', () => {
    const wrapper = mount(CardTitle, { propsData: { text: 'short title' } });
    expect(wrapper.text()).toEqual('short title');
  });

  it('should not manipulate titles shorter than 102 chars', () => {
    const wrapper = mount(CardTitle, { propsData: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' } });
    expect(wrapper.text()).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...');
  });
});

describe('card tags filter', () => {
  it('should create an hashtag comma delimited string', () => {
    const wrapper = mount(CardTags, { propsData: { tags: ['webdev', 'frontend'] } });
    expect(wrapper.text()).toEqual('#webdev,#frontend');
  });

  it('should create an hashtag comma delimited string with only two tags', () => {
    const wrapper = mount(CardTags, { propsData: { tags: ['webdev', 'frontend', 'javascript', 'opensource', 'css'] } });
    expect(wrapper.text()).toEqual('#webdev,#frontend,+3');
  });
});
