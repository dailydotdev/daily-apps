import * as types from './mutation-types';

// eslint-disable-next-line import/prefer-default-export
export const setFoo = ({ commit }, payload) => {
  commit(types.UPDATE_FOO, payload);
};
