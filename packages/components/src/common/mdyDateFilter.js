// Month abbreviation, Day with leading zeros, Year Filter (Jun 30, 2019)

export default value => new Date(value).toLocaleString('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
});
