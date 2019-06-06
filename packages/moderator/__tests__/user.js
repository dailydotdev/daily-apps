import module from '../src/store/modules/user';
import { authService, contentService } from '../src/common/services';
import { testAction } from './fixtures/helpers';

jest.mock('../src/common/services', () => ({
  authService: {
    authenticate: jest.fn(),
    refreshToken: jest.fn(),
  },
  contentService: {
    setAccessToken: jest.fn(),
  },
}));

it('should set profile in state', () => {
  const state = { profile: null };
  const expected = { name: 'John', image: 'http://image.com' };
  module.mutations.setProfile(state, expected);
  expect(state.profile).toEqual(expected);
});

it('should authenticate user and set profile', async () => {
  const profile = {
    name: 'John',
    image: 'http://image.com',
    accessToken: 'hello',
  };
  authService.authenticate.mockReturnValue(profile);
  const state = { profile: null };
  await testAction(
    module.actions.authenticate,
    { provider: 'google', code: '12345' },
    state,
    [{ type: 'setProfile', payload: profile }],
  );
  expect(authService.authenticate).toBeCalledWith('google', '12345');
  expect(contentService.setAccessToken).toBeCalledWith('hello');
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
      payload: { accessToken: token.token, expiresIn: token.expiresIn },
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
