import { CHANGE_NODE_POSITION } from '../actions';

export default (state = [], action) => {
  switch (action.type) {
    case CHANGE_NODE_POSITION:
      return state.map(node => (
        node.id === action.payload.id ? {
          ...node,
          position: { x: action.payload.x, y: action.payload.y },
        } : node
      ));
    default:
      return state;
  }
};
