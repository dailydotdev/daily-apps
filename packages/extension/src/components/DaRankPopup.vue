<template>
  <da-modal class="rank-modal border" @close="$emit('close')">
    <div class="rank-modal__progress-container top-icon">
      <da-rank-progress :rank="readingRank.rank" :progress="readingRank.progress"
                        :enable-hover="false" :fill-by-default="true"/>
    </div>
    <header class="lil2">Your weekly goal</header>
    <div class="text micro2">Read content you love to stay updated</div>
    <ul class="rank-modal__ranks-list">
      <li v-for="rank in ranks" :key="rank.rank" class="ranks-list__item"
          :class="{ active: rank.rank === readingRank.rank }">
        <da-rank :rank="rank.rank" :color-by-rank="rank.rank <= readingRank.rank"/>
        <div class="ranks-list__items__description">
          <header class="lil2">{{rank.name}} level</header>
          <div class="text micro2">Read at least 1 article on {{rank.steps}} different days</div>
        </div>
      </li>
    </ul>
    <button class="btn btn-big btn-invert rank-modal__confirm"
            @click="$emit('close')">Ok, let’s do it</button>
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
  }
}

.rank-modal__confirm {
  width: 204px;
}

.rank-modal__ranks-list {

  & .ranks-list__item {
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
  display: flex;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  background: var(--theme-light);
  border-radius: 100%;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.24);
}
</style>
