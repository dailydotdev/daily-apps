<template>
  <div class="layout-preview" :class="[spaciness, insaneMode ? 'insane-mode' : 'card-mode']">
    <div class="layout-preview__top-sites">
      <div v-for="i in topSites" :key="i" class="layout-preview__top-site"
           :class="{'on': showTopSites}"></div>
    </div>
    <div class="layout-preview__posts">
      <div v-for="i in posts" :key="i" class="layout-preview__post"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DaLayoutPreview',
  data() {
    return {
      topSites: 4,
    };
  },
  computed: {
    posts() {
      if (!this.insaneMode) {
        if (this.spaciness === 'roomy' || this.spaciness === 'cozy') {
          return 8;
        }
        return 10;
      }

      if (this.spaciness === 'roomy' || this.spaciness === 'cozy') {
        return 3;
      }

      return 4;
    },

    ...mapState('ui', [
      'showTopSites', 'spaciness', 'insaneMode',
    ]),
  },
};
</script>

<style>
.layout-preview {
  display: flex;
  width: 120px;
  height: 80px;
  flex-direction: column;
  align-items: stretch;
  padding: 12px 12px 0;
  background: var(--theme-background-primary);
  border-radius: 8px;
  box-shadow: var(--theme-shadow-offset) 0 16px 0 rgba(0, 0, 0, 0.1);

  &.card-mode {
    &.roomy {
      padding-left: 20px;
      padding-right: 20px;
    }

    &.cozy {
      padding-left: 15px;
      padding-right: 15px;
    }
  }
}

.layout-preview__top-sites {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0 -1.5px 8px;
}

.layout-preview__top-site {
  width: 6px;
  height: 6px;
  margin: 0 1.5px;
  background: var(--theme-background-secondary);
  border-radius: 100%;

  &.on {
    background: var(--color-water-60);
  }
}

.layout-preview__posts {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: -2px;

  .cozy & {
    margin: -3px;
  }

  .insane-mode & {
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    flex-wrap: nowrap;
  }
}

.layout-preview__post {
  width: 16px;
  height: 16px;
  margin: 2px;
  background: var(--color-water-60);
  border-radius: 4px;

  .card-mode.roomy & {
    width: 17px;
    height: 17px;
  }

  .card-mode.cozy & {
    width: 18px;
    height: 18px;
    margin: 3px;
  }

  .insane-mode & {
    width: 100%;
    height: 8px;
    border-radius: 2px;
  }

  .insane-mode.roomy & {
    height: 10px;
  }

  .insane-mode.cozy & {
    height: 12px;
  }
}
</style>
