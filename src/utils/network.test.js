import {
  updateNetworkBelief,
  updateNetworkProperty,
  updateSelectedNodesId,
} from './network';

describe('Network Utils', () => {
  describe('updateNetworkBelief', () => {
    const currentBelief = {
      'Node 1': 'True',
      'Node 2': 'False',
    };

    describe('When is adding belief', () => {
      it('adds belief', () => {
        expect(updateNetworkBelief('Node 3', 'True', currentBelief)).toEqual({
          'Node 1': 'True',
          'Node 2': 'False',
          'Node 3': 'True',
        });
      });
    });

    describe('When is updating belief', () => {
      it('updates belief', () => {
        expect(updateNetworkBelief('Node 1', 'False', currentBelief)).toEqual({
          'Node 1': 'False',
          'Node 2': 'False',
        });
      });
    });

    describe('When is removing belief', () => {
      it('updates belief', () => {
        expect(updateNetworkBelief('Node 2', null, currentBelief)).toEqual({
          'Node 1': 'True',
        });
      });
    });
  });

  describe('updateNetworkProperty', () => {
    describe('When name matchs with target prop', () => {
      const payload = {
        name: 'description',
        value: 'new value',
      };

      it('returns new value from payload', () => {
        expect(updateNetworkProperty('description', 'current value', { payload })).toBe('new value');
      });
    });

    describe('When name does not match with target prop', () => {
      const payload = {
        name: 'validProp',
        value: 'new value',
      };

      it('return current value', () => {
        expect(updateNetworkProperty('description', 'current value', { payload })).toBe('current value');
      });
    });
  });

  describe('updateSelectedNodesId', () => {
    const payload = {
      id: 'Node 2',
      nextId: 'Node 3',
    };

    it('updates array with new node id', () => {
      expect(updateSelectedNodesId({ payload }, ['Node 1', 'Node 2'])).toEqual([
        'Node 1',
        'Node 3',
      ]);
    });
  });
});
