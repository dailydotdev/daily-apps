import * as types from './mutation-types';

export default {
  [types.UPDATE_FOO](state, payload) {
    // eslint-disable-next-line no-param-reassign
    state.foo = payload;
  },
};
