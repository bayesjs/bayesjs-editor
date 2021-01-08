import {
  ADD_NODE,
  ADD_SUPER_NODE,
  CHANGE_NODE_ID,
  CHANGE_NODE_POSITION,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_NODE,
} from '@actions';

import reducer from './positions';

const positions = {
  'Node 1': {
    x: 473,
    y: 150,
  },
  'Node 2': {
    x: 148,
    y: 172,
  },
  'Node 3': {
    x: 335,
    y: 315,
  },
};

describe('EditingNodeCpt Reducers', () => {
  describe('DEFAULT', () => {
    it('returns an empty object', () => {
      expect(reducer(undefined, {})).toEqual({});
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns an empty object', () => {
      expect(
        reducer(
          undefined,
          {
            type: NEW_NETWORK,
          },
        ),
      ).toEqual({});
    });
  });

  describe('LOAD_NETWORK', () => {
    it('returns positions from state', () => {
      expect(
        reducer(
          {},
          {
            type: LOAD_NETWORK,
            payload: { state: { positions } },
          },
        ),
      ).toEqual(positions);
    });
  });

  describe('ADD_NODE', () => {
    const id = 'Node 1';
    const position = { x: 10, y: 20 };

    it('adds new position', () => {
      expect(
        reducer(
          {},
          {
            type: ADD_NODE,
            payload: { id, position },
          },
        ),
      ).toEqual({ [id]: position });
    });
  });

  describe('ADD_SUPER_NODE', () => {
    const id = 'Node 1';
    const position = { x: 10, y: 20 };

    it('adds new position', () => {
      expect(
        reducer(
          undefined,
          {
            type: ADD_SUPER_NODE,
            payload: { id, position },
          },
        ),
      ).toEqual({ [id]: position });
    });
  });

  describe('REMOVE_NODE', () => {
    const id = 'Node 1';

    it('removes position', () => {
      expect(
        reducer(
          positions,
          {
            type: REMOVE_NODE,
            payload: { id },
          },
        ),
      ).toEqual({
        'Node 2': {
          x: 148,
          y: 172,
        },
        'Node 3': {
          x: 335,
          y: 315,
        },
      });
    });
  });

  describe('CHANGE_NODE_ID', () => {
    const id = 'Node 1';
    const nextId = 'Node 10';

    it('cahnges position id', () => {
      expect(
        reducer(
          positions,
          {
            type: CHANGE_NODE_ID,
            payload: { id, nextId },
          },
        ),
      ).toEqual({
        [nextId]: {
          x: 473,
          y: 150,
        },
        'Node 2': {
          x: 148,
          y: 172,
        },
        'Node 3': {
          x: 335,
          y: 315,
        },
      });
    });
  });

  describe('CHANGE_NODE_POSITION', () => {
    const id = 'Node 1';
    const x = 500;
    const y = 200;

    it('changes position x and y', () => {
      expect(
        reducer(
          positions,
          {
            type: CHANGE_NODE_POSITION,
            payload: { id, x, y },
          },
        ),
      ).toEqual({
        'Node 1': {
          x,
          y,
        },
        'Node 2': {
          x: 148,
          y: 172,
        },
        'Node 3': {
          x: 335,
          y: 315,
        },
      });
    });
  });
});
