import {
  persistState,
  UPDATE_NETWORK_NAME,
  UPDATE_NETWORK_DESCRIPTION,
  UPDATE_NETWORK_WIDTH,
  UPDATE_NETWORK_HEIGHT,
  UPDATE_NETWORK_INFERENCE_ENABLED,
  UPDATE_NETWORK_PROPERTIES_PANEL_VISIBLE,
  UPDATE_NETWORK_SELECTED_NODES,
} from 'actions';


export const onUpdateNetworkName = name => (dispatch) => {
  dispatch({
    type: UPDATE_NETWORK_NAME,
    payload: { name },
  });

  dispatch(persistState());
};

export const onUpdateNetworkDescription = description => (dispatch) => {
  dispatch({
    type: UPDATE_NETWORK_DESCRIPTION,
    payload: { description },
  });

  dispatch(persistState());
};

export const onUpdateNetworkWidth = width => (dispatch) => {
  dispatch({
    type: UPDATE_NETWORK_WIDTH,
    payload: { width },
  });

  dispatch(persistState());
};

export const onUpdateNetworkHeight = height => (dispatch) => {
  dispatch({
    type: UPDATE_NETWORK_HEIGHT,
    payload: { height },
  });

  dispatch(persistState());
};

export const onUpdateNetworkInferenceEnabled = inferenceEnabled => (dispatch) => {
  dispatch({
    type: UPDATE_NETWORK_INFERENCE_ENABLED,
    payload: { inferenceEnabled },
  });

  dispatch(persistState());
};

export const onUpdateNetworkPropertiesPanelVisible = propertiesPanelVisible => (dispatch) => {
  dispatch({
    type: UPDATE_NETWORK_PROPERTIES_PANEL_VISIBLE,
    payload: { propertiesPanelVisible },
  });

  dispatch(persistState());
};

export const onUpdateNetworkSelectedNodes = selectedNodes => (dispatch) => {
  dispatch({
    type: UPDATE_NETWORK_SELECTED_NODES,
    payload: { selectedNodes },
  });

  dispatch(persistState());
};
