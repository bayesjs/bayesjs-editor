import {
  CHANGE_NODE_ID,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_NODE,
  UPDATE_NETWORK_SELECTED_NODES,
} from '@actions';

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

  describe('UPDATE_NETWORK_SELECTED_NODES', () => {
    it('returns new value', () => {
      expect(
        reducer(
          [],
          {
            type: UPDATE_NETWORK_SELECTED_NODES,
            payload: { selectedNodes: ['Node 1'] },
          },
        ),
      ).toEqual(['Node 1']);
    });
  });
});
