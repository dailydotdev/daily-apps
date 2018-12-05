<template>
  <div>{{text | cardTitle}}</div>
</template>

<script>
export default {
  name: 'CardTitle',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>
