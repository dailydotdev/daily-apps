import module from '../src/store/modules/user';
import { authService, contentService, profileService } from '../src/common/services';
import { setCache, ANALYTICS_ID_KEY } from '../src/common/cache';
import { testAction } from './fixtures/helpers';

jest.mock('../src/common/services', () => ({
  authService: {
    authenticate: jest.fn(),
    logout: jest.fn(),
    getUserId: jest.fn(),
    refreshToken: jest.fn(),
  },
  profileService: {
    setAccessToken: jest.fn(),
    clearAccessToken: jest.fn(),
  },
  contentService: {
    setAccessToken: jest.fn(),
    clearAccessToken: jest.fn(),
  },
}));

jest.mock('../src/common/cache', () => ({
  ANALYTICS_ID_KEY: 'analytics',
  setCache: jest.fn(),
}));

beforeEach(() => {
    window.ga = () => {
  };
});

it('should set profile in state', () => {
  const state = { profile: null };
  const expected = { name: 'John', image: 'http://image.com' };
  module.mutations.setProfile(state, expected);
  expect(state.profile).toEqual(expected);
});

it('should set newUser to false in state', () => {
  const state = { profile: { newUser: true } };
  const expected = { profile: { newUser: false } };
  module.mutations.confirmNewUser(state);
  expect(state).toEqual(expected);
});

it('should authenticate user and set profile', async () => {
  const profile = {
    name: 'John',
    image: 'http://image.com',
    accessToken: 'hello'
  };
  authService.authenticate.mockReturnValue(profile);
  const state = { profile: null };
  await testAction(
    module.actions.authenticate,
    { provider: 'google', code: '12345' },
    state,
    [{ type: 'setProfile', payload: profile }]
  );
  expect(authService.authenticate).toBeCalledWith('google', '12345');
  expect(profileService.setAccessToken).toBeCalledWith('hello');
  expect(contentService.setAccessToken).toBeCalledWith('hello');
});

it('should do nothing when authentication fails', async () => {
  authService.authenticate.mockRejectedValue(null);
  const state = { profile: null };
  await testAction(
    module.actions.authenticate,
    { provider: 'google', code: '12345' },
    state,
    []
  );
});

it('should logout and reset all preferences', async () => {
  authService.getUserId.mockReturnValue(Promise.resolve('1'));
  const state = { profile: null };
  await testAction(
    module.actions.logout,
    null,
    state,
    [{ type: 'setProfile', payload: null }],
    [{ type: 'ui/reset', payload: null }, { type: 'feed/reset', payload: null }],
  );
  expect(setCache).toBeCalledWith(ANALYTICS_ID_KEY, '1');
  expect(profileService.clearAccessToken).toBeCalledTimes(1);
  expect(contentService.clearAccessToken).toBeCalledTimes(1);
});

it('should not refresh token if user is not logged in', async () => {
  const state = { profile: null };
  await testAction(
    module.actions.refreshToken,
    null,
    state,
  );
});

it('should not refresh token if token is far from expiring', async () => {
  const state = { profile: { expiresIn: new Date(Date.now() + 120 * 60 * 1000) } };
  await testAction(
    module.actions.refreshToken,
    null,
    state,
  );
});

it('should refresh token if token is almost expiring', async () => {
  const token = { token: 'token', expiresIn: new Date() };
  authService.refreshToken.mockReturnValue(Promise.resolve(token));
  const state = { profile: { expiresIn: new Date(Date.now() + 20 * 60 * 1000) } };
  await testAction(
    module.actions.refreshToken,
    null,
    state,
    [{
      type: 'updateToken',
      payload: { accessToken: token.token, expiresIn: token.expiresIn }
    }],
  );
});

it('should update token in state', () => {
  const state = {
    profile: {
      accessToken: 'token', expiresIn: new Date(Date.now() + 20 * 60 * 1000),
    },
  };
  const expected = {
    accessToken: 'token1', expiresIn: new Date(),
  };
  module.mutations.updateToken(state, expected);
  expect(state.profile).toEqual(expected);
});
