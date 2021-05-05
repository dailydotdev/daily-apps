import MockDate from 'mockdate';
import { applyTheme } from '@daily/services';
import module from '../src/store/modules/ui';
import { testAction } from './fixtures/helpers';

jest.mock('@daily/services', () => ({
  applyTheme: jest.fn(),
}));

beforeEach(() => {
  window.ga = jest.fn();
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

it('should set show only not read posts in state', () => {
  const state = {};
  module.mutations.setShowOnlyNotReadPosts(state, true);
  expect(state.showOnlyNotReadPosts).toEqual(true);
});

it('should set open links as tabs in state', () => {
  const state = {};
  module.mutations.setOpenNewTab(state, true);
  expect(state.openNewTab).toEqual(true);
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

it('should reset settings', () => {
  const state = {
    insaneMode: true,
    showTopSites: true,
    showOnlyNotReadPosts: true,
    openNewTab: false,
  };
  module.mutations.resetSettings(state);
  expect(state).toEqual({
    insaneMode: false,
    showTopSites: false,
    showOnlyNotReadPosts: false,
    openNewTab: true,
    spaciness: 'eco',
  });
});

it('should reset everything', async () => {
  await testAction(module.actions.reset,
    undefined,
    {},
    [{ type: 'resetSettings', payload: null }],
    [{ type: 'setTheme', payload: null }]);
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

it('should show unlock ui', async () => {
  const state = { minimalUi: true };
  module.mutations.checkFullUi(state);
  expect(state.showUnlockUi).toEqual(true);
});

it('should not show unlock ui when minimal ui is off', async () => {
  const state = { minimalUi: false };
  module.mutations.checkFullUi(state);
  expect(state.showUnlockUi).toBeFalsy();
});

it('should turn off minimal ui', async () => {
  const state = { minimalUi: true, showUnlockUi: true };
  module.mutations.unlockFullUi(state);
  expect(state.showUnlockUi).toBeFalsy();
  expect(state.minimalUi).toBeFalsy();
});

it('should set never show rank modal', async () => {
  const state = { neverShowRankModal: true };
  module.mutations.setNeverShowRankModal(state, false);
  expect(state.neverShowRankModal).toBeFalsy();
});

it('should increment onboarding step with backwards compatibility', async () => {
  const state = { onboarding: true };
  module.mutations.incrementOnboarding(state);
  expect(state.onboarding).toEqual(2);
});

it('should increment onboarding step to users who completed the process already', async () => {
  const state = { onboarding: false };
  module.mutations.incrementOnboarding(state);
  expect(state.onboarding).toEqual(3);
});

it('should increment onboarding step', async () => {
  const state = { onboarding: 1 };
  module.mutations.incrementOnboarding(state);
  expect(state.onboarding).toEqual(2);
});

