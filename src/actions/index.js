import { getNodes } from '../selectors';

export const PERSIST_STATE = 'PERSIST_STATE';
export const CHANGE_NETWORK_PROPERTY = 'CHANGE_NETWORK_PROPERTY';
export const ADD_NODE = 'ADD_NODE';
export const REMOVE_NODE = 'REMOVE_NODE';
export const ADD_PARENT = 'ADD_PARENT';
export const REMOVE_PARENT = 'REMOVE_PARENT';
export const CHANGE_NODE_ID = 'CHANGE_NODE_ID';
export const CHANGE_NODE_POSITION = 'CHANGE_NODE_POSITION';
export const CHANGE_NODE_STATES = 'CHANGE_NODE_STATES';
export const CHANGE_NODE_CPT = 'CHANGE_NODE_CPT';

export const persistState = () => ({
  type: PERSIST_STATE,
});

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

export const changeNodePosition = (id, x, y) => ({
  type: CHANGE_NODE_POSITION,
  payload: { id, x, y },
});

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
