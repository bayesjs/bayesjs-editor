import { addNode, infer } from 'bayesjs';
import { mergeNetworks, createKey, keyToNetworkAndNode, createMissingLinkages, junctionTreeInSubnetwork } from '../components/NetworkMSBN/helpers';

const weakMap = new WeakMap();

export const combNodesAndPositions = (nodes, positions) => nodes.map(node => ({
  ...node,
  position: positions[node.id],
}));

export const combNodesAndBeliefs = (nodes, beliefs, subnetworks = null) => {
  console.time("INFER");
  let network = {};

  const remainingNodes = [...nodes];
  
  while (remainingNodes.length > 0) {
    const nodesToAdd = [];

    for (let i = 0; i < remainingNodes.length; i++) {
      if (remainingNodes[i].parents.every(p => network.hasOwnProperty(p))) {
        nodesToAdd.push(remainingNodes.splice(i, 1)[0]);
      }
    }

    nodesToAdd.forEach(nodeToAdd => {
      network = addNode(network, nodeToAdd);
    });
  }
  
  const results = {};

  nodes.forEach(node => {
    results[node.id] = {};

    node.states.forEach(state => {
      results[node.id][state] = infer(
        network,
        { [node.id]: state },
        Object.keys(beliefs).length === 0 ? undefined : beliefs, 0
      );
    });
  });
  console.timeEnd("INFER");
  
  return results;
};

const combNetworkMSBN = (subnetworks, linkages) => {
  let cacheSubnetworks = weakMap.get(subnetworks);
  let cacheLinks = weakMap.get(linkages);

  const links = Object.keys(linkages).map(id => linkages[id]);
  const networks = subnetworks.map(({ id, name, nodes }) => {
    const dictNodes = nodes.reduce((p, node) => {
      p[node.id] = node;
      return p;
    }, {});

    return {
      id,
      name,
      nodes: dictNodes
    };
  });
  // junctionTreeInSubnetwork(networks, links);

  weakMap.set(linkages, links);
  weakMap.set(subnetworks, networks);

  return mergeNetworks(networks, links);
};

export const combNodesAndBeliefsMSBN = (networks, linkages, beliefs) => {
  console.time("MERGE");
  let cachedMerge = weakMap.get(networks);
  
  if (cachedMerge === undefined) {
    cachedMerge = combNetworkMSBN(networks, linkages);
  }
  const { network, subnetworks, identifiers } = cachedMerge;
  weakMap.set(networks, cachedMerge);
  console.timeEnd("MERGE");
  // console.log(network);

  // const ttttt = Object.keys(network)
  //   .map(nodeId => network[nodeId])
  //   .map(({ id, parents }) => ({ id, parents }))
  //   // .reduce(() => , {})

  // console.log(JSON.stringify(network, null, 2));
  let newBeliefs = {};
  let nodes = [];
  let result = {};
  const addResult = (networkId, nodeId, inferResult) => {
    let netDict = result[networkId] || {};
    let nodeDict = netDict[nodeId] || {};
    nodeDict = inferResult;
    netDict[nodeId] = nodeDict;

    result[networkId] = netDict;
  };

  for (let nodeId of Object.keys(network)) {
    const t = network[nodeId];
    const aa = identifiers.newToOriginal[nodeId].map(({ networkId }) => networkId);
    // debugger
    nodes.push({
      ...t,
      network: aa
    });
  }

  for (let networkId of Object.keys(beliefs)) {
    const netBeliefs = beliefs[networkId];
    
    for (let nodeId of Object.keys(netBeliefs)) {
      const key = createKey(networkId, nodeId);
      const newNodeId = identifiers.originalToNew[key];
      
      newBeliefs[newNodeId] = netBeliefs[nodeId];
    }    
  }

  try {
    const inferResults = combNodesAndBeliefs(nodes, newBeliefs, subnetworks);
    
    for (let newNetworkId of Object.keys(inferResults)) {
      const result = inferResults[newNetworkId];
      const networks = identifiers.newToOriginal[newNetworkId];

      for (let original of networks) {
        const { networkId, nodeId } = original;
        
        addResult(networkId, nodeId, result);
      }
      
    }

    return result;
  } catch(e) {
    console.log(e);
    return {};
  }
};

export const combLinkagesBySubnetwork = (linkages, nodes) => {
  const ids = Object.keys(linkages);
  let groups = {};

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
        }
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
  const temp = ids.reduce((p, id) => ([ ...p, links[id] ]), []);
  const linkages = createMissingLinkages(temp);
  
  let groups = {};

  const func = (linkage, subLinkage, id) => {
    if (groups[subLinkage.networkId]) {
      groups[subLinkage.networkId].push(linkage);

    } else {
      groups[subLinkage.networkId] = [
        linkage
      ];
    }
  };

  for (let linkage of linkages) {
    const [l1, l2] = linkage;

    func(linkage, l1);
    func(linkage, l2);
  }

  nodes.forEach((node) => {
    if (groups[node.id] === undefined) {
      groups[node.id] = [];
    }
  });

  return groups;
};

export const combLinkagesByTwoSubnetwork = (linkages) => {
  const ids = Object.keys(linkages);
  let groups = [];

  const findGroupsItem = (l1, l2) => {
    const temp = groups.find(g => g.networkId1 == l1.networkId && g.networkId2 == l2.networkId);

    if (temp) return temp;
    return groups.find(g => g.networkId1 == l2.networkId && g.networkId2 == l1.networkId);; 
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

export const combSubnetworksById = (subnetworks) => {
  return subnetworks.reduce((p, { id, name }) => {
    p[id] = name;
    return p;
  }, {});
};

export const combSubnetworksColorById = (subnetworks) => {
  return subnetworks.reduce((p, { id, color }) => {
    p[id] = color;
    return p;
  }, {});
};