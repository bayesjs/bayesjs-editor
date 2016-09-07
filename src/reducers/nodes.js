import {
  ADD_NODE,
  REMOVE_NODE,
  CHANGE_NODE_ID,
  CHANGE_NODE_POSITION,
  CHANGE_NODE_STATES,
  CHANGE_NODE_CPT,
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
    const when = {
      ...row.when,
      [nextId]: row.when[previousId],
    };

    delete when[previousId];

    return { ...row, when };
  }),
});

const removeParent = (node, parentId, nodes) => {
  const newParents = node.parents.filter(x => x !== parentId);

  let cpt = [];

  if (newParents.length === 0) {
    cpt = node.cpt[0].then;
  } else {
    const parent = nodes.find(x => x.id === parentId);

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
    case CHANGE_NODE_ID:
      return {
        ...node,
        id: action.payload.nextId,
      };
    case CHANGE_NODE_POSITION:
      return {
        ...node,
        position: { x: action.payload.x, y: action.payload.y },
      };
    case CHANGE_NODE_STATES:
      return changeNodeStates(node, action.payload.states);
    case CHANGE_NODE_CPT:
      return {
        ...node,
        cpt: action.payload.cpt,
      };
    default:
      return node;
  }
};

const newNode = ({ id, states, position }) => {
  const cpt = {};

  states.forEach(state => {
    cpt[state] = 1 / states.length;
  });

  return ({
    id,
    states,
    parents: [],
    position,
    cpt,
  });
};

export default (state = [], action) => {
  switch (action.type) {
    case ADD_NODE:
      return [
        ...state,
        newNode(action.payload),
      ];
    case REMOVE_NODE:
      return state
        .filter(node => node.id !== action.payload.id)
        .map(node => nodeReducer(node, action));
    case CHANGE_NODE_ID:
    case CHANGE_NODE_POSITION:
    case CHANGE_NODE_STATES:
    case CHANGE_NODE_CPT:
      return state.map(node => nodeReducer(node, action));
    default:
      return state;
  }
};
