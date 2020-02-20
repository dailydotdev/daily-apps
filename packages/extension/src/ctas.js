import { browserName } from './common/browser';

const ctas = [{
  text: 'Daily is 100% open source',
  icon: 'github',
  link: 'https://github.com/dailydotdev/daily',
  name: 'Github',
  style: {
    color: 'white',
    background: 'black',
  },
}, {
  text: 'Follow us on Instagram',
  logo: 'instagram',
  link: 'https://www.instagram.com/dailydotdev/',
  name: 'Instagram',
  style: {
    color: '#838886',
    background: 'white',
  },
}, {
  text: 'Join our Slack',
  logo: 'slack',
  link: 'https://slack.daily.dev',
  name: 'Slack',
  style: {
    color: '#838886',
    background: 'white',
  },
}, {
  text: 'Follow real-time updates',
  icon: 'twitter',
  link: 'https://twitter.com/dailydotdev',
  name: 'Twitter',
  style: {
    color: 'white',
    background: '#00a2f9',
  },
}, {
  text: 'Like us on Facebook',
  icon: 'facebook',
  link: 'https://www.facebook.com/dailydotdev',
  name: 'Facebook',
  style: {
    color: 'white',
    background: '#3B5998',
  },
}];

if (browserName === 'chrome') {
  ctas.push({
    text: 'We need your review :)',
    logo: 'chrome_store',
    link: 'https://chrome.google.com/webstore/detail/daily-discover-web-techno/jlmpjdjjbgclbocgajdjefcidcncaied/reviews',
    name: 'Chrome',
    style: {
      color: '#838886',
      background: 'white',
    },
  });
} else if (browserName === 'firefox') {
  ctas.push({
    text: 'We need your review :)',
    logo: 'firefox',
    link: 'https://addons.mozilla.org/en-US/firefox/addon/daily/reviews/',
    name: 'Firefox',
    style: {
      color: 'white',
      background: '#0e1028',
    },
  });
}

export default ctas;
