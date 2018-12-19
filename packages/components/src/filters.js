import Vue from 'vue';

Vue.filter('cardTitle', (value) => {
  const maxLength = 102;
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.substr(0, maxLength - 3)}...`;
});

Vue.filter('cardTags', (value) => {
  if (!value) {
    return '';
  }

  const suffix = value.length > 2 ? ` +${value.length - 2}` : '';
  const str = value
    .slice(0, Math.min(2, value.length))
    .map(tag => `#${tag}`)
    .join(',');
  return `${str}${suffix}`;
});
