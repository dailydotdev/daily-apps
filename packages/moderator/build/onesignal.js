const path = require('path');
const { writeFileSync } = require('fs');

// Provide OneSignalSDKWorker.js and OneSignalSDKUpdaterWorker.js
const makeSW = (name, scripts) => {
  const workerScript = scripts.map(i => `importScripts('${i}');`).join('\r\n');
  writeFileSync(path.resolve(__dirname, '../dist', name), workerScript, 'utf-8');
};

const importScripts = [
  `/service-worker.js?v=${Date.now()}`,
  'https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js',
];
makeSW('OneSignalSDKWorker.js', importScripts);
makeSW('OneSignalSDKUpdaterWorker.js', importScripts);
