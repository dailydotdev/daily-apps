// eslint-disable-next-line import/prefer-default-export
export const truncateTags = (tags, text, maxLength) => {
  if (!tags) {
    return '';
  }

  const finalTags = [];
  let len = 0;
  for (let i = 0; i < tags.length; i += 1) {
    if (len + tags[i].length < maxLength) {
      len += tags[i].length + 2;
      finalTags.push(tags[i]);
    }
  }

  const suffix = finalTags.length < tags.length ? `,+${tags.length - finalTags.length}` : '';
  const str = finalTags
    .map(tag => `#${tag}`)
    .join(',');
  return `${str}${suffix}`;
};
