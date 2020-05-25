import { shallowMount } from '@vue/test-utils';
import DaCard from '../src/components/DaCard.vue';

it('should set card class to large', () => {
  const wrapper = shallowMount(DaCard, {
    propsData: {
      size: 'large',
      title: 'Card Title',
      url: 'https://www.dailynow.co',
      image: 'https://www.dailynow.co',
    },
  });
  expect(wrapper.element.firstChild.classList.contains('large')).toEqual(true);
});

it('should set card class to small', () => {
  const wrapper = shallowMount(DaCard, {
    propsData: {
      size: 'small',
      title: 'Card Title',
      url: 'https://www.dailynow.co',
      image: 'https://www.dailynow.co',
    },
  });
  expect(wrapper.element.firstChild.classList.contains('small')).toEqual(true);
});

it('should emit click event', () => {
  const wrapper = shallowMount(DaCard, {
    propsData: {
      size: 'small',
      title: 'Card Title',
      url: 'https://www.dailynow.co',
      image: 'https://www.dailynow.co',
    },
  });
  wrapper.find('.card__link').trigger('click');
  expect(wrapper.emitted().click[0]).toEqual([]);
});

