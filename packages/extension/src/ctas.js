import { browserName } from './common/browser';

const ctas = [{
  text: 'Daily is 100% open source',
  icon: 'github',
  link: 'https://github.com/dailynowco/daily',
  name: 'Github',
  style: {
    color: 'white',
    background: 'black',
  },
}, {
  text: 'Join Daily community',
  icon: 'medium',
  link: 'https://medium.com/daily-now',
  name: 'Medium',
  style: {
    color: 'white',
    background: '#008bff',
  },
}, {
  text: 'Join our Slack',
  logo: 'slack',
  link: 'https://slack.dailynow.co',
  name: 'Slack',
  style: {
    color: '#838886',
    background: 'white',
  },
}, {
  text: 'Follow real-time updates',
  icon: 'twitter',
  link: 'https://twitter.com/dailynowco',
  name: 'Twitter',
  style: {
    color: 'white',
    background: '#00a2f9',
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
