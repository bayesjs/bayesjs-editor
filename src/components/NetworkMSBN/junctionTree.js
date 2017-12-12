import isEqual from 'lodash/isequal';

const cliquesCache = new WeakMap();

export function infer(network, nodes, given) {
  let cliques = cliquesCache.get(network);

  if (cliques === undefined) {
    cliques = buildCliques(network);
    cliquesCache.set(network, cliques);
  }

  const nodesToInfer = Object.keys(nodes);

  // TODO: considerar P(A,B,C), por enquanto só P(A)
  const nodeToInfer = nodesToInfer[0];

  const clique = cliques.find(x => x.clique.some(y => y === nodeToInfer));

  const result = clique.potentials
    .filter(x => x.when[nodeToInfer] === nodes[nodeToInfer])
    .map(x => x.then)
    .reduce((acc, x) => acc + x);

  return result;
}

const buildCliques = (network) => {
  const moralGraph = buildMoralGraph(network);
  // console.log('MORAL GRAPH');
  // moralGraph.print();
  // console.log();

  const triangulatedGraph = buildTriangulatedGraph(moralGraph);
  // console.log('TRIANGULATED GRAPH');
  // triangulatedGraph.print();
  // console.log();

  const { cliqueGraph, cliques, sepSets } = buildCliqueGraph(triangulatedGraph);
  // console.log('CLIQUE GRAPH');
  // cliqueGraph.print();
  // console.log('cliques');
  // console.dir(cliques);
  // console.log('sepSets');
  // console.dir(sepSets);
  // console.log();

  const junctionTree = buildJunctionTree(cliqueGraph, cliques, sepSets);
  // console.log('JUNCTION TREE');
  // junctionTree.print();
  // console.log('cliques');
  // console.dir(cliques);
  // console.log('sepSets');
  // console.dir(sepSets);
  // console.log();

  initializePotentials(cliques, network);
  // console.log('initialized cliques');
  // console.dir(cliques);
  // console.log();

  globalPropagation(network, junctionTree, cliques, sepSets);
  // console.log('propagated cliques');
  // console.dir(cliques);
  // console.log();

  return cliques;
};

const globalPropagation = (network, junctionTree, cliques, sepSets) => {
  let marked = [];

  const unmarkAll = () => {
    marked = [];
  };

  const isMarked = id => marked.some(x => x === id);

  const mark = (id) => {
    marked.push(id);
  };

  const collectEvidence = (id, parentId = null) => {
    mark(id);

    const neighbors = junctionTree.getNeighborsOf(id)
      .filter(x => !isMarked(x));

    for (const neighbor of neighbors) {
      collectEvidence(neighbor, id);
    }

    if (parentId !== null) {
      const sepSet = sepSets.find(x => (x.ca === parentId && x.cb === id) || (x.ca === id && x.cb === parentId)).sharedNodes;

      const potentials = cliques.find(x => x.id === id).potentials;

      const message = buildCombinations(network, sepSet)
        .map(x => ({ when: x, then: 0 }));

      for (const row of message) {
        row.then = potentials
          .filter(potential => Object.keys(row.when).every(x => row.when[x] === potential.when[x]))
          .map(x => x.then)
          .reduce((acc, x) => acc + x);
      }

      const parent = cliques.find(x => x.id === parentId);

      parent.oldPotentials = parent.potentials.map(x => ({ when: x.when, then: x.then }));

      for (const row of message) {
        parent.potentials
          .filter(potential => Object.keys(row.when).every(x => row.when[x] === potential.when[x]))
          .forEach((potential) => {
            potential.then *= row.then;
          });
      }
    }
  };

  const distributeEvidence = (id) => {
    mark(id);

    const clique = cliques.find(x => x.id === id);
    const potentials = clique.oldPotentials;

    delete clique.oldPotentials;

    const neighbors = junctionTree.getNeighborsOf(id)
      .filter(x => !isMarked(x));

    for (const neighborId of neighbors) {
      const sepSet = sepSets.find(x => (x.ca === neighborId && x.cb === id) || (x.ca === id && x.cb === neighborId)).sharedNodes;

      const message = buildCombinations(network, sepSet)
        .map(x => ({ when: x, then: 0 }));

      for (const row of message) {
        row.then = potentials
          .filter(potential => Object.keys(row.when).every(x => row.when[x] === potential.when[x]))
          .map(x => x.then)
          .reduce((acc, x) => acc + x);
      }

      const neighbor = cliques.find(x => x.id === neighborId);

      for (const row of message) {
        neighbor.potentials
          .filter(potential => Object.keys(row.when).every(x => row.when[x] === potential.when[x]))
          .forEach((potential) => {
            potential.then *= row.then;
          });
      }
    }

    for (const neighbor of neighbors) {
      distributeEvidence(neighbor);
    }
  };

  const root = junctionTree.getNodes()[0];

  unmarkAll();
  collectEvidence(root);

  unmarkAll();
  distributeEvidence(root);
};

const initializePotentials = (cliques, network) => {
  for (const clique of cliques) {
    clique.factors = [];
    clique.potentials = [];
  }

  for (const nodeId of Object.keys(network)) {
    const node = network[nodeId];
    const nodes = node.parents.concat(node.id);

    for (const clique of cliques) {
      if (nodes.every(x => clique.clique.some(y => x === y))) {
        clique.factors.push(nodeId);
      }
    }
  }

  for (const clique of cliques) {
    const combinations = buildCombinations(network, clique.clique);

    for (const combination of combinations) {
      let value = 1;

      for (const factorId of clique.factors) {
        const factor = network[factorId];

        if (factor.parents.length > 0) {
          const when = network[factorId].parents
            .reduce((acc, x) => ({ ...acc, [x]: combination[x] }), {});

          const cptRow = factor.cpt.find(x => isEqual(x.when, when));

          value *= cptRow.then[combination[factorId]];
        } else {
          value *= factor.cpt[combination[factorId]];
        }
      }

      clique.potentials.push({
        when: combination,
        then: value,
      });
    }

    delete clique.factors;
  }
};

const buildCombinations = (network, nodesToCombine) => {
  const combinations = [];

  const makeCombinations = (nodes, acc = {}) => {
    if (nodes.length === 0) {
      combinations.push(acc);
      return;
    }

    const [nodeId, ...rest] = nodes;
    const states = network[nodeId].states;

    for (const state of states) {
      makeCombinations(rest, {
        ...acc,
        [nodeId]: state,
      });
    }
  };

  makeCombinations(nodesToCombine);

  return combinations;
};

const buildJunctionTree = (cliqueGraph, cliques, sepSets) => {
  sepSets.sort((a, b) => b.sharedNodes.length - a.sharedNodes.length);

  const spanningTree = [];

  const hasCycle = () => {
    const visited = {};

    const visit = (cliqueId, parentId) => {
      visited[cliqueId] = true;

      const adjsA = spanningTree
        .filter(x => x.ca === cliqueId)
        .map(x => x.cb);

      const adjsB = spanningTree
        .filter(x => x.cb === cliqueId)
        .map(x => x.ca);

      const adjs = adjsA.concat(adjsB);

      for (const adj of adjs) {
        if (!visited[adj]) {
          if (visit(adj, cliqueId)) {
            return true;
          }
        } else if (adj !== parentId) {
          return true;
        }
      }

      return false;
    };

    for (let i = 0; i < cliques.length; i++) {
      visited[cliques[i].id] = false;
    }

    for (let i = 0; i < cliques.length; i++) {
      if (!visited[cliques[i].id]) {
        if (visit(cliques[i].id, null)) {
          return true;
        }
      }
    }

    return false;
  };

  for (let i = 0; i < sepSets.length; i++) {
    spanningTree.push(sepSets[i]);

    if (hasCycle()) {
      spanningTree.pop();
    }
  }

  const junctionTree = cliqueGraph.clone();

  for (let i = sepSets.length - 1; i >= 0; i--) {
    const shouldRemove = !spanningTree.some(x => x === sepSets[i]);

    if (shouldRemove) {
      junctionTree.removeEdge(sepSets[i].ca, sepSets[i].cb);
      sepSets.splice(i, 1);
    }
  }

  return junctionTree;
};

const buildCliqueGraph = (triangulatedGraph) => {
  const cliqueGraph = createGraph();

  const cliques = [];
  const nodes = triangulatedGraph.getNodes();

  for (let i = 0; i < nodes.length; i++) {
    const clique = [nodes[i]];

    for (let j = 0; j < nodes.length; j++) {
      if (i === j) {
        continue;
      }

      if (clique.every(node => triangulatedGraph.areConnected(node, nodes[j]))) {
        clique.push(nodes[j]);
      }
    }

    clique.sort();

    if (!cliques.some(x => isEqual(x.clique, clique))) {
      cliques.push({
        id: cliques.length.toString(),
        clique,
      });
    }
  }

  const sepSets = [];

  for (let i = 0; i < cliques.length; i++) {
    cliqueGraph.addNode(cliques[i].id);

    for (let j = i + 1; j < cliques.length; j++) {
      if (i === j) {
        continue;
      }

      const sharedNodes = [];

      for (let k = 0; k < cliques[j].clique.length; k++) {
        if (cliques[i].clique.some(x => x === cliques[j].clique[k])) {
          sharedNodes.push(cliques[j].clique[k]);
        }
      }

      if (sharedNodes.length > 0) {
        cliqueGraph.addEdge(cliques[i].id, cliques[j].id);
        sepSets.push({ ca: cliques[i].id, cb: cliques[j].id, sharedNodes });
      }
    }
  }

  return {
    cliqueGraph,
    cliques,
    sepSets,
  };
};

export const buildTriangulatedGraph = (moralGraph, lastNodes = []) => {
  const triangulatedGraph = moralGraph.clone();
  const clonedGraph = triangulatedGraph.clone();
  const get = (obj) => {
    const v = obj.neighbors.length;

    return v + (lastNodes.indexOf(obj.node) === -1 ? 0 : 100);
  };

  const nodesToRemove = clonedGraph.getNodes()
    .map(node => ({
      node,
      neighbors: clonedGraph.getNeighborsOf(node),
    }))
    .sort((a, b) => get(a) - get(b));

  while (nodesToRemove.length > 0) {
    const nodeToRemove = nodesToRemove.shift();

    for (let i = 0; i < nodeToRemove.neighbors.length; i++) {
      for (let j = i + 1; j < nodeToRemove.neighbors.length; j++) {
        const neighborA = nodeToRemove.neighbors[i];
        const neighborB = nodeToRemove.neighbors[j];

        if (!clonedGraph.containsNode(neighborA) || !clonedGraph.containsNode(neighborB)) {
          continue;
        }

        if (!clonedGraph.areConnected(neighborA, neighborB)) {
          // debugger
          clonedGraph.addEdge(neighborA, neighborB, false, true);
          triangulatedGraph.addEdge(neighborA, neighborB, false, true);
        }
      }
    }

    clonedGraph.removeNode(nodeToRemove.node);
  }

  return triangulatedGraph;
};

export const buildMoralGraph = (network) => {
  const nodes = Object.keys(network).map(id => network[id]);
  const moralGraph = createGraph();

  for (const node of nodes) {
    moralGraph.addNode(node.id);

    for (const parentId of node.parents) {
      moralGraph.addEdge(parentId, node.id);
    }
  }

  for (const node of nodes) {
    for (let i = 0; i < node.parents.length; i++) {
      for (let j = i + 1; j < node.parents.length; j++) {
        if (!moralGraph.areConnected(node.parents[i], node.parents[j])) {
          moralGraph.addEdge(node.parents[i], node.parents[j], true);
        }
      }
    }
  }

  return moralGraph;
};

const createGraph = () => {
  const nodes = [];
  const edges = [];
  const moralEdges = [];
  const triangEdges = [];

  const addNode = (node) => {
    nodes.push(node);
  };

  const removeNode = (node) => {
    for (let i = edges.length - 1; i >= 0; i--) {
      if (edges[i][0] === node || edges[i][1] === node) {
        edges.splice(i, 1);
      }
    }

    for (let i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i] === node) {
        nodes.splice(i, 1);
        break;
      }
    }
  };

  const getNodes = () => nodes;

  const containsNode = node => nodes.some(x => x === node);

  const addEdge = (nodeA, nodeB, moralEdge = false, triang = false) => {
    edges.push([nodeA, nodeB]);

    if (moralEdge) {
      moralEdges.push([nodeA, nodeB]);
    }
    if (triang) {
      triangEdges.push([nodeA, nodeB]);
    }
  };

  const getMoralEdges = () => moralEdges;
  const getTriangEdges = () => triangEdges;

  const removeEdge = (nodeA, nodeB) => {
    for (let i = edges.length - 1; i >= 0; i--) {
      const shouldRemove =
        (edges[i][0] === nodeA && edges[i][1] === nodeB) ||
        (edges[i][0] === nodeB && edges[i][1] === nodeA);

      if (shouldRemove) {
        edges.splice(i, 1);
      }
    }
  };

  const areConnected = (nodeA, nodeB) => edges.some(edge => (edge[0] === nodeA && edge[1] === nodeB) ||
             (edge[0] === nodeB && edge[1] === nodeA));

  const getNeighborsOf = (node) => {
    const neighbors = [];

    for (const edge of edges) {
      if (edge[0] === node) {
        neighbors.push(edge[1]);
      } else if (edge[1] === node) {
        neighbors.push(edge[0]);
      }
    }

    return neighbors;
  };

  const clone = () => {
    const clonedGraph = createGraph();

    for (const node of nodes) {
      clonedGraph.addNode(node);
    }

    for (const edge of edges) {
      clonedGraph.addEdge(edge[0], edge[1]);
    }

    return clonedGraph;
  };

  return {
    addNode,
    removeNode,
    getNodes,
    containsNode,
    addEdge,
    removeEdge,
    areConnected,
    getNeighborsOf,
    getMoralEdges,
    getTriangEdges,
    clone,
    print: () => {
      console.log('nodes');
      console.dir(nodes);
      console.log('edges');
      console.dir(edges);
    },
  };
};
