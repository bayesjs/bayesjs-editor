import { NETWORK_KINDS } from '../constants/network';
import {
  NEW_NETWORK,
  LOAD_NETWORK,
  CHANGE_NETWORK_PROPERTY,
  ADD_NODE,
  newNetwork,
  loadNetwork,
  changeNetworkProperty,
  addNode,
} from './index';

describe('index file tests', () => {
  it('newNetwork ', () => {
    expect(newNetwork).toBeInstanceOf(Function);
    newNetwork((ret) => {
      expect(ret.type).toEqual(NEW_NETWORK);
      expect(ret.kind).toEqual(NETWORK_KINDS.BN);
    });
  });

  it('loadNetwork', () => {
    const state = { value: '1' };
    expect(loadNetwork).toBeInstanceOf(Function);
    loadNetwork(state, (ret) => {
      expect(ret.type).toEqual(LOAD_NETWORK);
      expect(ret.payload).toEqual({
        value: '1',
      });
    });
  });

  it('changeNetworkProperty', () => {
    const params = { name: 'test', value: 'test' };
    expect(changeNetworkProperty).toBeInstanceOf(Function);
    changeNetworkProperty(params, (ret) => {
      expect(ret.type).toEqual(CHANGE_NETWORK_PROPERTY);
      expect(ret.payload).toEqual(params);
    });
  });

  it('addNode', () => {
    const params = { id: 123, states: { a: 'a', b: 'b' }, position: 1 };
    expect(addNode).toBeInstanceOf(Function);
    addNode(params, (ret) => {
      expect(ret.type).toEqual(ADD_NODE);
      expect(ret.payload).toEqual(params);
    });
  });
});
