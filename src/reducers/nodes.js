import {
  NEW_NETWORK,
  LOAD_NETWORK,
  ADD_NODE,
  REMOVE_NODE,
  ADD_PARENT,
  REMOVE_PARENT,
  CHANGE_NODE_ID,
  CHANGE_NODE_STATES,
  CHANGE_NODE_CPT,
  CHANGE_NODE_DESCRIPTION,
} from '../actions';

const arrayEqual = (arr1, arr2) => {
  if (arr1 === arr2) {
    return true;
  }

  if (arr1 == null || arr2 == null) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

const buildWhens = (nodes, whens, acc = {}) => {
  if (nodes.length === 0) {
    whens.push(acc);
    return;
  }

  const node = nodes[0];

  node.states.forEach(state => {
    buildWhens(nodes.slice(1), whens, {
      ...acc,
      [node.id]: state,
    });
  });
};

const changeParentStates = (node, parentId, nextParentStates, nodes) => {
  const parents = nodes
    .filter(x => node.parents.includes(x.id))
    .map(x => ({
      ...x,
      states: x.id === parentId ? nextParentStates : x.states,
    }));

  const whens = [];

  buildWhens(parents, whens);

  const newCpt = whens.map(when => {
    const newWhenKeys = Object.keys(when)
      .sort((a, b) => a.localeCompare(b));

    const oldRow = node.cpt.find(row => {
      const oldWhenKeys = Object.keys(row.when)
        .sort((a, b) => a.localeCompare(b));

      if (!arrayEqual(newWhenKeys, oldWhenKeys)) {
        return false;
      }

      for (let i = 0; i < oldWhenKeys.length; i++) {
        const state = oldWhenKeys[i];

        if (when[state] !== row.when[state]) {
          return false;
        }
      }

      return true;
    });

    const newThen = oldRow != null ? (
      oldRow.then
    ) : (
      node.states.reduce((acc, state) => ({
        ...acc,
        [state]: 1 / node.states.length,
      }), {})
    );

    return {
      when,
      then: newThen,
    };
  });

  return {
    ...node,
    cpt: newCpt,
  };
};

const changeCptStates = (cpt, nextStates) => {
  const newCpt = { ...cpt };
  const previousStates = Object.keys(newCpt);

  const newStates = nextStates.filter(x =>
    !previousStates.some(y => y === x)
  );

  const deletedStates = previousStates.filter(x =>
    !nextStates.some(y => y === x)
  );

  newStates.forEach(newState => {
    newCpt[newState] = 0;
  });

  let removedProbabilities = 0;

  deletedStates.forEach(deletedState => {
    removedProbabilities += newCpt[deletedState];
    delete newCpt[deletedState];
  });

  nextStates.forEach(state => {
    newCpt[state] += removedProbabilities / nextStates.length;
  });

  return newCpt;
};

const changeNodeStates = (node, nextStates) => {
  let cpt;

  if (node.parents.length === 0) {
    cpt = changeCptStates(node.cpt, nextStates);
  } else {
    cpt = node.cpt.map(row => ({
      ...row,
      then: changeCptStates(row.then, nextStates),
    }));
  }

  return {
    ...node,
    states: nextStates,
    cpt,
  };
};

const changeParentId = (node, previousId, nextId) => ({
  ...node,
  parents: node.parents.map(x =>
    (x === previousId ? nextId : x)
  ),
  cpt: node.cpt.map(row => {
    const when = { ...row.when };

    delete when[previousId];
    when[nextId] = row.when[previousId];

    return { ...row, when };
  }),
});

const hasCycles = (nodes, nodeToStartFrom, nodeToFindId) => {
  for (let i = 0; i < nodeToStartFrom.parents.length; i++) {
    const parentId = nodeToStartFrom.parents[i];

    if (parentId === nodeToFindId) {
      return true;
    }

    const parent = nodes.find(x => x.id === parentId);

    if (hasCycles(nodes, parent, nodeToFindId)) {
      return true;
    }
  }

  return false;
};

const addParent = (node, parentId, nodes) => {
  // Don't add the same node as a parent of itself
  if (node.id === parentId) {
    return node;
  }

  // Don't add if already parent
  if (node.parents.some(x => x === parentId)) {
    return node;
  }

  const parent = nodes.find(x => x.id === parentId);

  // Don't add if adds cycles
  if (hasCycles(nodes, parent, node.id)) {
    return node;
  }

  let cpt = null;

  if (node.parents.length === 0) {
    cpt = parent.states.map(state => ({
      when: { [parentId]: state },
      then: { ...node.cpt },
    }));
  } else {
    cpt = [];

    parent.states.forEach(state => {
      node.cpt.forEach(oldRow => {
        cpt.push({
          when: { ...oldRow.when, [parentId]: state },
          then: { ...oldRow.then },
        });
      });
    });
  }

  return {
    ...node,
    parents: [...node.parents, parentId],
    cpt,
  };
};

const removeParent = (node, parentId, nodes) => {
  const newParents = node.parents.filter(x => x !== parentId);
  const parent = nodes.find(x => x.id === parentId);

  let cpt = null;

  if (newParents.length === 0) {
    cpt = node.cpt[0].then;
  } else {
    cpt = node.cpt
      .filter(x => x.when[parentId] === parent.states[0])
      .map(x => {
        const newRow = {
          when: {},
          then: x.then,
        };

        newParents.forEach(p => (newRow.when[p] = x.when[p]));

        return newRow;
      });
  }

  return {
    ...node,
    parents: newParents,
    cpt,
  };
};

const nodeReducer = (node, action) => {
  if (node.parents.some(x => x === action.payload.id)) {
    if (action.type === REMOVE_NODE) {
      return removeParent(
        node,
        action.payload.id,
        action.payload.nodes,
      );
    } else if (action.type === CHANGE_NODE_ID) {
      return changeParentId(
        node,
        action.payload.id,
        action.payload.nextId,
      );
    } else if (action.type === CHANGE_NODE_STATES) {
      return changeParentStates(
        node,
        action.payload.id,
        action.payload.states,
        action.payload.nodes,
      );
    }
  }

  if (node.id !== action.payload.id) {
    return node;
  }

  switch (action.type) {
    case ADD_PARENT:
      return addParent(node, action.payload.parentId, action.payload.nodes);
    case REMOVE_PARENT:
      return removeParent(node, action.payload.parentId, action.payload.nodes);
    case CHANGE_NODE_STATES:
      return changeNodeStates(node, action.payload.states);
    case CHANGE_NODE_ID:
      return {
        ...node,
        id: action.payload.nextId,
      };
    case CHANGE_NODE_CPT:
      return {
        ...node,
        cpt: action.payload.cpt,
      };
    case CHANGE_NODE_DESCRIPTION:
      return {
        ...node,
        description: action.payload.description,
      };
    default:
      return node;
  }
};

const newNode = ({ id, states }) => {
  const cpt = {};

  states.forEach(state => {
    cpt[state] = 1 / states.length;
  });

  return ({
    id,
    states,
    parents: [],
    cpt,
  });
};

export default (state = [], action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return [];
    case LOAD_NETWORK:
      return action.payload.state.nodes;
    case ADD_NODE:
      return [
        ...state,
        newNode(action.payload),
      ];
    case REMOVE_NODE:
      return state
        .filter(node => node.id !== action.payload.id)
        .map(node => nodeReducer(node, action));
    case ADD_PARENT:
    case REMOVE_PARENT:
    case CHANGE_NODE_ID:
    case CHANGE_NODE_STATES:
    case CHANGE_NODE_CPT:
    case CHANGE_NODE_DESCRIPTION:
      return state.map(node => nodeReducer(node, action));
    default:
      return state;
  }
};
