import { NETWORK_KINDS } from 'constants/network';
import {
  getNetwork,
  getBeliefs,
  getSelectedNodes,
  getSubnetworks,
  getNetworkKind,
  getPanelVisibility,
  getLinkages,
} from './index';


describe('Main Selectors', () => {
  describe('getNetwork selector', () => {
    const network = {};
    const store = { network };
    it('gets network', () => {
      expect(getNetwork(store)).toEqual(network);
    });
  });

  describe('getBeliefs selector', () => {
    const beliefs = [42];
    const network = { beliefs };
    const store = { network };
    it('gets Beliefs', () => {
      expect(getBeliefs(store)).toEqual(beliefs);
    });
  });

  describe('getSelectedNodes selector', () => {
    const selectedNodes = [1, 2, 3];
    const network = { selectedNodes };
    const store = { network };
    it('gets selected nodes', () => {
      expect(getSelectedNodes(store)).toEqual(selectedNodes);
    });
  });

  describe('getSubnetworks selector', () => {
    const subnetworks = [1, 2, 3];
    const network = { subnetworks };
    const store = { network };
    it('gets subnetworks', () => {
      expect(getSubnetworks(store)).toEqual(subnetworks);
    });
  });

  describe('getNetworkKind selector', () => {
    const kind = 42;
    const network = { kind };
    const store = { network };

    it('gets network kind when it exists', () => {
      expect(getNetworkKind(store)).toEqual(kind);
    });

    it('gets default network kind when it not exists', () => {
      expect(getNetworkKind({})).toEqual(NETWORK_KINDS.BN);
    });
  });

  describe('getPanelVisibility selector', () => {
    const propertiesPanelVisible = 42;
    const network = { propertiesPanelVisible };
    const store = { network };
    it('gets panel visibility', () => {
      expect(getPanelVisibility(store)).toEqual(propertiesPanelVisible);
    });
  });

  describe('getLinkages selector', () => {
    const linkages = [1, 2, 3];
    const network = { linkages };
    const store = { network };
    it('gets linkages', () => {
      expect(getLinkages(store)).toEqual(linkages);
    });
  });
});
