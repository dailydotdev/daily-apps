<template>
  <main>
    <h1>Welcome to your new-tab!</h1>
    <p>
      Daily is the world's leading curated dev news for busy developers,
      delivered directly to your new-tab.
    </p>
    <img svg-inline src="../svg/tab.svg" alt="New tab illustration"
         class="onboarding__tab onboarding__placeholder"/>
    <router-link to="/onboarding/2" class="btn btn-big btn-water-cheese">
      Take me in, c'mon
    </router-link>
  </main>
</template>
<script>
export default {
  name: 'Step1',
};
</script>
<style>
.onboarding__tab {
  height: 293px;
}
</style>
