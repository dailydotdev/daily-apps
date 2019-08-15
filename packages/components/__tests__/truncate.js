import {truncateTags} from '../src/truncate';

it('should return empty string on empty tags', () => {
  const actual = truncateTags([], 'hello', 10);
  expect(actual).toEqual('');
});

it('should return empty string on no tags', () => {
  const actual = truncateTags(null, '', 10);
  expect(actual).toEqual('');
});

it('should return all tags when max length is big enough', () => {
  const actual = truncateTags(['javascript', 'webdev', 'html', 'html5'], '', 100);
  expect(actual).toEqual('#javascript,#webdev,#html,#html5');
});

it('should return truncate tags when max length is not enough', () => {
  const actual = truncateTags(['javascript', 'webdev', 'html', 'html5'], '', 20);
  expect(actual).toEqual('#javascript,#webdev,+2');
});
