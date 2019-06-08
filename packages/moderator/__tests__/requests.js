import module from '../src/store/modules/requests';
import { contentService } from '../src/common/services';
import { testAction } from './fixtures/helpers';

jest.mock('../src/common/services', () => ({
  contentService: {
    fetchOpenPubRequests: jest.fn(),
    editPubRequest: jest.fn(),
    approvePubRequest: jest.fn(),
    declinePubRequest: jest.fn(),
  },
}));

it('should get pending requests', () => {
  const state = {
    openRequests:
      [{ id: 1, url: 'https://dailynow.co', approved: null },
        { id: 2, url: 'https://go.dailynow.co', approved: true }],
  };
  const actual = module.getters.pendingRequests(state);
  expect(actual).toEqual([state.openRequests[0]]);
});

it('should get approved requests', () => {
  const state = {
    openRequests:
      [{ id: 1, url: 'https://dailynow.co' },
        { id: 2, url: 'https://go.dailynow.co', approved: true }],
  };
  const actual = module.getters.approvedRequests(state);
  expect(actual).toEqual([state.openRequests[1]]);
});

it('should set open requests in state', () => {
  const state = { openRequests: [] };
  const expected = [{ id: 1, url: 'https://dailynow.co' }, { id: 2, url: 'https://go.dailynow.co' }];
  module.mutations.setOpenRequests(state, expected);
  expect(state.openRequests).toEqual(expected);
});

it('should fetch open requests from server and update state', async () => {
  const requests = [{ id: 1, url: 'https://dailynow.co' }, { id: 2, url: 'https://go.dailynow.co' }];
  contentService.fetchOpenPubRequests.mockReturnValue(requests);
  const state = { openRequests: [] };
  await testAction(
    module.actions.fetchOpenRequests,
    null,
    state,
    [{ type: 'setOpenRequests', payload: requests }],
  );

  expect(contentService.fetchOpenPubRequests).toBeCalledTimes(1);
});

it('should edit request in state', () => {
  const state = {
    openRequests:
      [{ id: 1, url: 'https://dailynow.co' },
        { id: 2, url: 'https://go.dailynow.co' }],
  };
  const expected = [{ id: 1, url: 'https://dailynow.co' },
    { id: 2, url: 'https://go.dailynow.co', pubId: 'go' }];
  module.mutations.editOpenRequest(state, { index: 1, edit: { pubId: 'go' } });
  expect(state.openRequests).toEqual(expected);
});

it('should edit the request and send request to server', async () => {
  const state = {
    openRequests:
      [{ id: 1, url: 'https://dailynow.co' },
        { id: 2, url: 'https://go.dailynow.co' }],
  };
  contentService.editPubRequest.mockReturnValue(Promise.resolve());
  await testAction(
    module.actions.editOpenRequest,
    { id: 2, edit: { pubId: 'go' } },
    state,
    [{ type: 'editOpenRequest', payload: { index: 1, edit: { pubId: 'go' } } }],
  );

  expect(contentService.editPubRequest).toBeCalledWith(2, { pubId: 'go' });
});

it('should revert edit when request failed', async () => {
  const state = {
    openRequests:
      [{ id: 1, url: 'https://dailynow.co' },
        { id: 2, url: 'https://go.dailynow.co' }],
  };
  contentService.editPubRequest.mockReturnValue(Promise.reject());
  await testAction(
    module.actions.editOpenRequest,
    { id: 2, edit: { pubId: 'go' } },
    state,
    [{ type: 'editOpenRequest', payload: { index: 1, edit: { pubId: 'go' } } },
      {
        type: 'editOpenRequest', payload: {
          index: 1, edit: { id: 2, url: 'https://go.dailynow.co' },
        },
      }],
  );

  expect(contentService.editPubRequest).toBeCalledWith(2, { pubId: 'go' });
});

it('should approve the request and send request to server', async () => {
  const state = {
    openRequests:
      [{ id: 1, url: 'https://dailynow.co' },
        { id: 2, url: 'https://go.dailynow.co' }],
  };
  contentService.approvePubRequest.mockReturnValue(Promise.resolve());
  await testAction(
    module.actions.approveOpenRequest,
    { id: 2 },
    state,
    [{ type: 'editOpenRequest', payload: { index: 1, edit: { approved: true } } }],
  );

  expect(contentService.approvePubRequest).toBeCalledWith(2);
});

it('should revert approve when request failed', async () => {
  const state = {
    openRequests:
      [{ id: 1, url: 'https://dailynow.co' },
        { id: 2, url: 'https://go.dailynow.co' }],
  };
  contentService.approvePubRequest.mockReturnValue(Promise.reject());
  await testAction(
    module.actions.approveOpenRequest,
    { id: 2 },
    state,
    [{ type: 'editOpenRequest', payload: { index: 1, edit: { approved: true } } },
      {
        type: 'editOpenRequest', payload: {
          index: 1, edit: { id: 2, url: 'https://go.dailynow.co' },
        },
      }],
  );

  expect(contentService.approvePubRequest).toBeCalledWith(2);
});

it('should remove request from state', () => {
  const state = {
    openRequests:
      [{ id: 1, url: 'https://dailynow.co' },
        { id: 2, url: 'https://go.dailynow.co' }],
  };
  const expected = [{ id: 1, url: 'https://dailynow.co' }];
  module.mutations.removeOpenRequest(state, 1);
  expect(state.openRequests).toEqual(expected);
});

it('should remove request from state', () => {
  const state = {
    openRequests:
      [{ id: 2, url: 'https://go.dailynow.co' }],
  };
  const expected = [{ id: 1, url: 'https://dailynow.co' },
    { id: 2, url: 'https://go.dailynow.co' }];
  module.mutations.addOpenRequestToIndex(state, { index: 0, request: expected[0] });
  expect(state.openRequests).toEqual(expected);
});

it('should decline the request and send request to server', async () => {
  const state = {
    openRequests:
      [{ id: 1, url: 'https://dailynow.co' },
        { id: 2, url: 'https://go.dailynow.co' }],
  };
  contentService.declinePubRequest.mockReturnValue(Promise.resolve());
  await testAction(
    module.actions.declineOpenRequest,
    { id: 1, reason: 'exists' },
    state,
    [{ type: 'removeOpenRequest', payload: 0 }],
  );

  expect(contentService.declinePubRequest).toBeCalledWith(1, 'exists');
});

it('should revert decline when request failed', async () => {
  const state = {
    openRequests:
      [{ id: 1, url: 'https://dailynow.co' },
        { id: 2, url: 'https://go.dailynow.co' }],
  };
  contentService.declinePubRequest.mockReturnValue(Promise.reject());
  await testAction(
    module.actions.declineOpenRequest,
    { id: 1, reason: 'exists' },
    state,
    [{ type: 'removeOpenRequest', payload: 0 },
      {
        type: 'addOpenRequestToIndex', payload: {
          index: 0, request: { id: 1, url: 'https://dailynow.co' },
        },
      }],
  );

  expect(contentService.declinePubRequest).toBeCalledWith(1, 'exists');
});
