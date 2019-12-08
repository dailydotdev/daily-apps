import module from '../src/store/modules/user';
import { authService, contentService } from '../src/common/services';
import { testAction } from './fixtures/helpers';

jest.mock('../src/common/services', () => ({
  authService: {
    authenticate: jest.fn(),
    generateChallenge: jest.fn(),
  },
  contentService: {
    setIsLoggedIn: jest.fn(),
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
  const state = {
    profile: null, challenge: {
      verifier: 'verifier',
      challenge: 'challenge',
    },
  };
  await testAction(
    module.actions.authenticate,
    { code: '12345' },
    state,
    [{ type: 'setProfile', payload: profile }],
  );
  expect(authService.authenticate).toBeCalledWith('12345', 'verifier');
  expect(contentService.setIsLoggedIn).toBeCalledWith(true);
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
