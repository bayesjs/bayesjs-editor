import {
  ADD_SUPER_NODE,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_SUPER_NODE,
} from 'actions';

const colorsBuilder = () => {
  let list = [];
  const allColors = ['#D84315', '#BF360C', '#FBC02D', '#F9A825', '#F57F17', '#FFA000', '#FF8F00', '#FF6F00', '#F57C00', '#EF6C00', '#E65100', '#388E3C', '#2E7D32', '#689F38', '#558B2F', '#AFB42B', '#0288D1', '#0097A7', '#00838F', '#1976D2', '#1565C0', '#C2185B'];
  const shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  return () => {
    if (list.length === 0) {
      list = shuffle([...allColors]);
    }

    return list.shift();
  };
};

const colorsNol = colorsBuilder();

const formatNetwork = (state) => {
  const { network, positions, nodes } = state;

  if (nodes && positions) {
    return {
      ...network,
      nodes,
      positions,
      color: colorsNol(),
    };
  }

  return network;
};

export default (state = [], action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return [];
    case ADD_SUPER_NODE:
      return [
        ...state,
        formatNetwork(action.payload.state),
      ];
    case REMOVE_SUPER_NODE:
      return state
        .filter(n => n.id !== action.payload.id);

    case LOAD_NETWORK: {
      const { subnetworks } = action.payload.state.network;
      return subnetworks || [];
    }
    default:
      return state;
  }
};
