// Month abbreviation, Day with leading zeros, Year Filter (Jun 30, 2019)

// Time spans in milliseconds, used for comparing dates. Month and year variable, thus omitted.
const oneMinute = 60000;
const oneHour = 3600000;
const oneDay = 86400000;
const oneWeek = 604800000;
const fourWeeks = 2419200000;

/**
 * Returns the number of milliseconds of a given date since the start of the year.
 * @param {Date} date
 * @returns {number}
 */
const getYearMs = function getYearMilliseconds(date) {
  return date - new Date(date.getFullYear(), 0, 0);
};

/**
 * Returns whether a given date is yesterday.
 * @param {Date} date
 * @returns {Boolean}
 */
const isYesterday = function dateIsYesterday(date, now = new Date()) {
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

  if (dt <= oneMinute) return 'now';

  if (dt <= oneHour) {
    const numMinutes = Math.round(dt / oneMinute);
    return `${numMinutes} ${numMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  if (dt <= oneDay) {
    const numHours = Math.round(dt / oneHour);
    return `${numHours} ${numHours === 1 ? 'hour' : 'hours'} ago`;
  }

  if (isYesterday(date, now)) return 'yesterday';

  if (dt <= oneWeek) {
    const numDays = Math.round(dt / oneDay);
    return `${numDays} ${numDays === 1 ? 'day' : 'days'} ago`;
  }

  if (
    dt <= fourWeeks
    || (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth())
  ) {
    const numWeeks = Math.round(dt / oneWeek);
    return `${numWeeks} ${numWeeks === 1 ? 'week' : 'weeks'} ago`;
  }

  if (date.getFullYear() === now.getFullYear()) {
    return `this ${date.toLocaleString('en-US', { month: 'short' })}`;
  }
  if (date.getFullYear() === now.getFullYear() - 1 && getYearMs(date) >= getYearMs(now)) {
    return `last ${date.toLocaleString('en-US', { month: 'short' })}`;
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};
