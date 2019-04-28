const path = require('path');
const fs = require('fs');
const merge = require('deepmerge');

const TARGET = process.env.TARGET;

const manifest = merge.all([require('../src/manifest/base.json'), require(`../src/manifest/${TARGET || 'development'}.json`)]);
fs.writeFileSync(path.resolve('./src', 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
