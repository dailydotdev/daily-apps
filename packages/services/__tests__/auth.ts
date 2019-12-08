import axios from 'axios';
// @ts-ignore
import httpAdapter from 'axios/lib/adapters/http';
// @ts-ignore
import nock from 'nock';
import {AuthServiceImpl, User, UserId} from '../src';

axios.defaults.adapter = httpAdapter;

const baseURL = 'http://localhost:3000';

it('should logout', async () => {
    nock(baseURL)
        .post('/v1/users/logout')
        .reply(204);

    const service = new AuthServiceImpl(baseURL);
    await service.logout();

    expect(true).toEqual(true);
});

it('should authenticate', async () => {
    const expected: User = {
        id: 'id',
        providers: ['google'],
        name: 'Ido',
        image: 'https://dailynow.co',
        newUser: false,
    };

    nock(baseURL)
        .post('/v1/auth/authenticate', {code: 'code', code_verifier: 'verifier'})
        .reply(200, expected);

    const service = new AuthServiceImpl(baseURL);
    const actual = await service.authenticate('code', 'verifier');

    expect(actual).toEqual(expected);
});

it('should return authorization url', () => {
    const expected = 'http://localhost:3000/v1/auth/authorize?provider=google&redirect_uri=https://go.dailynow.co?key=var&code_challenge=challenge';
    const service = new AuthServiceImpl(baseURL);
    const actual = service.getAuthorizationUrl('google', 'https://go.dailynow.co?key=var', 'challenge');

    expect(actual).toEqual(expected);
});

it('should get user id', async () => {
    const expected: UserId = {id: 'id'};

    nock(baseURL)
        .get('/v1/users/me')
        .reply(200, expected);

    const service = new AuthServiceImpl(baseURL);
    const actual = await service.getUserProfile();

    expect(actual).toEqual(expected);
});

it('should get user profile', async () => {
    const expected: User = {
        id: 'id',
        providers: ['github'],
        name: 'John',
        image: 'https://image.com',
        newUser: false,
    };

    nock(baseURL)
        .get('/v1/users/me')
        .reply(200, expected);

    const service = new AuthServiceImpl(baseURL);
    const actual = await service.getUserProfile();

    expect(actual).toEqual(expected);
});
