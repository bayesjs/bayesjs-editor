import { v4 } from "uuid";
import { buildMoralGraph, buildTriangulatedGraph } from "./junctionTree";

const weakMap = new WeakMap();

/* DEFAULT */
export interface INode {
    id: string,
    states?: string[],
    parents: string[],
    cpt?: INodeCpt[] | INodeCptObject
}

export interface INodeCptObject {
    [id: string]: number
}

export interface INodeCpt {
    when: INodeCptWhen,
    then: INodeCptThen
}

// export interface INodeCptWithNetwork extends INodeCpt {
//     networkId: string,
// }

export interface INodeCptWithWhenNetwork {
    when: INodeCptWhenWithNetwork,
    then: INodeCptThen
}

export interface INodeCptWhenWithNetwork {
    [id: string] : { networkId: string, value: string }
}

export interface INodeCptWhen {
    [id: string] : string
}

export interface INodeCptThen {
    [id: string]: number
}

export interface INetwork {
    name: string,
    id: string,
    nodes: { [id: string]: INode }
}
/* DEFAULT */


export interface ILinkageItem {
  networkId: string,
  nodeId: string
}

export interface INodeWithNetwork extends INode {
  networkId: string
}

export interface ISepareteNodesResult {
  connectedNodes: INodeWithNetwork[],
  notConnectedNodes: INodeWithNetwork[],
}

export interface ISuperNetwork {
    nodes?: { [id: string]: INode }
}

export interface IIdentifiers  {
  originalToNew: IIdentifierOriginalToNew,
  newToOriginal: IIdentifierNewToOriginal,
}

export interface IMergeNetworks {
  network: ISuperNetwork,
  subnetworks: { [id: string]: INode }[],
  identifiers: IIdentifiers
}

export interface IIdentifierOriginalToNew {
  [id: string]: string
}

export interface IIdentifierNewToOriginal {
  [id: string]: ILinkageItem[]
}

export const createNodeId = (nodeId: string) => `${v4()}--${nodeId}`;

export const separeteNodes = (subnetworks: INetwork[], linkages: [ILinkageItem, ILinkageItem][]): ISepareteNodesResult => {
  let connectedNodes: INodeWithNetwork[] = [];
  let notConnectedNodes: INodeWithNetwork[] = [];
  const links = linkages.reduce((p, [l1, l2]) => {
    p.push({
      networkId: l1.networkId,
      nodeId: l1.nodeId
    });
    p.push({
      networkId: l2.networkId,
      nodeId: l2.nodeId
    });
    return p;
  }, []);

  for (let net of subnetworks) {
    const netId = net.id;
    const nodeIds = Object.keys(net.nodes)

    for (let nodeId of nodeIds) {
      const node = net.nodes[nodeId];
      const isLink = links.some(l => l.networkId == net.id && l.nodeId == nodeId);

      if (isLink) {
        connectedNodes.push({
          ...node,
          networkId: netId
        });
      } else {
        notConnectedNodes.push({
          ...node,
          networkId: netId
        });
      }
    }
  }

  return {
    connectedNodes,
    notConnectedNodes
  };
};

export interface ICptObjectWithNetwork {
  [id: string]: { networkId: string, value: number }
}

export interface ISuperNode  {
  id: string,
  states?: string[],
  parents: ILinkageItem[],
  cpt?: INodeCptWithWhenNetwork[] | ICptObjectWithNetwork,
  originals: INodeWithNetwork[]
};

export const createSuperNodes = (nodes: INodeWithNetwork[], linkages: [ILinkageItem, ILinkageItem][]): ISuperNode[] => {
  let linkagesClone = linkages.slice();
  let superNodes: ISuperNode[] = [];

  const findNode = ({ networkId, nodeId }: ILinkageItem) => {
    return nodes.find(n => n.id == nodeId && n.networkId == networkId);
  }; 

  const find = (l: ILinkageItem) => {
    return superNodes
      .find(({ originals }) => {
        return originals.some(({ networkId, id }) => l.networkId == networkId && l.nodeId == id)
      });
  };
  
  const mergeParents = (superArray: ILinkageItem[][]): ILinkageItem[] => {
    return superArray.reduce((p, array) => {
      for (let item of array) {
        let { networkId, nodeId } = item;
        //Validar a renomeação
        let alreadyAdd = p.some((node) => {
          return node.networkId == networkId && node.nodeId == nodeId;
        });
        if (!alreadyAdd) p.push(item);
      }
      return p;
    }, []);
  };

  const mergeCpts = (superCpts: INodeCptWithWhenNetwork[][], parents: ILinkageItem[], states : string[]): INodeCptWithWhenNetwork[] => {
    if (superCpts.length === 0) return  superCpts;
    return superCpts.reduce((array, obj) => [ ...array, ...obj ]);
    // console.log(superCpts, parents);
    // const get = (current: INodeCptWithWhenNetwork[], index: number = 1): INodeCptWithWhenNetwork[] => {
    //   let result: INodeCptWithWhenNetwork[] = [];
      
    //   if (superCpts[index] === undefined) return current;

    //   for (let cpt of superCpts[index]) {
    //     let { when, then } = cpt;
      
    //     for (let i = 0; i < current.length; i++) {
    //       let cCpt = current[i];
    //       let newThen: INodeCptThen = {};

    //       for (let state of states) {
    //         newThen[state] = then[state] + cCpt.then[state]; 
    //       }
          
    //       result.push({
    //         when: {
    //           ...when,
    //           ...cCpt.when,
    //         },
    //         then: newThen,
    //       });
    //     }
    //   }

    //   if (superCpts.length > (index + 1)) {
    //     result = get(result, index + 1);
    //   }

    //   return result;
    // }
    // let temp = get(superCpts[0]);
    
    // let temp2 = temp.map(({ when, then }) => { 
    //   let newThen: INodeCptThen = {};
    //   for (let state of states) {
    //     newThen[state] = then[state] / superCpts.length; 
    //   }
    //   return {
    //     when, 
    //     then: newThen, 
    //   };
    // });
    
    // return temp2;
  };

  for (let linkage of linkagesClone) {
    const [l1, l2] = linkage;
    
    let sNode = find(l1);
    
    if (sNode === undefined) {
      sNode = find(l2);

      if (sNode === undefined) {
        const temp = findNode(l1);
        const temp2 = findNode(l2);
        // if (temp === undefined || temp2 === undefined) continue
        
        //Criar supernode com os dois links
        superNodes.push({
          id: createNodeId(l1.nodeId),
          originals: [temp, temp2],
          parents: [],
          states: temp.states
        });
      } else {
        //Add l1 no supernoda
        const temp = findNode(l1);
        
        sNode.originals.push(temp);
      }
    } else if (find(l2) === undefined) {
      //Add l2 no supernoda
      const temp = findNode(l2);
      
      sNode.originals.push(temp);
    }
  }

  for (let node of superNodes) {
    const allParents: ILinkageItem[][] = [];
    const allCpt: INodeCptWithWhenNetwork[][] = [];
    let cptObj = null;

    for (const original of node.originals) {
      const { networkId } = original;

      if (original.parents) {
        allParents.push(
          original.parents.map((nodeId) => ({ nodeId, networkId }))
        );
      }

      if (original.cpt) {
        if (Array.isArray(original.cpt)) {
          allCpt.push(
            original.cpt.map(({ then, when }) => {
              let keys = Object.keys(when);
              let newWhen: INodeCptWhenWithNetwork = {};

              for (let key of keys) {
                newWhen[key] = {
                  value: when[key],
                  networkId,
                }
              }

              return { 
                when: newWhen, 
                then 
              }
            })
          );
        } else if (cptObj == null) {
          cptObj = original.cpt;
        }
      }
    }

    node.parents = mergeParents(allParents);
    if (allCpt.length) {
      node.cpt = mergeCpts(allCpt, node.parents, node.states);
      // console.log(node.id, node.cpt);
      
    } else {
      node.cpt = cptObj;
    }
  }

  return superNodes;
};

export const createSuperNode = (node: INodeWithNetwork): ISuperNode => {
  let cpt: (INodeCptWithWhenNetwork[] | ICptObjectWithNetwork);

  if (Array.isArray(node.cpt)) {
    cpt = node.cpt.map(({ when, then }) => {
      let keys = Object.keys(when);
      let newWhen: INodeCptWhenWithNetwork = {};

      for (let key of keys) {
        newWhen[key] = {
          value: when[key],
          networkId: node.networkId,
        }
      }

      return { 
        when: newWhen, 
        then 
      }
    });
  } else {
    const temp = node.cpt;
    const keys = Object.keys(temp);
    cpt = {};

    for (let key of keys) {
      const value = temp[key];

      cpt[key] = { value, networkId: node.networkId };
    } 
  }

  const newNode: ISuperNode = {
    id: createNodeId(node.id),
    cpt,
    states: node.states,
    parents: node.parents.map((p) => ({ networkId: node.networkId, nodeId: p })),
    originals: [node]
  };

  return newNode;
}

export const createKey = (networkId: string, nodeId: string) => `${networkId}(${nodeId})`;
export const keyToNetworkAndNode = (key: string) => {
  const [ networkId, nodeId ] = key.split('(');

  return {
    networkId,
    nodeId: nodeId.replace(')', ''),
  }
};

export const createIdentifier = (nodes: ISuperNode[]): IIdentifiers => {
  const superNodes = nodes.slice();
  let originalToNew: IIdentifierOriginalToNew = {};
  let newToOriginal: IIdentifierNewToOriginal = {};
  let newSuperNodes: ISuperNode[] = [];
  
  const findParentName = (parent: ILinkageItem): string => {
    for (let superNode of superNodes) {
      const node = superNode.originals.find((original) => {
        return original.id == parent.nodeId && original.networkId == parent.networkId;
      });

      if (node) {
        return node.id;
      }
    }
  };

  for (let superNode of superNodes) {
    const { cpt, id, states } = superNode;
    let newToOriginalList: ILinkageItem[] = [];

    for (let originalNode of superNode.originals) {
      const key = createKey(originalNode.networkId, originalNode.id);
 
      originalToNew[key] = id;
      newToOriginalList.push({
        networkId: originalNode.networkId,
        nodeId: originalNode.id,
      });
    }

    newToOriginal[id] = newToOriginalList;
  }

  return {
    originalToNew,
    newToOriginal,
  };
};

export const checkDuplicatesCpts = (cpts: INodeCpt[]): INodeCpt[] => {
  const result: INode[] = [];
  const ignoreIndexes = [];

  for (let i = 0; i < cpts.length; i++) {
    if (ignoreIndexes.indexOf(i) > -1) continue;
    const cpt1 = cpts[i];
    const whenKeys1 = Object.keys(cpt1.when);
    const duplicates = [];

    for (let j = i + 1; j < cpts.length; j++) {
      const cpt2 = cpts[j];
      const whenKeys2 = Object.keys(cpt2.when);
      const sameWhens = whenKeys1.length == whenKeys2.length && 
        whenKeys1.every(wk => cpt1.when[wk] === cpt2.when[wk]);
      
      if (sameWhens) {
        duplicates.push(cpt2);
        ignoreIndexes.push(j);
      }
    }
    
    if (duplicates.length > 0) {
      const all = [ ...duplicates, cpt1 ];
      const thenKeys = Object.keys(cpt1.then);;
      let then = all[0].then;

      for (let i = 1; i < all.length; i++) {
        const nThen = all[i].then;

        if (nThen[thenKeys[0]] != 0.5) {
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

export const mergeCpts = (cpts: INodeCptWithWhenNetwork[] | ICptObjectWithNetwork, identifiers:  { [id: string]: string }): (INodeCpt[] | INodeCptObject) => {
  if (Array.isArray(cpts)) {
    const newCpts: INodeCpt[] = [];

    for (let cpt of cpts) {
      if (cpt.when && cpt.then) {
        const whenKeys = Object.keys(cpt.when);
        let newWhen: INodeCptWhen = {};
        
        for (let whenKey of whenKeys) {
          const whenItem = cpt.when[whenKey];
          const key = createKey(whenItem.networkId, whenKey)
          const whenId = identifiers[key];
          // newWhen[identifiers[key]] = cpt.when[whenKey];
          newWhen[whenId] = whenItem.value;
        }

        newCpts.push({
          when: newWhen,
          then: cpt.then,
        });
      }
    }

    return checkDuplicatesCpts(newCpts);

  } else {
    const keys = Object.keys(cpts);
    if (typeof cpts[keys[0]] === "object") {
      let result: INodeCptObject = {};
      
      for (let key of keys) {
        const value = cpts[key];

        result[key] = value.value;
      }

      return result;
    }
    
    return cpts;
  }
};

export const createMissingLinkages = (linkages: [ILinkageItem, ILinkageItem][]): [ILinkageItem, ILinkageItem][] => {
  const cacheLinkages = weakMap.get(linkages);
  if (cacheLinkages) return cacheLinkages;
  let newLinkages:[ILinkageItem, ILinkageItem][] = [];
  //validar
  
  const isConnected = (a: ILinkageItem, b: ILinkageItem) => {
    return linkages.some(([l1, l2]) => {
      return (l1.networkId == a.networkId && l1.nodeId == a.nodeId &&
        l2.networkId == b.networkId && l2.nodeId == b.nodeId) ||
        (l2.networkId == a.networkId && l2.nodeId == a.nodeId &&
        l1.networkId == b.networkId && l1.nodeId == b.nodeId)
    });
  };

  const list = linkages.reduce((p, [l1, l2]) => {
    if (!p.some(x => x.networkId == l1.networkId && x.nodeId == l1.nodeId)) {
      p.push(l1);
    }
    if (!p.some(x => x.networkId == l2.networkId && x.nodeId == l2.nodeId)) {
      p.push(l2);
    }
    return p;
  }, []);

  const getNeighbors = (allLinkages: [ILinkageItem, ILinkageItem][], linkageItem: ILinkageItem): ILinkageItem[] => {
    let result: ILinkageItem[] = [];
    const { networkId, nodeId } = linkageItem;

    for (let [ l1, l2 ] of allLinkages) {
      if (l1.networkId == networkId && l1.nodeId == nodeId) {
        result.push(l2);
      } else if (l2.networkId == networkId && l2.nodeId == nodeId) {
        result.push(l1);
      }
    }

    return result;
  };
  
  for (let link of list) {
    const neighbors = getNeighbors(
      [
        ...linkages,
        ...newLinkages,
      ], 
      link
    );
    
    for (var i = 0; i < neighbors.length; i++) {
      let neighborA = neighbors[i];

      for (var j = i + 1; j < neighbors.length; j++) {
        let neighborB = neighbors[j];

        if (!isConnected(neighborA, neighborB)) {
          newLinkages.push([neighborA, neighborB]);
        }
      } 
    }
  }

  const result = [
    ...linkages,
    ...newLinkages
  ];
  weakMap.set(linkages, result);
  return result;
};

export const mergeNetworks = (subnetworks: INetwork[], linkages: [ILinkageItem, ILinkageItem][]): IMergeNetworks => {
  let network: ISuperNetwork = {};
  let nodes: ISuperNode[] = [];
  const allLinkages = createMissingLinkages(linkages);
  const { notConnectedNodes, connectedNodes } = separeteNodes(subnetworks, allLinkages);
  const superNodes = createSuperNodes(connectedNodes, allLinkages);
  const formatNode = ({ networkId, id }: INodeWithNetwork): ILinkageItem => ({
    networkId,
    nodeId: id
  });

  for (let node of notConnectedNodes) {
    const newNode = createSuperNode(node);
    
    nodes.push(newNode);
  }

  for (let node of superNodes) {
    nodes.push(node);
  }

  // log(nodes);
  const identifiers = createIdentifier(nodes);
  const identifierOriginalToNew = identifiers.originalToNew;
  let finalNodes: INode[] = [];

  for (let node of nodes) {
    let newParents: string[] = [];
    let newCpts: INodeCpt[] = [];//INodeCtp[] | INodeCtpObject
    let newCpt: INodeCptObject = {};

    for (let parent of node.parents) {
      const key = createKey(parent.networkId, parent.nodeId);
      const parentName = identifierOriginalToNew[key];
      
      newParents.push(parentName);
    }
    
    // if (node.id.indexOf('C') != -1) {
      // console.log(node.id);
      // console.log(JSON.stringify(mergeCpts(node.cpt, identifierOriginalToNew)));
    // }

    finalNodes.push({
      id: node.id,
      cpt: mergeCpts(node.cpt, identifierOriginalToNew),
      parents: newParents,
      states: node.states
    });
  }

  
  network = finalNodes.reduce((p, node) => {
    p[node.id] = {
      id: node.id,
      states: node.states,
      cpt: node.cpt,
      parents: node.parents,
    };
    return p;
  }, {});

  let newSubnetworks = subnetworks.map(s => originalSubnetworkToNew(s, identifiers));
  const result = {
    network,
    subnetworks: newSubnetworks,
    identifiers
  };
  // weakMap.set({ subnetworks, linkages }, result);
  return result;
};

export const originalSubnetworkToNew = (subnetwork: INetwork, identifiers: IIdentifiers): { [id: string]: INode } => {
  const { nodes } = subnetwork;
  const { originalToNew } = identifiers;
  let newNet = { };

  const getNewNodeId = (nodeId: string) => {
    const key = createKey(subnetwork.id, nodeId);
    return originalToNew[key];
  }
  
  for (const nodeId of Object.keys(nodes)) {
    const node = nodes[nodeId];
    const newNodeId = getNewNodeId(nodeId);
    const { cpt, parents } = node;
    let newParents = [];
    let newCpts = cpt;
    
    for (let parent of parents) {
      const newParentId = getNewNodeId(parent);
      
      newParents.push(newParentId);
    }

    if (Array.isArray(cpt)) {
      newCpts = [];

      for (let { when, then } of cpt) {
        const whenKeys = Object.keys(when);
        let newWhen = {};

        for (const whenKey of whenKeys) {
          newWhen[getNewNodeId(whenKey)] = when[whenKey];
        }

        newCpts.push({
          when: newWhen,
          then,
        });
      }
    }

    newNet[newNodeId] = {
      cpt: newCpts,
      parents: newParents,
    };
  }

  return newNet;
};

export const linkagesByNetwork = (linkages: [ILinkageItem, ILinkageItem][]) => {
  let result: { [id: string]: string[] } = {};
  const add = (networkId: string, nodeId: string) => {
    const itens = result[networkId] || [];
    
    if (itens.indexOf(nodeId) === -1) {
      itens.push(nodeId);
      result[networkId] = itens;
    }
  };

  for (let [l1, l2] of linkages) {
    add(l1.networkId, l1.nodeId);
    add(l2.networkId, l2.nodeId);
  }

  return result;
};

const intersection = (listA, listB) => {
  let a = new Set(listA);
  let b = new Set(listB);
  let intersection = new Set([...a].filter(x => b.has(x)));

  return [...intersection];
}

export const junctionTreeInSubnetwork = (subnetworks: INetwork[], linkages: [ILinkageItem, ILinkageItem][]) => {
  
  return null;
  const allLinkages = createMissingLinkages(linkages);
  const linksBySub = linkagesByNetwork(allLinkages);
  const moralGraphs = subnetworks.map((sub) => buildMoralGraph(sub.nodes));
  const triangGraphs = moralGraphs.map((moral, i) => {
    const nodesLinkeds = linksBySub[subnetworks[i].id];
    
    return buildTriangulatedGraph(moral, nodesLinkeds);
  });
  
  // const findLink = (networkId: string, nodeId: string) => {
  //   for (let [ l1, l2 ] of allLinkages) {
  //     if (l1.networkId == networkId && l1.nodeId == nodeId) return l2;
  //     if (l2.networkId == networkId && l2.nodeId == nodeId) return l1;
  //   }
  // };
  const isLink = (networkId: string, nodeId: string) => {
    for (let [ l1, l2 ] of allLinkages) {
      if (l1.networkId == networkId && l1.nodeId == nodeId) return true;
      if (l2.networkId == networkId && l2.nodeId == nodeId) return true;
    }
    return false;
  };

  for (let i = 0; i < triangGraphs.length; i++) {
    let subnetwork = subnetworks[i];
    let graph = triangGraphs[i];
    let moralEdges = moralGraphs[i].getMoralEdges();
    let triangEdges = graph.getTriangEdges();
    let links = linksBySub[subnetwork.id];
    console.log(triangEdges);
    for (let [nodeId1, nodeId2] of moralEdges) {
      if (links.indexOf(nodeId1) !== -1 && links.indexOf(nodeId2) !== -1) {
        //passar para as outras
        console.log('Passar (moral)', subnetwork.id, nodeId1, nodeId2);
      }
    }

    for (let [nodeId1, nodeId2] of triangEdges) {
      let isLink1 = isLink(subnetwork.id, nodeId1);
      let isLink2 = isLink(subnetwork.id, nodeId2);

      // console.log('Passar (moral)', subnetwork.id, nodeId1, nodeId2);

      if (isLink1 && isLink2) {
        console.log('Passar (triang)', subnetwork.id, nodeId1, nodeId2);
      } else if (isLink1 || isLink2) {
        let bb = graph.getNeighborsOf(nodeId1);
        let aa = graph.getNeighborsOf(nodeId2);
        let cc = intersection(aa, bb).filter(x => x != nodeId1 || x != nodeId2);
        console.log(cc, nodeId1, nodeId2);
        debugger

//         let a = new Set([1,2,3]);
// let b = new Set([4,3,2]);
// let intersection = new Set(
//     [...a].filter(x => b.has(x)));

        // console.log('Passar (triang)', subnetwork.id, nodeId1, nodeId2);
      } else if (isLink2) {
        // console.log('Passar (triang)', subnetwork.id, nodeId1, nodeId2);
      }
    }
    
  }
  
};

/**
 * Do the topological sort in a graph/network
 * @param nodes All nodes from the graph/network
 */
export const topologicalSort = (nodes: INode[]): { cyclic: boolean, sort: string[] } => {
  let nodeIds: string[] = nodes.map(n => n.id);
  let dict: { [id: string]: { parents: string[], childs: string[] } } = {};
  
  for (let id of nodeIds) {
    dict[id] = {
      childs: [],
      parents: []
    };
  }
  
  for (let node of nodes) {
    dict[node.id].parents = node.parents;

    for (let parentId of node.parents) {
      let t = dict[parentId].childs;
      dict[parentId].childs = [...t, node.id];
    }
  }

  let S: string[] = [];
  for (let id of nodeIds) {
    
    if (dict[id].parents.length == 0) {
      S.push(id);
    }
  }

  const removeEdge = (id1: string, id2: string) => {
    dict[id2].childs = dict[id2].childs.filter(x => x != id1);
    dict[id2].parents = dict[id2].parents.filter(x => x != id1);

    dict[id1].childs = dict[id1].childs.filter(x => x != id2);
    dict[id1].parents = dict[id1].parents.filter(x => x != id2);
  };

  let L = [];
  while (S.length > 0) {
    let n = S.shift();
    L.push(n);

    for (let m of dict[n].childs) {
      removeEdge(n, m);

      if (dict[m].parents.length == 0) {
        S.push(m);
      }
    }
  }

  let cyclic = false;
  const keys = Object.keys(dict);
  for (let key of keys) {
    const value = dict[key];
    if (value.childs.length > 0 || value.parents.length > 0) {
      cyclic = true;
      break;
    }
  }  

  return {
    cyclic,
    sort: L
  };
}

/**
 * Check if a graph/network has cycles.
 * @param nodes Array of nodes from graph/network.
 */
export const hasCycles = (nodes: INode[]): boolean => {
  return topologicalSort(nodes).cyclic;
}

// // inferMSBN(
// //   //sub-redes []
// //   //linkage. link entre as sub-redes
// //   //inferencias
// //   //o que eu sei 
// // )

// // infer({//Rede
// //   A: {
// //     id: 'A'
// //   },
// //   B: {
// //     id: 'B'
// //   },
// //   C: {
// //     id: 'C'
// //   },
// //   D: {
// //     id: 'D'
// //   }
// // }, {//Inferencia
// //   A: 'F',
// //   D: 'T'
// // }, {//O que eu sei que é verdade (opicional)
// //   C: 'T',
// //   B: 'F'
// // }); 
