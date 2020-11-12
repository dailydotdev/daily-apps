import { subDays, isSameDay } from 'date-fns';

// Time spans in milliseconds, used for comparing dates.
const oneMinute = 60000;

export default (value, now = new Date()) => {
  const date = new Date(value);

  // Calculate time delta in milliseconds.
  const dt = now - date;

  if (dt <= oneMinute) return 'Now';

  if (isSameDay(date, now)) {
    return 'Today';
  }

  if (isSameDay(date, subDays(now, 1))) return 'Yesterday';

  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};
