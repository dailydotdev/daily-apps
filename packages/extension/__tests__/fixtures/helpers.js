export const testAction = (action, payload, state, expectedMutations = [],
  expectedActions = [], rootState = {},
  rootGetters = {}) => new Promise((resolve, reject) => {
  let commitCount = 0;
  let dispatchCount = 0;
  // mock commit
  const commit = (type, innerPayload) => {
    const mutation = expectedMutations[commitCount];

    try {
      expect(type).toEqual(mutation.type);
      if (innerPayload) {
        expect(innerPayload).toEqual(mutation.payload);
      }
    } catch (error) {
      reject(error);
      return;
    }

    commitCount += 1;
  };

  const dispatch = (type, innerPayload) => {
    const innerAction = expectedActions[dispatchCount];

    try {
      expect(type).toEqual(innerAction.type);
      if (innerPayload) {
        expect(innerPayload).toEqual(innerAction.payload);
      }
    } catch (error) {
      reject(error);
      return;
    }

    dispatchCount += 1;
  };

  // call the action with mocked store and arguments
  Promise.resolve()
    .then(() => action({
      commit, dispatch, state, rootState, rootGetters,
    }, payload))
    .then((res) => {
      expect(commitCount).toEqual(expectedMutations.length);
      expect(dispatchCount).toEqual(expectedActions.length);
      return resolve(res);
    })
    .catch(reject);
});

export const runAction = (action, payload, state, rootState = {},
  rootGetters = {}) => new Promise((resolve, reject) => {
  const commit = jest.fn();
  const dispatch = jest.fn();
  Promise.resolve()
    .then(() => action({
      commit, dispatch, state, rootState, rootGetters,
    }, payload))
    .then(resolve)
    .catch(reject);
});

export const createDummyEvent = target => ({
  clientX: 0,
  clientY: 0,
  target,
  stopPropagation: jest.fn(),
});
