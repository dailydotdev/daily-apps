import mdyDateFilter from '../src/common/mdyDateFilter';

const now = new Date();

it('should return "now" when less than a minute', () => {
  const expected = 'now';
  const date = new Date(now.getTime() - 1000 * 31);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});

it('should return time ago in minutes when less than an hour', () => {
  const expected = '7m ago';
  const date = new Date(now.getTime() - 1000 * 60 * 7);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});

it('should return time ago in hours when less than 48 hours', () => {
  const expected = '14h ago';
  const date = new Date(now.getTime() - 1000 * 60 * 60 * 14);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});

it('should return formatted date when more than 48 hours', () => {
  const expected = 'Oct 04, 2019';
  const date = new Date(2019, 9, 4);
  const actual = mdyDateFilter(date.toISOString(), now);
  expect(actual).toEqual(expected);
});
