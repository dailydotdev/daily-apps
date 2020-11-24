import Vue from 'vue';
import {storiesOf} from '@storybook/vue';
import {
  withKnobs,
  text,
  select,
  boolean, number,
} from '@storybook/addon-knobs';

import DaCardPost from '../src/components/DaCardPost.vue';
import posts from '../src/posts.json';
import mdyDateFilter from '../src/common/mdyDateFilter';

Vue.filter('mdyDate', mdyDateFilter);

storiesOf('DaCardPost', module)
  .addDecorator(withKnobs)
  .add('select post', () => ({
    components: {DaCardPost},
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
  .add('fully customized', () => ({
    components: {DaCardPost},
    template: '<da-card-post :post="post" :show-menu="showMenu" :menu-opened="menuOpened" :bookmarks-menu-opened="bookmarksMenuOpened" :show-comment-popup="showCommentPopup"/>',
    props: {
      title: {
        default: text('title', posts[0].title),
      },
      image: {
        default: text('image', posts[0].image),
      },
      trending: {
        default: number('trending', 0),
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
      bookmarksMenuOpened: {
        default: boolean('bookmarks menu opened', false),
      },
      read: {
        default: boolean('read', posts[0].read),
      },
      hasComments: {
        default: boolean('hasComments', false),
      },
      upvoted: {
        default: boolean('upvoted', false),
      },
      commented: {
        default: boolean('commented', false),
      },
      showCommentPopup: {
        default: boolean('show comment popup', false),
      },
    },
    computed: {
      post() {
        return {
          ...posts[0], title: this.title, image: this.image,
          bookmarked: this.bookmarked, read: this.read,
          numComments: this.hasComments, upvoted: this.upvoted,
          commented: this.commented,
          trending: this.trending,
        };
      },
    },
  }));
