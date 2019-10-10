import {
  NEW_NETWORK,
} from 'actions';
import reducer from './arrows';

describe('EditingNodeCpt Reducers', () => {
  describe('DEFAULT', () => {
    it('returns an empty array', () => {
      expect(reducer(undefined, {})).toEqual([]);
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns an empty array', () => {
      expect(
        reducer(
          undefined,
          {
            type: NEW_NETWORK,
          },
        ),
      ).toEqual([]);
    });
  });
});
