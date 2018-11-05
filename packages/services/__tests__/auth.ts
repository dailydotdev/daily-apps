import axios from 'axios';
// @ts-ignore
import httpAdapter from 'axios/lib/adapters/http';
// @ts-ignore
import nock from 'nock';
import {AccessToken, AuthServiceImpl, User} from '../src';

axios.defaults.adapter = httpAdapter;

const baseURL = 'http://localhost:3000';

it('should refresh token', async () => {
    const expected: AccessToken = {
        token: 'newtoken',
        expiresIn: new Date(),
    };

    nock(baseURL)
        .post('/v1/auth/refresh', {refreshToken: 'token'})
        .reply(200, Object.assign({}, expected, {expiresIn: expected.expiresIn.toISOString()}));

    const service = new AuthServiceImpl(baseURL);
    const actual = await service.refreshToken('token');

    expect(actual).toEqual(expected);
});

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
        accessToken: 'token',
        expiresIn: new Date(),
        refreshToken: 'refresh',
    };

    nock(baseURL)
        .post('/v1/auth/google/authenticate', {code: 'code'})
        .reply(200, Object.assign({}, expected, {expiresIn: expected.expiresIn.toISOString()}));

    const service = new AuthServiceImpl(baseURL);
    const actual = await service.authenticate('google', 'code');

    expect(actual).toEqual(expected);
});

it('should return authorization url', () => {
    const expected = 'http://localhost:3000/v1/auth/google/authorize?redirect_uri=https://go.dailynow.co?key=var';
    const service = new AuthServiceImpl(baseURL);
    const actual = service.getAuthorizationUrl('google', 'https://go.dailynow.co?key=var');

    expect(actual).toEqual(expected);
});

it('should get user id', async () => {
    const expected: string = 'id';

    nock(baseURL)
        .get('/v1/users/me')
        .reply(200, {id: expected});

    const service = new AuthServiceImpl(baseURL);
    const actual = await service.getUserId();

    expect(actual).toEqual(expected);
});
