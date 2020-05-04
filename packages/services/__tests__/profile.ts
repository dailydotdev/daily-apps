import axios from 'axios';
// @ts-ignore
import httpAdapter from 'axios/lib/adapters/http';
// @ts-ignore
import nock from 'nock';
import {ProfileServiceImpl, Settings} from '../src';

axios.defaults.adapter = httpAdapter;

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
    };

    nock(baseURL)
        .post('/v1/settings', body)
        .reply(204);

    await service.updateSettings(body);
});

it('should fetch notifications', async () => {
    nock(baseURL)
        .get('/v1/notifications')
        .query({since: '2018-11-28T08:27:45.612Z'})
        .reply(200, [{
            html: '<p>hello</p>',
            timestamp: '2018-11-29T08:27:45.612Z',
        }]);

    const actual = await service.fetchNotifications(new Date('2018-11-28T08:27:45.612Z'));

    expect(actual).toEqual([{
        html: '<p>hello</p>',
        timestamp: new Date('2018-11-29T08:27:45.612Z'),
    }]);
});
