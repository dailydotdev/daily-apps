<template>
  <div class="radio">
    <da-radio-item v-for="item in optsArray" :key="item.value" :name="name"
                   :checked="value === item.value"
                   @toggle="toggle($event, item.value)">{{item.text}}
    </da-radio-item>
  </div>
</template>

<script>
import DaRadioItem from './DaRadioItem.vue';

export default {
  name: 'DaRadio',
  components: {
    DaRadioItem,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    value: String,
  },
  data() {
    return {
      checked: null,
    };
  },
  computed: {
    optsArray() {
      return Object.keys(this.options).map(key => ({ value: key, text: this.options[key] }));
    },
  },
  methods: {
    toggle(checked, value) {
      if (checked) {
        this.$emit('toggle', value);
      }
    },
  },
};
</script>

<style>
.radio {
  display: flex;
  flex-direction: column;
  margin: -2px 0;

  & .radio-item {
    margin: 2px 0;
  }
}
</style>
