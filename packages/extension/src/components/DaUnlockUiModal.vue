<template>
  <da-modal class="unlock-ui-modal border" @close="$emit('close')">
    <svgicon name="v" class="top-icon"/>
    <h1>You made it!</h1>
    <p>Let’s show you cool stuff we got for you</p>
    <ul class="unlock-ui-modal__perks">
      <li><svgicon name="layout"/><p>Customize your feed’s layout and theme.</p></li>
      <li><svgicon name="bookmark"/><p>Bookmark articles to keep them for later.</p></li>
      <li><svgicon name="timer"/><p>Do Not Disturb for the moments you need focus.</p></li>
    </ul>
    <button class="btn btn-big btn-invert unlock-ui-modal__confirm"
            @click="$emit('close')">Woohoo! Unlock features</button>
  </da-modal>
</template>

<script>
import DaModal from '@daily/components/src/components/DaModal.vue';
import '@daily/components/icons/v';
import '@daily/components/icons/layout';
import '@daily/components/icons/bookmark';
import '@daily/components/icons/timer';

export default {
  name: 'DaUnlockUiModal',

  components: {
    DaModal,
  },
};
</script>

<style>
.unlock-ui-modal .modal__container {
  width: 368px;
  padding: 56px 32px 40px;

  & .top-icon {
    width: 80px;
    height: 80px;
    color: var(--theme-primary);
  }

  & .unlock-ui-modal__confirm {
    width: 260px;
  }

  & .unlock-ui-modal__perks {
    & .svg-icon {
      width: 48px;
      height: 48px;
      margin-right: 16px;
    }

    & p {
      margin: 0;
      text-align: left;
      flex: 1;
    }

    & li {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
