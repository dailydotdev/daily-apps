import module from '../src/store/modules/user';
import { authService } from '../src/common/services';
import { setCache, ANALYTICS_ID_KEY } from '../src/common/cache';
import { testAction } from './fixtures/helpers';

jest.mock('../src/common/services', () => ({
  authService: {
    authenticate: jest.fn(),
    logout: jest.fn(),
    getUserProfile: jest.fn(),
  },
  contentService: {
    setIsLoggedIn: jest.fn(),
  },
}));

jest.mock('../src/common/cache', () => ({
  ANALYTICS_ID_KEY: 'analytics',
  setCache: jest.fn(),
}));

beforeEach(() => {
  window.ga = () => {
  };

  window.location.reload = () => {
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

it('should logout and reset all preferences', async () => {
  authService.getUserProfile.mockReturnValue(Promise.resolve({ id: '1' }));
  const state = { profile: null };
  await testAction(
    module.actions.logout,
    null,
    state,
    [{ type: 'setProfile', payload: null }],
    [{ type: 'ui/reset', payload: null }, { type: 'feed/reset', payload: null }],
  );
  expect(setCache).toBeCalledWith(ANALYTICS_ID_KEY, '1');
});

it('should do nothing if not logged in', async () => {
  const state = {};
  await testAction(
    module.actions.validateAuth,
    null,
    state,
  );
});

it('should update profile if still logged in', async () => {
  const state = { profile: { id: '1', providers: ['github'] } };
  authService.getUserProfile.mockReturnValue(Promise.resolve({ id: '2', providers: ['github'], infoConfirmed: true }));
  await testAction(
    module.actions.validateAuth,
    null,
    state,
    [],
    [{ type: 'login', payload: { id: '2', providers: ['github'], infoConfirmed: true } }],
  );
});

it('should logout if not logged in anymore', async () => {
  const state = { profile: { id: '1', providers: ['github'] } };
  authService.getUserProfile.mockReturnValue(Promise.resolve({ id: '2' }));
  await testAction(
    module.actions.validateAuth,
    null,
    state,
    [],
    [{ type: 'logout', payload: null }],
  );
});

it('should mark user as logged-in', async () => {
  const profile = {
    name: 'John',
    image: 'http://image.com',
    infoConfirmed: true,
  };
  const state = { profile: null };
  await testAction(
    module.actions.login,
    profile,
    state,
    [{ type: 'setProfile', payload: profile }],
  );
});

it('should mark user as premium', () => {
  const state = { profile: { premium: true } };
  const actual = module.getters.isPremium(state);
  expect(actual).toEqual(true);
});

it('should mark user as not premium', () => {
  const state = { profile: { } };
  const actual = module.getters.isPremium(state);
  expect(actual).toEqual(false);
});
