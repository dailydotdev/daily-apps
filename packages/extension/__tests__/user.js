import module from '../src/store/modules/user';
import { authService, contentService, profileService } from '../src/common/services';
import { setCache, ANALYTICS_ID_KEY } from '../src/common/cache';
import { testAction } from './fixtures/helpers';

jest.mock('../src/common/services', () => ({
  authService: {
    authenticate: jest.fn(),
    logout: jest.fn(),
    getUserProfile: jest.fn(),
    generateChallenge: jest.fn(),
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

it('should authenticate user and check for bookmarks conflicts', async () => {
  const profile = {
    name: 'John',
    image: 'http://image.com',
  };
  authService.authenticate.mockReturnValue(profile);
  const state = { profile: null, challenge: { verifier: 'verifier' } };
  await testAction(
    module.actions.authenticate,
    { provider: 'google', code: '12345' },
    state,
    [{ type: 'feed/checkBookmarksConflicts', payload: null }],
    [{ type: 'login', payload: profile }],
  );
  expect(authService.authenticate).toBeCalledWith('12345', 'verifier');
});

it('should authenticate user without checking for conflicts', async () => {
  const profile = {
    name: 'John',
    image: 'http://image.com',
    newUser: true,
  };
  authService.authenticate.mockReturnValue(profile);
  const state = { profile: null, challenge: { verifier: 'verifier' } };
  await testAction(
    module.actions.authenticate,
    { provider: 'google', code: '12345' },
    state,
    [],
    [{ type: 'login', payload: profile }],
  );
  expect(authService.authenticate).toBeCalledWith('12345', 'verifier');
});

it('should do nothing when authentication fails', async () => {
  authService.authenticate.mockRejectedValue(null);
  const state = { profile: null };
  await testAction(
    module.actions.authenticate,
    { provider: 'google', code: '12345' },
    state,
    [],
  );
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

it('should set code challenge in state', () => {
  const state = {};
  const expected = { verifier: 'verifier', challenge: 'challenge' };
  module.mutations.setChallenge(state, expected);
  expect(state.challenge).toEqual(expected);
});

it('should generate code challenge', async () => {
  authService.generateChallenge.mockReturnValue(Promise.resolve({
    verifier: 'verifier',
    challenge: 'challenge',
  }));
  const state = {};
  await testAction(
    module.actions.generateChallenge,
    null,
    state,
    [{ type: 'setChallenge', payload: { verifier: 'verifier', challenge: 'challenge' } }],
  );
  expect(authService.generateChallenge).toBeCalled();
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
  authService.getUserProfile.mockReturnValue(Promise.resolve({ id: '2', providers: ['github'] }));
  await testAction(
    module.actions.validateAuth,
    null,
    state,
    [],
    [{ type: 'login', payload: { id: '2', providers: ['github'] } }],
  );
});

it('should keep newUser set when validating auth', async () => {
  const state = { profile: { id: '1', providers: ['github'], newUser: true } };
  authService.getUserProfile.mockReturnValue(Promise.resolve({ id: '1', providers: ['github'] }));
  await testAction(
    module.actions.validateAuth,
    null,
    state,
    [{ type: 'setProfile', payload: { id: '1', providers: ['github'], newUser: true } }],
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