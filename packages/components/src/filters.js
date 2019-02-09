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

  const tags = [];
  let len = 0;
  for (let i = 0; i < value.length; i += 1) {
    if (len + value[i].length < 24) {
      len += value[i].length + 2;
      tags.push(value[i]);
    }
  }

  const suffix = tags.length < value.length ? `,+${value.length - tags.length}` : '';
  const str = tags
    .map(tag => `#${tag}`)
    .join(',');
  return `${str}${suffix}`;
});
