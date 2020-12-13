import {startOfToday, subDays} from 'date-fns';
import module from '../src/store/modules/user';
import {authService} from '../src/common/services';
import {setCache, ANALYTICS_ID_KEY} from '../src/common/cache';
import {testAction} from './fixtures/helpers';
import {apolloClient} from "../src/apollo";
import {USER_READING_RANK_QUERY} from "../src/graphql/home";

const userReadingRankHandler = jest.fn();
apolloClient.setRequestHandler(USER_READING_RANK_QUERY, userReadingRankHandler);

jest.mock('../src/apollo');

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
  jest.clearAllMocks();

  window.ga = () => {
  };

  window.location.reload = () => {
  };
});

it('should set profile in state', () => {
  const state = {profile: null};
  const expected = {name: 'John', image: 'http://image.com'};
  module.mutations.setProfile(state, expected);
  expect(state.profile).toEqual(expected);
});

it('should set newUser to false in state', () => {
  const state = {profile: {newUser: true}};
  const expected = {profile: {newUser: false}};
  module.mutations.confirmNewUser(state);
  expect(state).toEqual(expected);
});

it('should logout and reset all preferences', async () => {
  authService.getUserProfile.mockReturnValue(Promise.resolve({id: '1'}));
  const state = {profile: null};
  await testAction(
    module.actions.logout,
    null,
    state,
    [{type: 'reset'}],
    [{type: 'ui/reset', payload: null}, {type: 'feed/reset', payload: null}],
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
  const state = {profile: {id: '1', providers: ['github']}};
  authService.getUserProfile.mockReturnValue(Promise.resolve({
    id: '2',
    providers: ['github'],
    infoConfirmed: true
  }));
  await testAction(
    module.actions.validateAuth,
    null,
    state,
    [],
    [{type: 'login', payload: {id: '2', providers: ['github'], infoConfirmed: true}}],
  );
});

it('should logout if not logged in anymore', async () => {
  const state = {profile: {id: '1', providers: ['github']}};
  authService.getUserProfile.mockReturnValue(Promise.resolve({id: '2'}));
  await testAction(
    module.actions.validateAuth,
    null,
    state,
    [],
    [{type: 'logout', payload: null}],
  );
});

it('should mark user as logged-in', async () => {
  const profile = {
    name: 'John',
    image: 'http://image.com',
    infoConfirmed: true,
  };
  const state = {profile: null};
  await testAction(
    module.actions.login,
    profile,
    state,
    [{type: 'setProfile', payload: profile}],
  );
});

it('should mark user as premium', () => {
  const state = {profile: {premium: true}};
  const actual = module.getters.isPremium(state);
  expect(actual).toEqual(true);
});

it('should mark user as not premium', () => {
  const state = {profile: {}};
  const actual = module.getters.isPremium(state);
  expect(actual).toEqual(false);
});

it('should reset state', () => {
  const state = {profile: {}, readingRank: {rank: 1, progress: 2}}
  module.mutations.reset(state);
  expect(state).toMatchSnapshot();
});

it('should increment reading progress', () => {
  const now = new Date();
  const state = {readingRank: {rank: 1, progress: 2}};
  module.mutations.incrementReadingProgress(state, now);
  expect(state).toEqual({
    lastRead: now,
    readingRank: {rank: 1, progress: 3},
  });
});

it('should increment progress if the user never read', async () => {
  const state = {profile: null, readingRank: {rank: 0, progress: 0}, lastRead: null};
  await testAction(
    module.actions.updateRankProgress,
    null,
    state,
    [{type: 'incrementReadingProgress'}],
    [{type: 'checkWeeklyReadingRankReset'}],
  );
});

it('should increment progress when reading on a new day', async () => {
  const state = {
    profile: null,
    readingRank: {rank: 0, progress: 0},
    lastRead: subDays(new Date(), 1)
  };
  await testAction(
    module.actions.updateRankProgress,
    null,
    state,
    [{type: 'incrementReadingProgress'}],
    [{type: 'checkWeeklyReadingRankReset'}],
  );
});

it('should not increment progress when reading on the same day', async () => {
  const state = {profile: null, readingRank: {rank: 0, progress: 0}, lastRead: new Date()};
  await testAction(
    module.actions.updateRankProgress,
    null,
    state,
    [],
  );
});

it('should increment reading progress and level up rank', () => {
  const now = new Date();
  const state = {readingRank: {rank: 0, progress: 2}};
  module.mutations.incrementReadingProgress(state, now);
  expect(state).toEqual({
    lastRead: now,
    readingRank: {rank: 0, progress: 3, nextRank: 1},
    readingRankLevelUp: true,
  });
});

it('should update shown reading progress', () => {
  const state = {readingRank: {rank: 1, progress: 2, shownProgress: 0}};
  module.mutations.updateShownProgress(state);
  expect(state).toEqual({
    readingRank: {rank: 1, progress: 2, shownProgress: 2},
  });
});

it('should not update shown reading progress when leveling up', () => {
  const state = {readingRank: {rank: 1, progress: 2, shownProgress: 0}, readingRankLevelUp: true};
  module.mutations.updateShownProgress(state);
  expect(state.readingRank.shownProgress).toEqual(0);
});

it('should fetch reading rank', async () => {
  userReadingRankHandler.mockResolvedValue({
    data: {
      userReadingRank: {
        currentRank: 1,
        progressThisWeek: 3,
        readToday: true
      }
    }
  })
  const state = {profile: {id: '1'}, readingRank: {rank: 0, progress: 0, shownProgress: 0}};
  await testAction(
    module.actions.fetchReadingRank,
    null,
    state,
    [
      {type: 'updateReadingRank', payload: {rank: 1, progress: 3}},
      {type: 'setLastReadToToday'},
    ],
  );
  expect(userReadingRankHandler).toBeCalledWith({id: '1'});
});

it('should fetch reading rank and not set last read', async () => {
  userReadingRankHandler.mockResolvedValue({
    data: {
      userReadingRank: {
        currentRank: 1,
        progressThisWeek: 3,
        readToday: false
      }
    }
  })
  const state = {profile: {id: '1'}, readingRank: {rank: 0, progress: 0, shownProgress: 0}};
  await testAction(
    module.actions.fetchReadingRank,
    null,
    state,
    [
      {type: 'updateReadingRank', payload: {rank: 1, progress: 3}},
    ],
  );
  expect(userReadingRankHandler).toBeCalledWith({id: '1'});
});

it('should not fetch reading rank when logged-out', async () => {
  userReadingRankHandler.mockResolvedValue({
    data: {
      userReadingRank: {
        currentRank: 1,
        progressThisWeek: 3,
        readToday: true
      }
    }
  })
  const state = {profile: null, readingRank: {rank: 0, progress: 0, shownProgress: 0}};
  await testAction(
    module.actions.fetchReadingRank,
    null,
    state,
    [],
  );
  expect(userReadingRankHandler).toBeCalledTimes(0);
});

it('should update reading rank', () => {
  const state = {readingRank: {rank: 1, progress: 2}};
  module.mutations.updateReadingRank(state, {rank: 1, progress: 4});
  expect(state).toEqual({
    readingRank: {rank: 1, progress: 4},
  });
});

it('should set leveling up when updating rank to a higher one', () => {
  const state = {readingRank: {rank: 1, progress: 2}};
  module.mutations.updateReadingRank(state, {rank: 2, progress: 4});
  expect(state).toEqual({
    readingRank: {rank: 1, progress: 4, nextRank: 2}, readingRankLevelUp: true,
  });
});

it('should update last read to today', () => {
  const state = {lastRead: null};
  module.mutations.setLastReadToToday(state);
  expect(state).toEqual({
    lastRead: startOfToday(),
  });
});

it('should not reset rank if progress is zero', async () => {
  const state = {lastRead: subDays(new Date(), 8), readingRank: {rank: 0, progress: 0}};
  await testAction(
    module.actions.checkWeeklyReadingRankReset,
    null,
    state,
    [],
  );
});

it('should not reset rank if last read is this week', async () => {
  const state = {lastRead: new Date(), readingRank: {rank: 0, progress: 2}};
  await testAction(
    module.actions.checkWeeklyReadingRankReset,
    null,
    state,
    [],
  );
});

it('should not reset rank if logged in', async () => {
  const state = {
    lastRead: subDays(new Date(), 8),
    readingRank: {rank: 0, progress: 2},
    profile: {id: '1'}
  };
  await testAction(
    module.actions.checkWeeklyReadingRankReset,
    null,
    state,
    [],
  );
});

it('should reset rank', async () => {
  const state = {lastRead: subDays(new Date(), 8), readingRank: {rank: 2, progress: 5}};
  await testAction(
    module.actions.checkWeeklyReadingRankReset,
    null,
    state,
    [{type: 'updateReadingRank', payload: {rank: 0, progress: 0}}],
    [{type: 'updateShownProgress'}]
  );
});

it('should finish the level up process', () => {
  const state = {readingRank: {rank: 1, progress: 2, nextRank: 2}, readingRankLevelUp: true};
  module.mutations.confirmedRankLevelUp(state, {rank: 2, progress: 4});
  expect(state).toEqual({
    readingRank: {rank: 2, progress: 2, nextRank: 2, shownProgress: 2}, readingRankLevelUp: false,
  });
});
