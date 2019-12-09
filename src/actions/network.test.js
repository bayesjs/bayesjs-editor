import {
  PERSIST_STATE,
  UPDATE_NETWORK_NAME,
  UPDATE_NETWORK_DESCRIPTION,
  UPDATE_NETWORK_WIDTH,
  UPDATE_NETWORK_HEIGHT,
  UPDATE_NETWORK_INFERENCE_ENABLED,
  UPDATE_NETWORK_PROPERTIES_PANEL_VISIBLE,
  UPDATE_NETWORK_SELECTED_NODES,
} from 'actions';

import {
  onUpdateNetworkName,
  onUpdateNetworkDescription,
  onUpdateNetworkWidth,
  onUpdateNetworkHeight,
  onUpdateNetworkInferenceEnabled,
  onUpdateNetworkPropertiesPanelVisible,
  onUpdateNetworkSelectedNodes,
} from './network';


const persistStateAction = {
  type: PERSIST_STATE,
};

describe('Actions', () => {
  let dispatch;

  beforeAll(() => {
    dispatch = jest.fn();
  });

  beforeEach(() => {
    dispatch.mockClear();
  });

  describe('onUpdateNetworkName', () => {
    const name = 'network name';

    beforeEach(() => {
      onUpdateNetworkName(name)(dispatch);
    });

    it('calls dispatch with type UPDATE_NETWORK_NAME and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: UPDATE_NETWORK_NAME,
        payload: { name },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('onUpdateNetworkDescription', () => {
    const description = 'network description';

    beforeEach(() => {
      onUpdateNetworkDescription(description)(dispatch);
    });

    it('calls dispatch with type UPDATE_NETWORK_DESCRIPTION and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: UPDATE_NETWORK_DESCRIPTION,
        payload: { description },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('onUpdateNetworkWidth', () => {
    const width = 1000;

    beforeEach(() => {
      onUpdateNetworkWidth(width)(dispatch);
    });

    it('calls dispatch with type UPDATE_NETWORK_WIDTH and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: UPDATE_NETWORK_WIDTH,
        payload: { width },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('onUpdateNetworkHeight', () => {
    const height = 400;

    beforeEach(() => {
      onUpdateNetworkHeight(height)(dispatch);
    });

    it('calls dispatch with type UPDATE_NETWORK_HEIGHT and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: UPDATE_NETWORK_HEIGHT,
        payload: { height },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('onUpdateNetworkInferenceEnabled', () => {
    const inferenceEnabled = true;

    beforeEach(() => {
      onUpdateNetworkInferenceEnabled(inferenceEnabled)(dispatch);
    });

    it('calls dispatch with type UPDATE_NETWORK_INFERENCE_ENABLED and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: UPDATE_NETWORK_INFERENCE_ENABLED,
        payload: { inferenceEnabled },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('onUpdateNetworkpropertiesPanelVisible', () => {
    const propertiesPanelVisible = true;

    beforeEach(() => {
      onUpdateNetworkPropertiesPanelVisible(propertiesPanelVisible)(dispatch);
    });

    it('calls dispatch with type UPDATE_NETWORK_PROPERTIES_PANEL_VISIBLE and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: UPDATE_NETWORK_PROPERTIES_PANEL_VISIBLE,
        payload: { propertiesPanelVisible },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('onUpdateNetworkSelectedNodes', () => {
    const selectedNodes = ['Node 1'];

    beforeEach(() => {
      onUpdateNetworkSelectedNodes(selectedNodes)(dispatch);
    });

    it('calls dispatch with type UPDATE_NETWORK_PROPERTIES_PANEL_VISIBLE and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: UPDATE_NETWORK_SELECTED_NODES,
        payload: { selectedNodes },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });
});
