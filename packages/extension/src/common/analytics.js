import amplitude from 'amplitude-js';
import { version } from './config';
import { browserName } from './browser';
import { getCache, ANALYTICS_ID_KEY } from './cache';

if (window.global === undefined) {
  window.global = window;
}

const queue = [];

const initialize = async () => {
  const clientId = await getCache(ANALYTICS_ID_KEY);
  if (window.location.protocol.indexOf('moz-extension') > -1) {
    let page;

    const getMessage = (action, type, ...args) => {
      if (action !== 'send') return null;

      const prefix = `v=1&tid=${process.env.VUE_APP_GA}&cid=${clientId}&aip=1&dp=${page}`;
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
    ga('create', process.env.VUE_APP_GA, { clientId });
    ga('set', 'checkProtocolTask', () => {
    });
    ga('require', 'displayfeatures');
  }

  const ampClient = amplitude.getInstance();
  ampClient.init(process.env.VUE_APP_AMPLITUDE, undefined, {
    includeReferrer: true,
    includeUtm: true,
    sameSiteCookie: 'Lax',
    domain: process.env.VUE_APP_AMPLITUDE_DOMAIN,
  });
  ampClient.setVersionName(`extension v${version}`);
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
}

export default function (consent) {
  if (consent) {
    return initialize();
  }

  window.ga = () => {
  };
  return Promise.resolve();
}

export const trackPageView = (page) => {
  const prefix = browserName ? '/extension' : '/';
  const suffix = browserName ? `v=${version}&b=${browserName}` : `v=${version}`;
  ga('set', 'page', `${prefix}${page}?${suffix}`);
  ga('send', 'pageview');
};

export const logRevenue = async (productId) => {
  const revenue = new amplitude.Revenue().setProductId(productId).setPrice(1);
  amplitude.getInstance().logRevenueV2(revenue);
};

export const logReadArticle = (origin) => {
  amplitude.getInstance().logEvent('read article', { origin });
};
