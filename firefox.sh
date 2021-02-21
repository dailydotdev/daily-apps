cd /root/app
npx lerna bootstrap
npx lerna run build
cd packages/extension
yarn build:firefox