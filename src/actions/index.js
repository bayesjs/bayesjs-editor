import { getNodes } from '../selectors';

export const PERSIST_STATE = 'PERSIST_STATE';
export const NEW_NETWORK = 'NEW_NETWORK';
export const LOAD_NETWORK = 'LOAD_NETWORK';
export const CHANGE_NETWORK_PROPERTY = 'CHANGE_NETWORK_PROPERTY';
export const ADD_NODE = 'ADD_NODE';
export const REMOVE_NODE = 'REMOVE_NODE';
export const ADD_SUPER_NODE = 'ADD_SUPER_NODE';
export const REMOVE_SUPER_NODE = 'REMOVE_SUPER_NODE';
export const ADD_PARENT = 'ADD_PARENT';
export const REMOVE_PARENT = 'REMOVE_PARENT';
export const CHANGE_NODE_ID = 'CHANGE_NODE_ID';
export const CHANGE_NODE_DESCRIPTION = 'CHANGE_NODE_DESCRIPTION';
export const CHANGE_NODE_POSITION = 'CHANGE_NODE_POSITION';
export const CHANGE_NODE_STATES = 'CHANGE_NODE_STATES';
export const CHANGE_NODE_CPT = 'CHANGE_NODE_CPT';
export const SET_BELIEF = 'SET_BELIEF';
export const ADD_LINKAGE = 'ADD_LINKAGE';
export const REMOVE_LINKAGE = 'REMOVE_LINKAGE';

export const NETWORK_KINDS = {
  BN: 'BN',
  MSBN: 'MSBN',
};

const persistState = () => ({
  type: PERSIST_STATE,
});

export const newNetwork = (kind: string = NETWORK_KINDS.BN) => dispatch => {
  dispatch({ 
    type: NEW_NETWORK,
    kind
  });
  dispatch(persistState());
};

export const loadNetwork = state => dispatch => {
  dispatch({
    type: LOAD_NETWORK,
    payload: { state },
  });

  dispatch(persistState());
};

export const changeNetworkProperty = (name, value) => dispatch => {
  dispatch({
    type: CHANGE_NETWORK_PROPERTY,
    payload: { name, value },
  });

  dispatch(persistState());
};

export const addNode = (id, states, position) => dispatch => {
  dispatch({
    type: ADD_NODE,
    payload: { id, states, position },
  });

  dispatch(persistState());
};

export const removeNode = id => (dispatch, getState) => {
  dispatch({
    type: REMOVE_NODE,
    payload: { id, nodes: getNodes(getState()) },
  });

  dispatch(persistState());
};

export const addParent = (id, parentId) => (dispatch, getState) => {
  dispatch({
    type: ADD_PARENT,
    payload: { id, parentId, nodes: getNodes(getState()) },
  });

  dispatch(persistState());
};

export const removeParent = (id, parentId) => (dispatch, getState) => {
  dispatch({
    type: REMOVE_PARENT,
    payload: { id, parentId, nodes: getNodes(getState()) },
  });

  dispatch(persistState());
};

export const changeNodeId = (id, nextId) => dispatch => {
  dispatch({
    type: CHANGE_NODE_ID,
    payload: { id, nextId },
  });

  dispatch(persistState());
};

export const changeNodeDescription = (id, description) => dispatch => {
  dispatch({
    type: CHANGE_NODE_DESCRIPTION,
    payload: { id, description },
  });

  dispatch(persistState());
};

export const changeNodePosition = (id, x, y) => dispatch => {
  dispatch({
    type: CHANGE_NODE_POSITION,
    payload: { id, x, y },
  });

  dispatch(persistState());
};

export const changeNodeStates = (id, states) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_NODE_STATES,
    payload: { id, states, nodes: getNodes(getState()) },
  });

  dispatch(persistState());
};

export const changeNodeCpt = (id, cpt) => dispatch => {
  dispatch({
    type: CHANGE_NODE_CPT,
    payload: { id, cpt },
  });

  dispatch(persistState());
};

export const setBelief = (nodeId, state, subnetworkId) => dispatch => {
  dispatch({
    type: SET_BELIEF,
    payload: { nodeId, state, subnetworkId },
  });

  dispatch(persistState());
};

export const addSuperNode = (state, position) => (dispatch) => {
  const id = state.network.id || state.network.name;
  dispatch({
    type: ADD_SUPER_NODE,
    payload: { id, state, position }
  });

  dispatch(persistState());
};

export const removeSuperNode = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_SUPER_NODE,
    payload: { id }
  });

  dispatch(persistState());
};

export const addLinkage = (linkage) => (dispatch) => {
  dispatch({
    type: ADD_LINKAGE,
    payload: { linkage }
  });

  dispatch(persistState());
};

export const removeLinkage = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_LINKAGE,
    payload: { id }
  });

  dispatch(persistState());
};
