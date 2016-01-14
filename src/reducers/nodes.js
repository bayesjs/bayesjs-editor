import { MOVE_NODE } from '../actions/nodes';

const initialState = [
  { id: 'RAIN', left: 50, top: 50 },
  { id: 'SPRINKLER', left: 200, top: 150 }
];

export default (state = initialState, action) => {
  switch (action.type) {
    case MOVE_NODE:
      return state.map(node =>
        node.id === action.id ?
          moveNode(node, action.differenceLeft, action.differenceTop) :
          node
      );
    default:
      return state;
  }
};

const moveNode = (node, differenceLeft, differenceTop) => ({
  ...node,
  left: Math.round(node.left + differenceLeft),
  top: Math.round(node.top + differenceTop)
});
