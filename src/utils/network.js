const topologicalSort = (nodes) => {
  const nodeIds = nodes.map(n => n.id);
  const dict = {};

  nodeIds.forEach((id) => {
    dict[id] = {
      childs: [],
      parents: [],
    };
  });

  nodes.forEach((node) => {
    dict[node.id].parents = node.parents;

    node.parents.forEach((parentId) => {
      const t = dict[parentId].childs;

      dict[parentId].childs = [...t, node.id];
    });
  });

  const S = [];
  nodeIds.forEach((id) => {
    if (dict[id].parents.length === 0) {
      S.push(id);
    }
  });

  const removeEdge = (id1, id2) => {
    dict[id2].childs = dict[id2].childs.filter(x => x !== id1);
    dict[id2].parents = dict[id2].parents.filter(x => x !== id1);

    dict[id1].childs = dict[id1].childs.filter(x => x !== id2);
    dict[id1].parents = dict[id1].parents.filter(x => x !== id2);
  };

  const L = [];
  while (S.length > 0) {
    const n = S.shift();
    L.push(n);

    dict[n].childs.forEach((m) => {
      removeEdge(n, m);

      if (dict[m].parents.length === 0) {
        S.push(m);
      }
    });
  }

  let cyclic = false;
  const keys = Object.keys(dict);

  for (const key of keys) { // eslint-disable-line
    const value = dict[key];
    if (value.childs.length > 0 || value.parents.length > 0) {
      cyclic = true;
      break;
    }
  }

  return {
    cyclic,
    sort: L,
  };
};

/**
 * Check if a graph/network has cycles.
 * @param nodes Array of nodes from graph/network.
 */
export const hasCycles = nodes => topologicalSort(nodes).cyclic;
