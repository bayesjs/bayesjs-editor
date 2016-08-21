import { getNodes } from '../selectors';

export const PERSIST_STATE = 'PERSIST_STATE';
export const CHANGE_NETWORK_PROPERTY = 'CHANGE_NETWORK_PROPERTY';
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
