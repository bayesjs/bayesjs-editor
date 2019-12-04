import {
  CHANGE_NETWORK_PROPERTY,
  CHANGE_NODE_ID,
  REMOVE_NODE,
  LOAD_NETWORK,
  NEW_NETWORK,
} from 'actions';
import reducer from './selectedNodes';


describe('Network SelectedNodes Reducer', () => {
  describe('DEFAULT', () => {
    it('returns an empty array', () => {
      expect(reducer(undefined, {})).toEqual([]);
    });
  });

  describe('REMOVE_NODE', () => {
    it('returns an empty array', () => {
      expect(reducer(undefined, { type: REMOVE_NODE })).toEqual([]);
    });
  });

  describe('LOAD_NETWORK', () => {
    it('returns an empty array', () => {
      expect(reducer(undefined, { type: LOAD_NETWORK })).toEqual([]);
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns an empty array', () => {
      expect(reducer(undefined, { type: NEW_NETWORK })).toEqual([]);
    });
  });

  describe('CHANGE_NODE_ID', () => {
    it('updates node name', () => {
      expect(
        reducer(
          ['Node 1', 'Node 2'],
          {
            type: CHANGE_NODE_ID,
            payload: { id: 'Node 1', nextId: 'Node 10' },
          },
        ),
      ).toEqual(['Node 10', 'Node 2']);
    });
  });

  describe('CHANGE_NETWORK_PROPERTY', () => {
    describe('When property name is "selectedNodes"', () => {
      it('returns new value', () => {
        expect(
          reducer(
            [],
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'selectedNodes', value: ['Node 1'] },
            },
          ),
        ).toEqual(['Node 1']);
      });
    });

    describe('When property name is not "selectedNodes"', () => {
      it('returns current state value', () => {
        expect(
          reducer(
            [],
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'other', value: ['Node 1'] },
            },
          ),
        ).toEqual([]);
      });
    });
  });
});
