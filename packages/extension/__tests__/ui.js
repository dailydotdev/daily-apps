import module from '../src/store/modules/ui';
import { applyTheme } from '@daily/services';
import { testAction } from './fixtures/helpers';
import { profileService } from '../src/common/services';

jest.mock('../src/common/services', () => ({
  profileService: {
    fetchNotifications: jest.fn(),
  },
}));

jest.mock('@daily/services', () => ({
  applyTheme: jest.fn()
}));

it('should set onboarding to true in state', () => {
  const state = { onboarding: false };
  module.mutations.doneOnboarding(state);
  expect(state.onboarding).toEqual(true);
});

it('should set theme in state', () => {
  const state = { theme: 'darcula' };
  module.mutations.setTheme(state, 'bright');
  expect(state.theme).toEqual('bright');
});

it('should apply theme and update state', async () => {
  const state = { theme: 'darcula' };
  await testAction(module.actions.setTheme, 'bright', state, [
    { type: 'setTheme', payload: 'bright' },
  ]);
  expect(applyTheme).toBeCalledTimes(1);
});

it('should set insane mode in state', () => {
  const state = {};
  module.mutations.setInsaneMode(state, true);
  expect(state.insaneMode).toEqual(true);
});

it('should set show top sites in state', () => {
  const state = {};
  module.mutations.setShowTopSites(state, true);
  expect(state.showTopSites).toEqual(true);
});

it('should set enable card animation in state', () => {
  const state = {};
  module.mutations.setEnableCardAnimations(state, true);
  expect(state.enableCardAnimations).toEqual(true);
});

it('should show notifications and set state', () => {
  const state = {
    showNotificationBadge: true,
    notifications: [{ timestamp: new Date() }, { timestamp: new Date(Date.now() - 1000) }],
  };
  module.mutations.showNotifications(state);
  expect(state.lastNotificationTime).toEqual(new Date(state.notifications[0].timestamp.getTime() + 1));
  expect(state.showNotificationBadge).toEqual(false);
  expect(state.showNotifications).toEqual(true);
});

it('should hide notifications and set state', () => {
  const state = {
    showNotifications: true,
  };
  module.mutations.hideNotifications(state);
  expect(state.showNotifications).toEqual(false);
});

it('should set notifications and set state', () => {
  const state = {};
  const notifications = [{
    html: '<span>Hello World</span>',
    timestamp: new Date(),
  }];
  module.mutations.setNotifications(state, { notifications });
  expect(state.notifications).toEqual(notifications);
  expect(state.showNotificationBadge).toEqual(true);
});

it('should set notifications and not update badge', () => {
  const state = {};
  const notifications = [{
    html: '<span>Hello World</span>',
    timestamp: new Date(),
  }];
  module.mutations.setNotifications(state, { notifications, since: notifications[0].timestamp });
  expect(state.notifications).toEqual(notifications);
  expect(state.showNotificationBadge).toEqual(false);
});

it('should fetch notifications and update state', async () => {
  const notifications = [{
    html: '<span>Hello World</span>',
    timestamp: new Date(),
  }];
  profileService.fetchNotifications.mockReturnValue(notifications);
  const state = {};
  await testAction(module.actions.fetchNotifications, undefined, state, [
    { type: 'setNotifications', payload: { notifications, since: undefined } },
  ]);
  expect(profileService.fetchNotifications).toBeCalledTimes(1);
});

it('should reset settings', () => {
  const notifications =
    [{ timestamp: new Date() }, { timestamp: new Date(Date.now() - 1000) }];
  const state = {
    insaneMode: true,
    showTopSites: true,
    enableCardAnimations: false,
    showNotificationBadge: true,
    notifications,
  };
  module.mutations.resetSettings(state);
  expect(state).toEqual({
    insaneMode: false,
    showTopSites: false,
    enableCardAnimations: true,
    showNotificationBadge: true,
    notifications,
  });
});

it('should reset everything', async () => {
  await testAction(module.actions.reset,
    undefined,
    {},
    [{ type: 'resetSettings', payload: null }],
    [{ type: 'setTheme', payload: null }],
  );
});
