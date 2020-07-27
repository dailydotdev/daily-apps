// Month abbreviation, Day with leading zeros, Year Filter (Jun 30, 2019)

// Time spans in milliseconds, used for comparing dates. Month and year variable, thus omitted.
const oneMinute = 60000;
const oneDay = 86400000;

/**
 * Returns whether a given date is yesterday.
 * @param {Date} date
 * @returns {Boolean}
 */
const isYesterday = (date, now = new Date()) => {
  const dateMs = date.getTime();
  const dateDayMs = dateMs - (dateMs % oneDay);

  const nowMs = now.getTime();
  const nowDayMs = nowMs - (nowMs % oneDay);

  return dateDayMs === nowDayMs - oneDay;
};

export default (value, now = new Date()) => {
  const date = new Date(value);

  // Calculate time delta in milliseconds.
  const dt = now - date;

  if (dt <= oneMinute) return 'Now';

  if (dt <= oneDay) {
    return 'Today';
  }

  if (isYesterday(date, now)) return 'Yesterday';

  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};
