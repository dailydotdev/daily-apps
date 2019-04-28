'use strict';
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs');
const archiver = require('archiver');
const pkg = require('../package');

const spinner = ora('archiving source...');
spinner.start();

const onError = () => {
  console.log(chalk.red('  Archiving failed with errors.\n'));
  process.exit(1);
};

const output = fs.createWriteStream(`./dist-zip/extension-v${pkg.version}-src.zip`);
const archive = archiver('zip', { zlib: { level: 9 } });

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.log(chalk.yellow(`${err}\n`));
  } else {
    onError();
  }
});

archive.on('error', () => {
  onError();
});

output.on('close', () => {
  spinner.stop();
  console.log(chalk.cyan('  Archive complete.\n'));
});

archive.pipe(output);
archive.glob('**/*', {
  dot: true,
  cwd: '../../',
  ignore: [
    '**/*.zip',
    '**/.idea/**',
    '**/node_modules/**',
    '**/dist/**',
    '.git/**',
    '**/components/icons/**',
    '**/services/lib/**',
  ]
});
archive.finalize();
