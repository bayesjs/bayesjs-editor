import {
  getBeliefs,
  getLinkages,
  getNetwork,
  getNetworkKind,
  getNodes,
  getPanelVisibility,
  getPositions,
  getSelectedNodes,
  getSubnetworks,
} from './index';

import { NETWORK_KINDS } from '@constants/network';

describe('Main Selectors', () => {
  describe('getNetwork selector', () => {
    const network = {};
    const store = { network };
    it('gets network', () => {
      expect(getNetwork(store)).toEqual(network);
    });
  });

  describe('getNodes selector', () => {
    describe('When state has nodes', () => {
      const nodes = [1, 2, 3];
      const store = { nodes };

      it('gets state nodes', () => {
        expect(getNodes(store)).toEqual(nodes);
      });
    });

    describe('When network has nodes', () => {
      const nodes = [1, 2, 3];
      const network = { nodes };
      const store = { network };

      it('gets network nodes', () => {
        expect(getNodes(store)).toEqual(nodes);
      });
    });

    describe('When network has no nodes', () => {
      const network = { };
      const store = { network };

      it('returns an empty array', () => {
        expect(getNodes(store)).toEqual([]);
      });
    });
  });

  describe('getPositions selector', () => {
    describe('When state has positions', () => {
      const positions = [1, 2, 3];
      const store = { positions };

      it('gets state positions', () => {
        expect(getPositions(store)).toEqual(positions);
      });
    });

    describe('When network has positions', () => {
      const positions = [1, 2, 3];
      const network = { positions };
      const store = { network };

      it('gets network positions', () => {
        expect(getPositions(store)).toEqual(positions);
      });
    });

    describe('When network has no positions', () => {
      const network = { };
      const store = { network };

      it('returns an empty array', () => {
        expect(getPositions(store)).toEqual([]);
      });
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
    describe('When network has subnetworks', () => {
      const subnetworks = [1, 2, 3];
      const network = { subnetworks };
      const store = { network };

      it('gets subnetworks', () => {
        expect(getSubnetworks(store)).toEqual(subnetworks);
      });
    });

    describe('When network has no subnetworks', () => {
      const network = { };
      const store = { network };

      it('returns an empty array', () => {
        expect(getSubnetworks(store)).toEqual([]);
      });
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
    const propertiesPanelVisible = true;
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
