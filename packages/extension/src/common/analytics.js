import mixpanel from 'mixpanel-browser';
import { version } from './config';
import { browserName } from './browser';
import { setCache, getCache, ANALYTICS_ID_KEY } from './cache';

const getGAUserIdOrGenerate = () => {
  const GA_COOKIE = document.cookie.replace(
    /(?:(?:^|.*;)\s*_ga\s*=\s*(?:\w+\.\d\.)([^;]*).*$)|^.*$/, '$1',
  );
  return GA_COOKIE || (Math.random() * (2 ** 52));
};

mixpanel.init(process.env.VUE_APP_MIXPANEL);
mixpanel.register({
  version,
  platform: browserName,
  source: 'extension',
});

const mixpanelTrack = mixpanel.track.bind(mixpanel);

const mixpanelQueue = [];
mixpanel.track = (...args) => {
  mixpanelQueue.push(args);
};

const queue = [];

const initialize = async () => {
  if (window.location.protocol.indexOf('moz-extension') > -1) {
    const getOrGenerateAnalyticsId = async () => {
      const id = await getCache(ANALYTICS_ID_KEY);
      if (id) {
        return id;
      }

      const newId = getGAUserIdOrGenerate();
      setCache(ANALYTICS_ID_KEY, newId);
      return newId;
    };

    let page;
    let userId;

    const id = await getOrGenerateAnalyticsId();
    const getMessage = (action, type, ...args) => {
      if (action !== 'send') return null;

      let prefix = `v=1&tid=${process.env.VUE_APP_GA}&cid=${id}&aip=1&dp=${page}`;
      if (userId) {
        prefix += `${prefix}&uid=${userId}`;
      }
      if (type === 'event') {
        return `${prefix}&t=event&ec=${encodeURIComponent(args[0])}&ea=${encodeURIComponent(args[1])}&el=${encodeURIComponent(args[2])}`;
      }
      if (type === 'pageview') {
        return `${prefix}&t=pageview`;
      }
      if (type === 'timing') {
        return `${prefix}&t=timing&utc=${encodeURIComponent(args[0])}&utv=${encodeURIComponent(args[1])}&utt=${encodeURIComponent(args[2])}`;
      }
      if (type === 'exception') {
        return `${prefix}&t=exception&exd=${encodeURIComponent(args[0].exDescription)}&exf=${args[0].exFatal ? 1 : 0}`;
      }

      return null;
    };

    window.ga = (action, type, ...args) => {
      if (action === 'set') {
        if (type === 'page') {
          page = encodeURIComponent(args[0]);
        } else if (type === 'userId') {
          userId = encodeURIComponent(args[0]);
        }
        return;
      }

      const request = new XMLHttpRequest();
      const message = getMessage(action, type, ...args);
      if (message) {
        request.withCredentials = true;
        request.open('POST', 'https://www.google-analytics.com/collect', true);
        request.send(message);
      }
    };

    queue.forEach(args => window.ga(...args));
  } else {
    /* eslint-disable */
    (function (i, s, o, g, r, a, m) {
      a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
    /* eslint-enable */
  }

  mixpanelQueue.forEach(args => mixpanelTrack(...args));
  mixpanel.track = mixpanelTrack;
};

if (window.location.protocol.indexOf('moz-extension') > -1) {
  window.ga = (...args) => queue.push(args);
} else {
  /* eslint-disable */
  (function (i, s, o, g, r) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
  /* eslint-enable */

  ga('create', process.env.VUE_APP_GA, 'auto');
  ga('set', 'checkProtocolTask', () => {
  });
  ga('require', 'displayfeatures');
}

export default function (consent, userId) {
  if (consent) {
    if (userId) {
      ga('set', 'userId', userId);
      mixpanel.identify(userId);
    }

    return initialize();
  }

  window.ga = () => {
  };
  mixpanel.track = () => {
  };
  return Promise.resolve();
}
