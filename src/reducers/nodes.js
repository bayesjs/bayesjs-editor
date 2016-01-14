import { MOVE_NODE } from '../actions/nodes';

const initialState = [
  { id: 'RAIN', left: 350, top: 70, parents: [] },
  { id: 'SPRINKLER', left: 100, top: 70, parents: [ 'RAIN' ] },
  { id: 'GRASS_WET', left: 225, top: 220, parents: [ 'RAIN', 'SPRINKLER' ] }
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
