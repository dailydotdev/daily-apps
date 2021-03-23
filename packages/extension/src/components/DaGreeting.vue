<template>
  <transition name="fade" @after-leave="$emit('hide')">
    <div class="greeting jr long" v-if="show">
      {{ greeting.text }}
      <span v-if="firstName">, {{ firstName }}</span>
      <span class="emoji"> {{ greeting.emoji }}</span>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import { isSameDay } from 'date-fns';

const getGreetingSlot = (hour) => {
  if (hour < 5) {
    return 0;
  }
  if (hour < 12) {
    return 1;
  }
  if (hour < 17) {
    return 2;
  }
  return 3;
};

const getGreetingData = () => {
  const now = new Date();
  const hour = now.getHours();
  const slot = getGreetingSlot(hour);
  if (slot === 0) {
    return { text: 'Good Night', emoji: '🌙' };
  }
  if (slot === 1) {
    return { text: 'Good Morning', emoji: '☀️' };
  }
  if (slot === 2) {
    return { text: 'Good Afternoon', emoji: '️✌️' };
  }
  return { text: 'Good Evening', emoji: '✨️' };
};

export default {
  name: 'DaGreeting',

  data() {
    return {
      greeting: getGreetingData(),
      show: false,
    };
  },

  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState('ui', ['lastGreeting']),
    ...mapState({
      firstName(state) {
        if (this.isLoggedIn) {
          return state.user.profile.name.split(' ')[0];
        }

        return null;
      },
    }),
  },

  methods: {
    ...mapMutations({
      setLastGreeting: 'ui/setLastGreeting',
    }),
  },

  mounted() {
    setTimeout(() => {
      const now = new Date();
      const showGreeting = !this.lastGreeting
        || !isSameDay(now, this.lastGreeting)
        || getGreetingSlot(this.lastGreeting.getHours())
        !== getGreetingSlot(now.getHours());
      if (!showGreeting) {
        return;
      }
      this.setLastGreeting(now);
      this.$emit('show');
      setTimeout(() => {
        this.show = true;
        setTimeout(() => {
          this.show = false;
        }, 7000);
      }, 500);
    }, 3000);
  },
};
</script>

<style scoped>
.greeting {
  margin-left: 8px;
  font-weight: bold;
  font-style: normal;
  font-size: 15px;
  color: var(--theme-primary);
}

.emoji {
  font-family: system-ui, -apple-system, sans-serif, Apple Color Emoji, Segoe UI Emoji;
}
</style>
