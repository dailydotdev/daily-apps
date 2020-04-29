import mdyDateFilter from '../src/common/mdyDateFilter';

const now = new Date(2020, 5, 1, 12, 0, 0);

it('should return "now" when less than a minute', () => {
  const expected = 'now';
  const date = new Date(2020, 5, 1, 11, 59, 22);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});

it('should return time ago in minutes when less than an hour', () => {
  const expected = '17 minutes ago';
  const date = new Date(2020, 5, 1, 11, 43, 16);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});

it('should return time ago in hours when less than a day', () => {
  const expected = '11 hours ago';
  const date = new Date(2020, 5, 1, 1, 23, 45);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});

it('should return "yesterday" when more than a day but still yesterday', () => {
  const expected = 'yesterday';
  const date = new Date(2020, 4, 31, 6, 36, 46);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});

it('should return time ago in days when less than a week', () => {
  const expected = '4 days ago';
  const date = new Date(2020, 4, 28, 17, 55, 34);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});

it('should return time ago in weeks when less than a month', () => {
  const expected = '3 weeks ago';
  const date = new Date(2020, 4, 13, 12, 34, 56);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});

it('should return "This (month)" when less than a year and same year', () => {
  const expected = 'this Feb';
  const date = new Date(2020, 1, 6, 6, 37, 22);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});

it('should return "Last (month)" when less than a year and last year', () => {
  const expected = 'last Jun';
  const date = new Date(2019, 5, 28, 14, 40, 12);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});

it('should return formatted date when more than one year', () => {
  const expected = 'Oct 04, 2017';
  const date = new Date(2017, 9, 4, 12, 0, 0);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});
