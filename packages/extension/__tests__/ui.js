import module from '../src/store/modules/ui';
import { applyTheme } from '@daily/services';
import { testAction } from './fixtures/helpers';

jest.mock('@daily/services', () => ({
  applyTheme: jest.fn()
}));

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
