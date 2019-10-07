// Month abbreviation, Day with leading zeros, Year Filter (Jun 30, 2019)

export default (value, now = new Date()) => {
  const date = new Date(value);
  let dt = (now - date) / (1000 * 60);
  if (dt < 1) {
    return 'now';
  }

  if (dt < 59) {
    return `${Math.round(dt)}m ago`;
  }

  dt /= 60;
  if (dt < 48) {
    return `${Math.round(dt)}h ago`;
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};
