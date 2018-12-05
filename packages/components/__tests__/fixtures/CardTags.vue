<template>
  <div>{{tags | cardTags}}</div>
</template>

<script>
export default {
  name: 'CardTags',
  props: {
    tags: {
      type: Array,
      required: true,
    },
  },
};
</script>
