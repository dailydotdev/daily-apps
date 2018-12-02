<template>
  <div class="hello">
    <h1>Daily Components Demo</h1>
    <section>
      <h3>Icons</h3>
      <div class="icons">
        <div v-for="(item, index) in icons" :key="index" class="icons_container">
          <svgicon :icon="item"/>
          <div class="icons_container__text micro1">{{item}}</div>
        </div>
      </div>
    </section>
    <!--<p>-->
    <!--For a guide and recipes on how to configure / customize this project,<br>-->
    <!--check out the-->
    <!--<a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.-->
    <!--</p>-->
    <!--<h3>Installed CLI Plugins</h3>-->
    <!--<ul>-->
    <!--<li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank"-->
    <!--rel="noopener">babel</a></li>-->
    <!--<li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank"-->
    <!--rel="noopener">eslint</a></li>-->
    <!--</ul>-->
    <!--<h3>Essential Links</h3>-->
    <!--<ul>-->
    <!--<li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>-->
    <!--<li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>-->
    <!--<li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>-->
    <!--<li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>-->
    <!--<li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>-->
    <!--</ul>-->
    <!--<h3>Ecosystem</h3>-->
    <!--<ul>-->
    <!--<li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>-->
    <!--<li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>-->
    <!--<li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a>-->
    <!--</li>-->
    <!--<li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>-->
    <!--<li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>-->
    <!--</ul>-->
  </div>
</template>

<script>
import '../../icons/card';

const requireIcons = require.context('../../icons', false, /.js$/);
const icons = requireIcons.keys().filter(r => r !== './index.js');
icons.forEach(requireIcons);

export default {
  name: 'Demo',

  created() {
    this.icons = icons.map(r => r.substr(2, r.length - 5));
  },
};
</script>

<style scoped>
h1 {
  color: var(--color-salt-90);
}

h3 {
  color: var(--color-salt-10);
}

.icons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: -16px;
}

.icons_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px;

  & .svg-icon, & .icon-selector {
    color: var(--color-salt-90);
  }
}

.icons_container__text {
  color: var(--color-salt-90);
}
</style>
