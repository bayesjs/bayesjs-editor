import { v4 } from 'uuid';

const weakMap = new WeakMap();

export const createNodeId = nodeId => `${v4()}--${nodeId}`;

export const separeteNodes = (subnetworks, linkages) => {
  const connectedNodes = [];
  const notConnectedNodes = [];
  const links = linkages.reduce((p, [l1, l2]) => {
    p.push({
      networkId: l1.networkId,
      nodeId: l1.nodeId,
    });
    p.push({
      networkId: l2.networkId,
      nodeId: l2.nodeId,
    });
    return p;
  }, []);

  subnetworks.forEach((net) => {
    const netId = net.id;
    const nodeIds = Object.keys(net.nodes);

    nodeIds.forEach((nodeId) => {
      const node = net.nodes[nodeId];
      const isLink = links.some(l => l.networkId === net.id && l.nodeId === nodeId);

      if (isLink) {
        connectedNodes.push({
          ...node,
          networkId: netId,
        });
      } else {
        notConnectedNodes.push({
          ...node,
          networkId: netId,
        });
      }
    });
  });

  return {
    connectedNodes,
    notConnectedNodes,
  };
};

export const createSuperNodes = (nodes, linkages) => {
  const linkagesClone = linkages.slice();
  const superNodes = [];

  const findNode = (node) => {
    const { networkId, nodeId } = node;

    return nodes.find(n => n.id === nodeId && n.networkId === networkId);
  };

  const find = l => superNodes
    .find(({ originals }) => originals
      .some(({ networkId, id }) => l.networkId === networkId && l.nodeId === id));

  const mergeParents = superArray => superArray.reduce((p, array) => {
    array.forEach((item) => {
      const { networkId, nodeId } = item;
      // Validar a renomeação
      const alreadyAdd = p.some(node => node.networkId === networkId && node.nodeId === nodeId);
      if (!alreadyAdd) p.push(item);
    });
    return p;
  }, []);

  const mergeCpts = (superCpts) => {
    if (superCpts.length === 0) return superCpts;
    return superCpts.reduce((array, obj) => [...array, ...obj]);
  };

  linkagesClone.forEach((linkage) => {
    const [l1, l2] = linkage;

    let sNode = find(l1);

    if (sNode === undefined) {
      sNode = find(l2);

      if (sNode === undefined) {
        const temp = findNode(l1);
        const temp2 = findNode(l2);
        // if (temp === undefined || temp2 === undefined) continue

        // Criar supernode com os dois links
        superNodes.push({
          id: createNodeId(l1.nodeId),
          originals: [temp, temp2],
          parents: [],
          states: temp.states,
        });
      } else {
        // Add l1 no supernoda
        const temp = findNode(l1);

        sNode.originals.push(temp);
      }
    } else if (find(l2) === undefined) {
      // Add l2 no supernoda
      const temp = findNode(l2);

      sNode.originals.push(temp);
    }
  });

  superNodes.forEach((node) => {
    const allParents = [];
    const allCpt = [];
    let cptObj = null;

    node.originals.forEach((original) => {
      const { networkId } = original;

      if (original.parents) {
        allParents.push(original.parents.map(nodeId => ({ nodeId, networkId })));
      }

      if (original.cpt) {
        if (Array.isArray(original.cpt)) {
          allCpt.push(original.cpt.map(({ then, when }) => {
            const keys = Object.keys(when);
            const newWhen = {};

            keys.forEach((key) => {
              newWhen[key] = {
                value: when[key],
                networkId,
              };
            });

            return {
              when: newWhen,
              then,
            };
          }));
        } else if (cptObj === null) {
          cptObj = original.cpt;
        }
      }
    });

    node.parents = mergeParents(allParents);
    if (allCpt.length) {
      node.cpt = mergeCpts(allCpt, node.parents, node.states);
    } else {
      node.cpt = cptObj;
    }
  });

  return superNodes;
};

export const createSuperNode = (node) => {
  let cpt;

  if (Array.isArray(node.cpt)) {
    cpt = node.cpt.map(({ when, then }) => {
      const keys = Object.keys(when);
      const newWhen = {};

      keys.forEach((key) => {
        newWhen[key] = {
          value: when[key],
          networkId: node.networkId,
        };
      });

      return {
        when: newWhen,
        then,
      };
    });
  } else {
    const temp = node.cpt;
    const keys = Object.keys(temp);
    cpt = {};

    keys.forEach((key) => {
      const value = temp[key];

      cpt[key] = { value, networkId: node.networkId };
    });
  }

  const newNode = {
    id: createNodeId(node.id),
    cpt,
    states: node.states,
    parents: node.parents.map(p => ({ networkId: node.networkId, nodeId: p })),
    originals: [node],
  };

  return newNode;
};

export const createKey = (networkId, nodeId) => `${networkId}(${nodeId})`;
export const keyToNetworkAndNode = (key) => {
  const [networkId, nodeId] = key.split('(');

  return {
    networkId,
    nodeId: nodeId.replace(')', ''),
  };
};

export const createIdentifier = (nodes) => {
  const superNodes = nodes.slice();
  const originalToNew = {};
  const newToOriginal = {};

  superNodes.forEach((superNode) => {
    const { id } = superNode;
    const newToOriginalList = [];

    superNode.originals.forEach((originalNode) => {
      const key = createKey(originalNode.networkId, originalNode.id);

      originalToNew[key] = id;
      newToOriginalList.push({
        networkId: originalNode.networkId,
        nodeId: originalNode.id,
      });
    });

    newToOriginal[id] = newToOriginalList;
  });

  return {
    originalToNew,
    newToOriginal,
  };
};

export const checkDuplicatesCpts = (cpts) => {
  const result = [];
  const ignoreIndexes = [];

  for (let i = 0; i < cpts.length; i++) {
    if (ignoreIndexes.indexOf(i) > -1) continue;
    const cpt1 = cpts[i];
    const whenKeys1 = Object.keys(cpt1.when);
    const duplicates = [];

    for (let j = i + 1; j < cpts.length; j++) {
      const cpt2 = cpts[j];
      const whenKeys2 = Object.keys(cpt2.when);
      const sameWhens = whenKeys1.length === whenKeys2.length
        && whenKeys1.every(wk => cpt1.when[wk] === cpt2.when[wk]);

      if (sameWhens) {
        duplicates.push(cpt2);
        ignoreIndexes.push(j);
      }
    }

    if (duplicates.length > 0) {
      const all = [...duplicates, cpt1];
      const thenKeys = Object.keys(cpt1.then);
      let { then } = all[0];

      for (let j = 1; j < all.length; j++) {
        const nThen = all[j].then;

        if (nThen[thenKeys[0]] !== 0.5) {
          then = nThen;
          break;
        }
      }

      result.push({
        when: cpt1.when,
        then,
      });
    } else {
      result.push(cpt1);
    }
  }

  return result;
};

export const mergeCpts = (cpts, identifiers) => {
  if (Array.isArray(cpts)) {
    const newCpts = [];

    cpts.forEach((cpt) => {
      if (cpt.when && cpt.then) {
        const whenKeys = Object.keys(cpt.when);
        const newWhen = {};

        whenKeys.forEach((whenKey) => {
          const whenItem = cpt.when[whenKey];
          const key = createKey(whenItem.networkId, whenKey);
          const whenId = identifiers[key];

          newWhen[whenId] = whenItem.value;
        });

        newCpts.push({
          when: newWhen,
          then: cpt.then,
        });
      }
    });

    return checkDuplicatesCpts(newCpts);
  }
  const keys = Object.keys(cpts);
  if (typeof cpts[keys[0]] === 'object') {
    const result = {};

    keys.forEach((key) => {
      const value = cpts[key];

      result[key] = value.value;
    });

    return result;
  }

  return cpts;
};

export const createMissingLinkages = (linkages) => {
  const cacheLinkages = weakMap.get(linkages);
  if (cacheLinkages) return cacheLinkages;
  const newLinkages = [];
  // validar

  const isConnected = (a, b) => linkages.some(([l1, l2]) => (
    l1.networkId === a.networkId && l1.nodeId === a.nodeId
        && l2.networkId === b.networkId && l2.nodeId === b.nodeId)
        || (l2.networkId === a.networkId && l2.nodeId === a.nodeId
        && l1.networkId === b.networkId && l1.nodeId === b.nodeId));

  const list = linkages.reduce((p, [l1, l2]) => {
    if (!p.some(x => x.networkId === l1.networkId && x.nodeId === l1.nodeId)) {
      p.push(l1);
    }
    if (!p.some(x => x.networkId === l2.networkId && x.nodeId === l2.nodeId)) {
      p.push(l2);
    }
    return p;
  }, []);

  const getNeighbors = (allLinkages, linkageItem) => {
    const result = [];
    const { networkId, nodeId } = linkageItem;

    allLinkages.forEach(([l1, l2]) => {
      if (l1.networkId === networkId && l1.nodeId === nodeId) {
        result.push(l2);
      } else if (l2.networkId === networkId && l2.nodeId === nodeId) {
        result.push(l1);
      }
    });

    return result;
  };

  list.forEach((link) => {
    const neighbors = getNeighbors(
      [
        ...linkages,
        ...newLinkages,
      ],
      link,
    );

    for (let i = 0; i < neighbors.length; i++) {
      const neighborA = neighbors[i];

      for (let j = i + 1; j < neighbors.length; j++) {
        const neighborB = neighbors[j];

        if (!isConnected(neighborA, neighborB)) {
          newLinkages.push([neighborA, neighborB]);
        }
      }
    }
  });

  const result = [
    ...linkages,
    ...newLinkages,
  ];
  weakMap.set(linkages, result);
  return result;
};

export const originalSubnetworkToNew = (subnetwork, identifiers) => {
  const { nodes } = subnetwork;
  const { originalToNew } = identifiers;
  const newNet = { };

  const getNewNodeId = (nodeId) => {
    const key = createKey(subnetwork.id, nodeId);
    return originalToNew[key];
  };

  Object.keys(nodes).forEach((nodeId) => {
    const node = nodes[nodeId];
    const newNodeId = getNewNodeId(nodeId);
    const { cpt, parents } = node;
    const newParents = [];
    let newCpts = cpt;

    parents.forEach((parent) => {
      const newParentId = getNewNodeId(parent);

      newParents.push(newParentId);
    });

    if (Array.isArray(cpt)) {
      newCpts = [];

      cpt.forEach(({ when, then }) => {
        const whenKeys = Object.keys(when);
        const newWhen = {};

        whenKeys.forEach((whenKey) => {
          newWhen[getNewNodeId(whenKey)] = when[whenKey];
        });

        newCpts.push({
          when: newWhen,
          then,
        });
      });
    }

    newNet[newNodeId] = {
      cpt: newCpts,
      parents: newParents,
    };
  });

  return newNet;
};

export const mergeNetworks = (subnetworks, linkages) => {
  let network = {};
  const nodes = [];
  const allLinkages = createMissingLinkages(linkages);
  const { notConnectedNodes, connectedNodes } = separeteNodes(subnetworks, allLinkages);
  const superNodes = createSuperNodes(connectedNodes, allLinkages);

  notConnectedNodes.forEach((node) => {
    const newNode = createSuperNode(node);

    nodes.push(newNode);
  });

  superNodes.forEach(node => nodes.push(node));

  // log(nodes);
  const identifiers = createIdentifier(nodes);
  const identifierOriginalToNew = identifiers.originalToNew;
  const finalNodes = [];

  nodes.forEach((node) => {
    const newParents = [];

    node.parents.forEach((parent) => {
      const key = createKey(parent.networkId, parent.nodeId);
      const parentName = identifierOriginalToNew[key];

      newParents.push(parentName);
    });

    finalNodes.push({
      id: node.id,
      cpt: mergeCpts(node.cpt, identifierOriginalToNew),
      parents: newParents,
      states: node.states,
    });
  });


  network = finalNodes.reduce((p, node) => {
    p[node.id] = {
      id: node.id,
      states: node.states,
      cpt: node.cpt,
      parents: node.parents,
    };
    return p;
  }, {});

  const newSubnetworks = subnetworks.map(s => originalSubnetworkToNew(s, identifiers));
  const result = {
    network,
    subnetworks: newSubnetworks,
    identifiers,
  };

  return result;
};

export const linkagesByNetwork = (linkages) => {
  const result = {};
  const add = (networkId, nodeId) => {
    const itens = result[networkId] || [];

    if (itens.indexOf(nodeId) === -1) {
      itens.push(nodeId);
      result[networkId] = itens;
    }
  };

  linkages.forEach(([l1, l2]) => {
    add(l1.networkId, l1.nodeId);
    add(l2.networkId, l2.nodeId);
  });

  return result;
};
