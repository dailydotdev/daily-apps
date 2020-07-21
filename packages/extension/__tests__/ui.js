import MockDate from 'mockdate';
import { applyTheme } from '@daily/services';
import module from '../src/store/modules/ui';
import { testAction } from './fixtures/helpers';
import { profileService } from '../src/common/services';

jest.mock('../src/common/services', () => ({
  profileService: {
    fetchNotifications: jest.fn(),
  },
}));

jest.mock('@daily/services', () => ({
  applyTheme: jest.fn(),
}));

beforeEach(() => {
  window.ga = jest.fn();
});

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

it('should set show only not read posts in state', () => {
  const state = {};
  module.mutations.setShowOnlyNotReadPosts(state, true);
  expect(state.showOnlyNotReadPosts).toEqual(true);
});

it('should set spaciness in state', () => {
  const state = {};
  module.mutations.setSpaciness(state, 'roomy');
  expect(state.spaciness).toEqual('roomy');
});

it('should set show settings in state', () => {
  const state = {};
  module.mutations.setShowSettings(state, true);
  expect(state.showSettings).toEqual(true);
});

it('should show notifications and set state', () => {
  const now = new Date();
  MockDate.set(now);
  const state = {
    showNotificationBadge: true,
  };
  module.mutations.showNotifications(state);
  MockDate.reset();
  expect(state.lastNotificationTime).toEqual(now);
  expect(state.showNotificationBadge).toEqual(false);
  expect(state.showNotifications).toEqual(true);
});

it('should show notification badge when never seen notification', () => {
  const state = {};
  module.mutations.updateNotificationBadge(state, new Date());
  expect(state.showNotificationBadge).toEqual(true);
});

it('should show notification badge when timestamp is newer than last seen', () => {
  const now = new Date();
  const state = {lastNotificationTime: new Date(now.getTime() - 1000)};
  module.mutations.updateNotificationBadge(state, now);
  expect(state.showNotificationBadge).toEqual(true);
});

it('should not show notification badge when timestamp is older than last seen', () => {
  const now = new Date();
  const state = {lastNotificationTime: now};
  module.mutations.updateNotificationBadge(state, new Date(now.getTime() - 1000));
  expect(state.showNotificationBadge).toEqual(false);
});

it('should not show notification badge when timestamp is undefined', () => {
  const state = {};
  module.mutations.updateNotificationBadge(state, undefined);
  expect(state.showNotificationBadge).toEqual(false);
});

it('should hide notifications and set state', () => {
  const state = {
    showNotifications: true,
  };
  module.mutations.hideNotifications(state);
  expect(state.showNotifications).toEqual(false);
});

it('should reset settings', () => {
  const notifications = [{ timestamp: new Date() }, { timestamp: new Date(Date.now() - 1000) }];
  const state = {
    insaneMode: true,
    showTopSites: true,
    enableCardAnimations: false,
    showOnlyNotReadPosts: true,
    showNotificationBadge: true,
    notifications,
  };
  module.mutations.resetSettings(state);
  expect(state).toEqual({
    insaneMode: false,
    showTopSites: false,
    enableCardAnimations: true,
    showOnlyNotReadPosts: false,
    showNotificationBadge: true,
    notifications,
  });
});

it('should reset everything', async () => {
  await testAction(module.actions.reset,
    undefined,
    {},
    [{ type: 'resetSettings', payload: null }],
    [{ type: 'setTheme', payload: null }]);
});

it('should increment instructionStep', () => {
  const state = {
    instructionsStep: 0,
  };
  module.mutations.nextInstruction(state);
  expect(state.instructionsStep).toEqual(1);
});

it('should set DND mode time in state and DND mode should be true', () => {
  const time = new Date().getTime();
  const state = {};
  module.mutations.setDndModeTime(state, time);
  expect(state.dndModeTime).toEqual(time);
  expect(module.getters.dndMode(state)).toBe(true);
});

it('DND mode should be false when "setDndModeTime" is not yet committed', () => {
  const state = { dndModeTime: null };
  expect(module.getters.dndMode(state)).toBe(false);
});

it('DND mode should be false when "disableDndMode" is committed', () => {
  const state = { dndModeTime: 1566300647 };
  module.mutations.disableDndMode(state);
  expect(module.getters.dndMode(state)).toBe(false);
});

it('should set show dnd menu', () => {
  const state = {};
  module.mutations.setShowDndMenu(state, true);
  expect(state.showDndMenu).toEqual(true);
});

it('should set lastBannerSeen', () => {
  const now = new Date();
  const state = { lastBannerSeen: new Date(0) };
  module.mutations.setLastBannerSeen(state, now);
  expect(state.lastBannerSeen).toEqual(now);
});

it('should set show referral in state', () => {
  const state = {};
  module.mutations.setShowReferral(state, true);
  expect(state.showReferral).toEqual(true);
});

it('should set triggered referral in state', () => {
  const state = {};
  module.mutations.setTriggeredReferral(state, true);
  expect(state.triggeredReferral).toEqual(true);
  expect(state.showReferral).toEqual(true);
});

it('should increase post clicks in state', async () => {
  const state = { postClicks: 0 };
  await testAction(module.actions.trackEngagementWin, {action: 'POST_CLICK'}, state, []);
  expect(state).toEqual({ postClicks: 1 });
});

it('should trigger referral due to post click', async () => {
  const state = { postClicks: 9 };
  await testAction(module.actions.trackEngagementWin, {action: 'POST_CLICK'}, state, [
    { type: 'setTriggeredReferral', payload: true },
  ]);
});

it('should increase bookmarks in state', async () => {
  const state = { bookmarks: 0 };
  await testAction(module.actions.trackEngagementWin, {action: 'BOOKMARK'}, state, []);
  expect(state).toEqual({ bookmarks: 1 });
});

it('should trigger referral due to bookmark', async () => {
  const state = { bookmarks: 9 };
  await testAction(module.actions.trackEngagementWin, {action: 'BOOKMARK'}, state, [
    { type: 'setTriggeredReferral', payload: true },
  ]);
});

it('should increase scrolls in state', async () => {
  const state = { scrolls: 0 };
  await testAction(module.actions.trackEngagementWin, {action: 'SCROLL'}, state, []);
  expect(state).toEqual({ scrolls: 1 });
});

it('should trigger referral due to scroll', async () => {
  const state = { scrolls: 29 };
  await testAction(module.actions.trackEngagementWin, {action: 'SCROLL'}, state, [
    { type: 'setTriggeredReferral', payload: true },
  ]);
});
