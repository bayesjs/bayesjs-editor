import { CHANGE_NODE_ID, CHANGE_NODE_POSITION } from '../actions';

const nodeReducer = (node, action) => {
  if (action.type === CHANGE_NODE_ID && node.parents.some(x => x === action.payload.id)) {
    return {
      ...node,
      parents: node.parents.map(x =>
        (x === action.payload.id ? action.payload.nextId : x)
      ),
      cpt: node.cpt.map(row => {
        const when = {
          ...row.when,
          [action.payload.nextId]: row.when[action.payload.id],
        };

        delete when[action.payload.id];

        return { ...row, when };
      }),
    };
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
    default:
      return node;
  }
};

export default (state = [], action) => {
  switch (action.type) {
    case CHANGE_NODE_ID:
    case CHANGE_NODE_POSITION:
      return state.map(node => nodeReducer(node, action));
    default:
      return state;
  }
};
