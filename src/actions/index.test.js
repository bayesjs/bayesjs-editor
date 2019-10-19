import { NEW_NETWORK, newNetwork } from './index';

describe('Persisting state actions', () => {
  it('newNetwork ', () => {
    expect(newNetwork).toBeInstanceOf(Function);
    newNetwork((ret) => {
      expect(ret.type).toHaveBeenCalledTimes(NEW_NETWORK);
    });
  });
});
