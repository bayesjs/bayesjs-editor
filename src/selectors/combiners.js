import { addNode, infer } from 'bayesjs';
import { any, equals, map } from 'ramda';
import { createKey, createMissingLinkages, mergeNetworks } from '@components/NetworkMSBN/helpers';

import { getNodeSize } from '@utils/node-size';

const weakMap = new WeakMap();

export const combNodesWithPositions = (nodes, positions) => nodes.map(node => ({
  ...node,
  position: positions[node.id],
}));

export const combNodesIsSelected = (nodes, selectedNodes) => nodes.map(node => ({
  ...node,
  isSelected: any(equals(node.id), selectedNodes),
}));

export const combNodesWithSizes = map(node => ({
  ...node,
  size: getNodeSize(node),
}));

export const combNodesAndBeliefs = (nodes, beliefs, infereceEnabled = true) => {
  console.time('INFER');
  let network = {};
  const remainingNodes = [...nodes];
  const results = {};

  while (remainingNodes.length > 0) {
    const nodesToAdd = [];

    for (let i = 0; i < remainingNodes.length; i++) {
      if (remainingNodes[i].parents.every(p => Object.prototype.hasOwnProperty.call(network, p))) {
        nodesToAdd.push(remainingNodes.splice(i, 1)[0]);
      }
    }

    nodesToAdd.forEach((nodeToAdd) => {
      network = addNode(network, nodeToAdd);
    });
  }

  if (!infereceEnabled) { // desativar inferencia
    nodes.forEach((node) => {
      results[node.id] = {};

      node.states.forEach((state) => {
        results[node.id][state] = 0;
      });
    });
  } else {
    nodes.forEach((node) => {
      results[node.id] = {};

      node.states.forEach((state) => {
        results[node.id][state] = infer(
          network,
          { [node.id]: state },
          Object.keys(beliefs).length === 0 ? undefined : beliefs,
        );
      });
    });
  }
  console.timeEnd('INFER');

  return results;
};

const combNetworkMSBN = (subnetworks, linkages) => {
  const links = Object.keys(linkages).map(id => linkages[id]);
  const networks = subnetworks.map(({ id, name, nodes }) => {
    const dictNodes = nodes.reduce((p, node) => {
      p[node.id] = node;
      return p;
    }, {});

    return {
      id,
      name,
      nodes: dictNodes,
    };
  });

  weakMap.set(linkages, links);
  weakMap.set(subnetworks, networks);

  return mergeNetworks(networks, links);
};

export const combNetworkMSBNDescription = map((subnetwork) => {
  const { nodes } = subnetwork;
  const description = `${nodes.length} nodo${nodes.length === 1 ? '' : 's'}`;
  const showDescription = true;

  return {
    ...subnetwork,
    description,
    showDescription,
  };
});

export const combNodesAndBeliefsMSBN = (networks, linkages, beliefs, infereceEnabled) => {
  console.time('MERGE');
  const cachedNetworks = weakMap.get(networks);
  const cachedLinkages = weakMap.get(linkages);
  let cachedMerge;

  if (cachedNetworks === undefined || cachedLinkages === undefined) {
    cachedMerge = combNetworkMSBN(networks, linkages);
  } else {
    cachedMerge = cachedNetworks;
  }
  const { network, identifiers } = cachedMerge;
  weakMap.set(networks, cachedMerge);
  weakMap.set(linkages, cachedMerge);
  console.timeEnd('MERGE');

  const newBeliefs = {};
  const nodes = [];
  const result = {};
  const addResult = (networkId, nodeId, inferResult) => {
    const netDict = result[networkId] || {};
    let nodeDict = netDict[nodeId] || {};
    nodeDict = inferResult;
    netDict[nodeId] = nodeDict;

    result[networkId] = netDict;
  };

  Object.keys(network).forEach((nodeId) => {
    const node = network[nodeId];

    nodes.push({
      ...node,
      network: identifiers.newToOriginal[nodeId].map(({ networkId }) => networkId),
    });
  });

  Object.keys(beliefs).forEach((networkId) => {
    const netBeliefs = beliefs[networkId];

    Object.keys(netBeliefs).forEach((nodeId) => {
      const key = createKey(networkId, nodeId);
      const newNodeId = identifiers.originalToNew[key];

      newBeliefs[newNodeId] = netBeliefs[nodeId];
    });
  });

  try {
    const inferResults = combNodesAndBeliefs(nodes, newBeliefs, infereceEnabled);

    Object.keys(inferResults).forEach((newNetworkId) => {
      const inferResult = inferResults[newNetworkId];

      identifiers.newToOriginal[newNetworkId].forEach((original) => {
        const { networkId, nodeId } = original;

        addResult(networkId, nodeId, inferResult);
      });
    });

    return result;
  } catch (e) {
    console.warn(e);
    return {};
  }
};

export const combLinkagesBySubnetwork = (linkages, nodes) => {
  // debugger
  const ids = Object.keys(linkages);
  const groups = {};

  const func = (linkage, subLinkage, id) => {
    if (groups[subLinkage.networkId]) {
      groups[subLinkage.networkId].push({
        linkage,
        id,
      });
    } else {
      groups[subLinkage.networkId] = [
        {
          linkage,
          id,
        },
      ];
    }
  };

  ids.forEach((id) => {
    const linkage = linkages[id];
    const [l1, l2] = linkage;

    func(linkage, l1, id);
    func(linkage, l2, id);
  });

  nodes.forEach((node) => {
    if (groups[node.id] === undefined) {
      groups[node.id] = [];
    }
  });

  return groups;
};

export const combAllLinkagesBySubnetwork = (links, nodes) => {
  const ids = Object.keys(links);
  const temp = ids.reduce((p, id) => ([...p, links[id]]), []);
  const linkages = createMissingLinkages(temp);

  const groups = {};

  const func = (linkage, subLinkage) => {
    if (groups[subLinkage.networkId]) {
      groups[subLinkage.networkId].push(linkage);
    } else {
      groups[subLinkage.networkId] = [
        linkage,
      ];
    }
  };

  linkages.forEach((linkage) => {
    const [l1, l2] = linkage;

    func(linkage, l1);
    func(linkage, l2);
  });

  nodes.forEach((node) => {
    if (groups[node.id] === undefined) {
      groups[node.id] = [];
    }
  });

  return groups;
};

export const combLinkagesByTwoSubnetwork = (linkages) => {
  const ids = Object.keys(linkages);
  const groups = [];

  const findGroupsItem = (l1, l2) => {
    const temp = groups.find(g => g.networkId1 === l1.networkId && g.networkId2 === l2.networkId);

    if (temp) return temp;
    return groups.find(g => g.networkId1 === l2.networkId && g.networkId2 === l1.networkId);
  };

  ids.forEach((id) => {
    const linkage = linkages[id];
    const [l1, l2] = linkage;
    const obj = findGroupsItem(l1, l2);

    if (obj) {
      obj.linkages.push(linkage);
      obj.linkagesIds.push(id);
    } else {
      groups.push({
        networkId1: l1.networkId,
        networkId2: l2.networkId,
        linkages: [linkage],
        linkagesIds: [id],
      });
    }
  });

  return groups;
};

export const combSubnetworksById = subnetworks => subnetworks.reduce((p, { id, name }) => {
  p[id] = name;
  return p;
}, {});

export const combSubnetworksColorById = subnetworks => subnetworks.reduce((p, { id, color }) => {
  p[id] = color;
  return p;
}, {});
