import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, array, select, boolean } from '@storybook/addon-knobs';

import DaCardPost from '../src/components/DaCardPost.vue';
import posts from '../src/posts.json';

storiesOf('DaCardPost', module)
  .addDecorator(withKnobs)
  .add('select post', () => ({
    components: { DaCardPost },
    template: '<da-card-post :post="post"/>',
    props: {
      index: {
        default: select('post', posts.map((p, i) => i + 1), 1),
      },
    },
    computed: {
      post() {
        return posts[this.index - 1];
      },
    },
  }))
  .add('animate on hover', () => ({
    components: { DaCardPost },
    template: '<div class="animate-cards"><da-card-post :post="post"/></div>',
    data() {
      return {
        post: posts[1],
      };
    },
  }))
  .add('actions', () => ({
    components: { DaCardPost },
    template: '<da-card-post :post="post" @click="click" @bookmark="bookmark" @menu="menu" @publication="publication"/>',
    data() {
      return {
        post: posts[0],
      };
    },
    methods: {
      click: action('click'),
      bookmark: action('bookmark'),
      menu: action('menu'),
      publication: action('publication'),
    },
  }))
  .add('fully customized', () => ({
    components: { DaCardPost },
    template: '<div :class="{\'animate-cards\': animateCards}"><da-card-post :post="post" :show-menu="showMenu" :menu-opened="menuOpened"/></div>',
    props: {
      title: {
        default: text('title', posts[0].title),
      },
      image: {
        default: text('image', posts[0].image),
      },
      tags: {
        default: array('tags', posts[0].tags),
      },
      size: {
        default: select('size', ['large', 'medium', 'small'], posts[0].size),
      },
      bookmarked: {
        default: boolean('bookmarked', posts[0].bookmarked),
      },
      showMenu: {
        default: boolean('show menu', true),
      },
      menuOpened: {
        default: boolean('menu opened', false),
      },
      animateCards: {
        default: boolean('animate card on hover', false),
      },
    },
    computed: {
      post() {
        return {
          ...posts[0], title: this.title, image: this.image, tags: this.tags, size: this.size,
          bookmarked: this.bookmarked,
        };
      },
    },
  }));

