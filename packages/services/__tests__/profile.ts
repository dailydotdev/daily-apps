import 'cross-fetch/polyfill';
// @ts-ignore
import nock from 'nock';
import {ProfileServiceImpl, Settings} from '../src';

const baseURL = 'http://localhost:3000';
const service = new ProfileServiceImpl(baseURL);

it('should fetch settings from server', async () => {
  const expected: Settings = {
    appInsaneMode: false,
    enableCardAnimations: true,
    showOnlyNotReadPosts: false,
    insaneMode: true,
    showTopSites: false,
    theme: 'darcula',
    spaciness: 'eco',
    openNewTab: true,
  };

  nock(baseURL)
    .get('/v1/settings')
    .reply(200, expected);

  const actual = await service.fetchSettings();

  expect(actual).toEqual(expected);
});

it('should update settings', async () => {
  const body: Settings = {
    appInsaneMode: false,
    enableCardAnimations: true,
    showOnlyNotReadPosts: true,
    insaneMode: true,
    showTopSites: false,
    theme: 'darcula',
    spaciness: 'eco',
    openNewTab: false,
  };

  nock(baseURL)
    .post('/v1/settings', JSON.stringify(body))
    .reply(204);

  await service.updateSettings(body);
});
