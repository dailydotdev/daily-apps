<template>
  <da-modal class="rank-modal" :close-on-click="false" @close="$emit('close')">
    <div class="rank-modal__progress-container">
      <da-rank-progress :rank="readingRank.rank" :progress="readingRank.progress"
                        :enable-hover="false" :fill-by-default="true"/>
    </div>
    <header class="lil2">Your weekly goal</header>
    <div class="text micro2">Read content you love to stay updated</div>
    <ul class="rank-modal__ranks-list">
      <li v-for="rank in ranks" :key="rank.rank" class="ranks-list__item"
          :class="{ active: rank.rank === readingRank }">
        <da-rank :rank="rank.rank" :color-by-rank="rank.rank <= readingRank"/>
        <div class="ranks-list__items__description">
          <header class="lil2">{{rank.name}} level</header>
          <div class="text micro2">Read at least 1 article on {{rank.steps}} different days</div>
        </div>
      </li>
    </ul>
    <button class="btn btn-big btn-invert rank-modal__confirm"
            @click="onConfirm">Ok, let’s do it</button>
  </da-modal>
</template>

<script>
import { mapState } from 'vuex';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaRank from '@daily/components/src/components/DaRank.vue';
import DaRankProgress from '@daily/components/src/components/DaRankProgress.vue';
import { ranksMetadata } from '@daily/components/src/common/rank';

export default {
  name: 'DaRankPopup',

  components: {
    DaModal,
    DaRank,
    DaRankProgress,
  },

  data() {
    return {
      ranks: ranksMetadata,
    };
  },

  computed: {
    ...mapState('user', ['readingRank']),
  },

  methods: {
    onConfirm() {
      this.$emit('close');
    },
  },
};
</script>

<style>
.rank-modal {
  align-items: flex-start;

  & .modal__container {
    position: relative;
    width: 480px;
    margin-top: 56px;
    padding: 64px 20px 40px;
    border: 1px solid var(--theme-active);
    overflow: visible;

    & header {
      margin: 0;
      color: var(--theme-primary);
    }

    & .text {
      margin-top: 8px;
      color: var(--theme-secondary);
    }
  }
}

.rank-modal__confirm {
  width: 204px;
  justify-content: center;
}

.rank-modal__ranks-list {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  margin: 32px 0;
  padding: 0;
  list-style: none;

  & .ranks-list__item {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    border-radius: 16px;

    & .rank {
      width: 48px;
      height: 48px;
      margin-right: 16px;

      --stop-color1: var(--theme-active);
      --stop-color2: var(--theme-active);
    }

    & .ranks-list__items__description {
      display: flex;
      flex-direction: column;

      & .text {
        margin-top: 2px;
      }
    }

    &.active {
      background: var(--theme-light);
      box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.24);
    }
  }
}

.rank-modal__progress-container {
  position: absolute;
  display: flex;
  left: 0;
  right: 0;
  top: 0;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background: var(--theme-light);
  border-radius: 100%;
  transform: translateY(-50%);
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.24);
  z-index: 1;
}
</style>
