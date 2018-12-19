<template>
  <div class="demo">
    <h1>
      <svgicon icon="logo" class="title__icon"/>
      Daily Components Demo
      <DaIconToggle pressed-icon="moon" icon="sun" class="theme-selector" @toggle="toggleTheme"/>
    </h1>
    <section>
      <h2>Cards</h2>
      <div>
        <h3>Posts</h3>
        <div class="horizontal_container cards">
          <DaCardPost :post="item" v-for="(item, index) in posts" :key="index"/>
        </div>
      </div>
      <div>
        <h3>Ads</h3>
        <div class="horizontal_container cards">
          <DaCardAd :ad="item" v-for="(item, index) in ads" :key="index"/>
        </div>
      </div>
    </section>
    <section>
      <h2>Buttons</h2>
      <div class="vertical_container buttons">
        <div class="horizontal_container">
          <h3>Regular Buttons</h3>
          <button class="btn btn-water-cheese">
            Sign in
          </button>
          <button class="btn btn-hollow">
            <svgicon icon="user_daily"/>
            <span>Sign in</span>
          </button>
          <button class="btn btn-highlight shadow invert">
            <span>Sign in</span>
            <svgicon icon="user_daily"/>
          </button>
        </div>
        <div class="horizontal_container">
          <h3>Big Buttons</h3>
          <button class="btn btn-big btn-hollow">
            No
          </button>
          <button class="btn btn-big btn-highlight shadow invert">
            Yes, I'd love to
          </button>
        </div>
        <div class="horizontal_container">
          <h3>Icon Buttons</h3>
          <button class="btn-icon" title="button">
            <svgicon icon="mobile"/>
          </button>
          <a href="https://www.dailynow.co" target="_blank" title="anchor">
            <svgicon icon="bag"/>
          </a>
        </div>
      </div>
    </section>
    <section>
      <h2>Icons</h2>
      <div class="horizontal_container">
        <div v-for="(item, index) in icons" :key="index" class="icons_container">
          <svgicon :icon="item"/>
          <div class="icons_container__text micro1">{{item}}</div>
        </div>
      </div>
    </section>
    <section>
      <h2>Logos</h2>
      <div class="horizontal_container">
        <div v-for="(item, index) in logos" :key="index" class="icons_container">
          <img :src="`/logos/${item}.svg`"/>
          <div class="icons_container__text micro1">{{item}}</div>
        </div>
      </div>
    </section>
    <section>
      <h2>Switch</h2>
      <div class="vertical_container">
        <DaSwitch icon="bookmark"></DaSwitch>
        <DaSwitch icon="link" label="With label"></DaSwitch>
        <DaSwitch icon="moon" label="Checked" checked></DaSwitch>
      </div>
    </section>
    <section>
      <h2>Icon Toggle</h2>
      <DaIconToggle pressed-icon="sun" icon="moon"/>
    </section>
    <section>
      <h2>Spinner</h2>
      <DaSpinner/>
    </section>
  </div>
</template>

<script>
import DaSwitch from './DaSwitch.vue';
import DaIconToggle from './DaIconToggle.vue';
import DaSpinner from './DaSpinner.vue';
import DaCardPost from './DaCardPost.vue';
import DaCardAd from './DaCardAd.vue';
import posts from '../posts.json';
import ads from '../ads.json';

const requireIcons = require.context('../../icons', false, /.js$/);
const icons = requireIcons.keys().filter(r => r !== './index.js');
icons.forEach(requireIcons);

const logos = require.context('../../logos', false, /.svg$/).keys();

export default {
  name: 'Demo',
  components: {
    DaCardAd,
    DaCardPost,
    DaSpinner,
    DaIconToggle,
    DaSwitch,
  },
  created() {
    this.icons = icons.map(r => r.substr(2, r.length - 5));
    this.logos = logos.map(l => l.substr(2, l.length - 6));
    this.posts = posts;
    this.ads = ads;
  },
  methods: {
    toggleTheme(checked) {
      if (checked) {
        document.documentElement.classList.add('bright');
      } else {
        document.documentElement.classList.remove('bright');
      }
    },
  },
};
</script>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
}

h1 {
  display: flex;
  margin: 16px 0;
  flex-direction: row;
  align-items: center;
  color: var(--theme-primary);
}

.theme-selector {
  margin-left: auto;
}

.title__icon {
  width: 40px;
  height: 40px;
  margin-right: 16px;
  color: var(--theme-primary);
}

section {
  margin: 16px 0;
}

h2 {
  margin: 16px 0;
  color: var(--theme-secondary);
}

h3 {
  color: var(--theme-primary);
}

.vertical_container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: -16px 0;

  & .horizontal_container {
    margin-top: 0;
    margin-bottom: 0;
  }
}

.horizontal_container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin: -16px;
}

.icons_container {
  display: flex;
  width: 110px;
  margin: 16px 0;
  flex-direction: column;
  align-items: center;

  & .svg-icon, & .icon-toggle {
    color: var(--theme-primary);
  }
}

.icons_container__text {
  color: var(--theme-primary);
}

.switch {
  margin: 16px 0;
}

.buttons {
  & button, & a, & h3 {
    margin: 16px;
  }
}

.cards {
  align-items: flex-start;
}

.card {
  width: 282px;
  margin: 16px;
}
</style>
