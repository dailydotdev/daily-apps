export const testAction = (action, payload, state, expectedMutations) =>
  new Promise((resolve, reject) => {
    let count = 0;
    // mock commit
    const commit = (type, payload) => {
      const mutation = expectedMutations[count];

      try {
        expect(type).toEqual(mutation.type);
        if (payload) {
          expect(payload).toEqual(mutation.payload);
        }
      } catch (error) {
        return reject(error);
      }

      count++;
      if (count >= expectedMutations.length) {
        return resolve();
      }
    };

    // call the action with mocked store and arguments
    action({ commit, state }, payload);

    // check if no mutations should have been dispatched
    if (expectedMutations.length === 0) {
      expect(count).toEqual(0);
      return resolve();
    }
  });
