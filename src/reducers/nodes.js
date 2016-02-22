import { SELECT_NODE, MOVE_NODE } from '../actions/nodes';

const rain = {
  id: 'RAIN',
  states: [ 'T', 'F' ],
  parents: [],
  cpt: { 'T': 0.2, 'F': 0.8 }
};

const sprinkler = {
  id: 'SPRINKLER',
  states: [ 'T', 'F' ],
  parents: [ 'RAIN' ],
  cpt: [
    { when: { 'RAIN': 'T' }, then: { 'T': 0.01, 'F': 0.99 } },
    { when: { 'RAIN': 'F' }, then: { 'T': 0.4, 'F': 0.6 } }
  ]
};

const grassWet = {
  id: 'GRASS_WET',
  states: [ 'T', 'F' ],
  parents: [ 'RAIN', 'SPRINKLER' ],
  cpt: [
    { when: { 'RAIN': 'T', 'SPRINKLER': 'T' }, then: { 'T': 0.99, 'F': 0.01 } },
    { when: { 'RAIN': 'T', 'SPRINKLER': 'F' }, then: { 'T': 0.8, 'F': 0.2 } },
    { when: { 'RAIN': 'F', 'SPRINKLER': 'T' }, then: { 'T': 0.9, 'F': 0.1 } },
    { when: { 'RAIN': 'F', 'SPRINKLER': 'F' }, then: { 'T': 0, 'F': 1 } }
  ]
};

const initialState = {
  list: [
    { ...rain, left: 350, top: 70 },
    { ...sprinkler, left: 100, top: 70 },
    { ...grassWet, left: 225, top: 220 }
  ],
  selectedNodeId: null
};

const moveNode = (node, differenceLeft, differenceTop) => ({
  ...node,
  left: Math.round(node.left + differenceLeft),
  top: Math.round(node.top + differenceTop)
});

const nodes = (state = [], action) => {
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

const selectedNode = (state = null, action) => {
  switch (action.type) {
    case SELECT_NODE:
      return action.id;
    default:
      return state;
  }
};

export default (state = initialState, action) => {
  return {
    list: nodes(state.list, action),
    selectedNodeId: selectedNode(state.selectedNodeId, action)
  };
};
